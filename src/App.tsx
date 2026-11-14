import { useCallback, useMemo, useState } from 'react';
import type { Attendance, Note, NoteInput, Page, Personnel, Report, ReportInput } from './types';
import {
  REPORT_POINTS,
  rankInfo,
  seedAttendance,
  seedNotes,
  seedPersonnel,
  seedReports,
  todayISO,
  uid,
  useLocalStorage,
} from './lib';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Home from './pages/Home';
import Log from './pages/Log';
import Book from './pages/Book';
import Profile from './pages/Profile';
import Absensi from './pages/Absensi';
import Placeholder from './pages/Placeholder';

const byDateDesc = <T extends { date: string }>(list: T[]): T[] => [...list].sort((a, b) => b.date.localeCompare(a.date));

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [personnel, setPersonnel] = useLocalStorage<Personnel>('afs.personnel', seedPersonnel);
  const [attendanceRaw, setAttendance] = useLocalStorage<Attendance[]>('afs.attendance', seedAttendance);
  const [reportsRaw, setReports] = useLocalStorage<Report[]>('afs.reports', seedReports);
  const [notesRaw, setNotes] = useLocalStorage<Note[]>('afs.notes', seedNotes);
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);

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

  const addReport = (data: ReportInput) => {
    setReports((prev) => [{ id: uid(), ...data, points: REPORT_POINTS }, ...prev]);
    notify('Laporan terkirim');
  };

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

  return (
    <div className="min-h-screen md:flex">
      <Sidebar page={page} onChange={setPage} />
      <div className="min-w-0 flex-1 pb-24 md:pb-0">
        <Header name={personnel.name} rank={rank} />
        <main className="mx-auto max-w-6xl p-4 md:p-6">
          {page === 'home' && (
            <Home personnel={personnel} rank={rank} points={points} attendance={attendance} reports={reports} onOpenAbsensi={() => setPage('absensi')} onReport={addReport} />
          )}
          {page === 'absensi' && (
            <Absensi personnel={personnel} rank={rank} onBack={() => setPage('home')} onSubmitted={notify} />
          )}
          {(page === 'duty' || page === 'bar') && <Placeholder />}
          {page === 'log' && <Log attendance={attendance} reports={reports} />}
          {page === 'book' && <Book notes={notes} reports={reports} onSave={saveNote} onDelete={deleteNote} />}
          {page === 'profile' && (
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
          )}
        </main>
      </div>
      <Toast message={toast ? toast.msg : null} />
    </div>
  );
}
