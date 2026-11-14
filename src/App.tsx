import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Attendance, Note, NoteInput, Page, Personnel, Report } from './types';
import { rankInfo, seedAttendance, seedNotes, seedPersonnel, seedReports, todayISO, uid, useLocalStorage } from './lib';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import PageTransition from './components/PageTransition';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Log from './pages/Log';
import Book from './pages/Book';
import Profile from './pages/Profile';
import Absensi from './pages/Absensi';
import Laporan from './pages/Laporan';
import Placeholder from './pages/Placeholder';

const LOAD_MS = 450;

const byDateDesc = <T extends { date: string }>(list: T[]): T[] => [...list].sort((a, b) => b.date.localeCompare(a.date));

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [personnel, setPersonnel] = useLocalStorage<Personnel>('afs.personnel', seedPersonnel);
  const [attendanceRaw, setAttendance] = useLocalStorage<Attendance[]>('afs.attendance', seedAttendance);
  const [reportsRaw, setReports] = useLocalStorage<Report[]>('afs.reports', seedReports);
  const [notesRaw, setNotes] = useLocalStorage<Note[]>('afs.notes', seedNotes);
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Satu overlay saja: perpindahan beruntun hanya memperpanjang waktu, tidak menumpuk.
  const flashLoading = useCallback(() => {
    setLoading(true);
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setLoading(false), LOAD_MS);
  }, []);
  useEffect(
    () => () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
    },
    [],
  );
  const go = (p: Page) => {
    if (p === page) return;
    flashLoading();
    setPage(p);
  };

  const attendance = useMemo(() => byDateDesc(attendanceRaw), [attendanceRaw]);
  const reports = useMemo(() => byDateDesc(reportsRaw), [reportsRaw]);
  const notes = useMemo(() => byDateDesc(notesRaw), [notesRaw]);

  const points = Math.max(
    0,
    attendance.reduce((s, a) => s + a.points, 0) + reports.reduce((s, r) => s + r.points, 0),
  );
  const rank = rankInfo(points).current.name;

  const notify = useCallback((msg: string) => {
    const id = Date.now();
    setToast({ id, msg });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2800);
  }, []);

  const saveNote = (n: NoteInput) => {
    if (n.id) {
      setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, title: n.title, content: n.content } : x)));
      notify('Catatan diperbarui');
    } else {
      setNotes((prev) => [{ id: uid(), title: n.title, content: n.content, date: todayISO() }, ...prev]);
      notify('Catatan tersimpan');
    }
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((x) => x.id !== id));
    notify('Catatan dihapus');
  };

  const saveProfile = (p: Personnel) => {
    setPersonnel(p);
    notify('Profil tersimpan');
  };

  const resetAll = () => {
    setPersonnel(seedPersonnel());
    setAttendance(seedAttendance());
    setReports(seedReports());
    setNotes(seedNotes());
    notify('Data dikembalikan ke contoh');
  };

  const renderPage = (p: Page): ReactNode => {
    switch (p) {
      case 'home':
        return <Home personnel={personnel} rank={rank} points={points} attendance={attendance} reports={reports} onNavigate={go} />;
      case 'absensi':
        return <Absensi personnel={personnel} rank={rank} onBack={() => go('home')} onSubmitted={notify} onTabSwitch={flashLoading} />;
      case 'laporan':
        return <Laporan onBack={() => go('home')} />;
      case 'log':
        return <Log attendance={attendance} reports={reports} />;
      case 'book':
        return <Book notes={notes} reports={reports} onSave={saveNote} onDelete={deleteNote} />;
      case 'bar':
        return <Placeholder />;
      case 'profile':
        return (
          <Profile
            key={personnel.name + personnel.serviceId + personnel.division}
            personnel={personnel}
            rank={rank}
            points={points}
            attendanceCount={attendance.length}
            reportCount={reports.length}
            onSave={saveProfile}
            onReset={resetAll}
          />
        );
    }
  };

  return (
    <div className="min-h-screen md:flex">
      <Sidebar page={page} onChange={go} />
      <div className="min-w-0 flex-1 overflow-x-clip pb-24 md:pb-0">
        <Header name={personnel.name} rank={rank} onProfile={() => go('profile')} />
        <main className="mx-auto max-w-6xl p-4 md:p-6">
          <PageTransition page={page} render={renderPage} />
        </main>
      </div>
      <Toast message={toast ? toast.msg : null} />
      <LoadingScreen show={loading} />
    </div>
  );
}
