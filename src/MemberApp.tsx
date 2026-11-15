import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from './auth';
import type { DutyInput, IzinInput, NoteInput, Page, Profile as ProfileData, ReportInput } from './types';
import { ATTENDANCE_POINTS, categoryPoints, dutyHours, rankInfo } from './lib';
import { useMemberData } from './data';
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

const LOAD_MS = 450;

export default function MemberApp({ user }: { user: AuthUser }) {
  const { data, error, loading, refresh, submitDuty, submitIzin, submitReport, saveNote, deleteNote, saveProfile } = useMemberData(user);
  const [page, setPage] = useState<Page>('home');
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);
  const [navLoading, setNavLoading] = useState(false);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Satu overlay saja: perpindahan beruntun hanya memperpanjang waktu, tidak menumpuk.
  const flashLoading = useCallback(() => {
    setNavLoading(true);
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setNavLoading(false), LOAD_MS);
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

  const notify = useCallback((msg: string) => {
    const id = Date.now();
    setToast({ id, msg });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2800);
  }, []);

  if (loading) return <LoadingScreen show />;
  if (!data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="max-w-sm break-words font-bold text-rust">Data gagal dimuat: {error}</p>
        <p className="max-w-sm text-sm text-muted">Pastikan supabase/schema.sql sudah dijalankan di Supabase.</p>
        <button onClick={() => void refresh()} className="btn">
          COBA LAGI
        </button>
      </main>
    );
  }

  const { profile, attendance, reports, notes, log } = data;
  const points = Math.max(
    0,
    attendance.reduce((s, a) => s + ATTENDANCE_POINTS[a.kind], 0) + reports.reduce((s, r) => s + categoryPoints(r.category), 0),
  );
  const rank = rankInfo(points).current.name;
  const dutyRows = attendance.filter((a) => a.kind === 'duty');
  const hours = dutyRows.reduce((s, a) => s + dutyHours(a.startTime, a.endTime), 0);

  const act = async (fn: () => Promise<void>, ok: string) => {
    await fn();
    notify(ok);
  };

  const renderPage = (p: Page): ReactNode => {
    switch (p) {
      case 'home':
        return <Home personnel={profile} rank={rank} points={points} attendance={attendance} dutyCount={dutyRows.length} hours={hours} onNavigate={go} />;
      case 'absensi':
        return (
          <Absensi
            personnel={profile}
            rank={rank}
            onBack={() => go('home')}
            onDuty={(i: DutyInput) => act(() => submitDuty(i), 'Laporan duty tersimpan')}
            onIzin={(i: IzinInput) => act(() => submitIzin(i), 'Pengajuan izin tersimpan')}
            onTabSwitch={flashLoading}
          />
        );
      case 'laporan':
        return <Laporan reports={reports} onBack={() => go('home')} onSubmit={(i: ReportInput) => act(() => submitReport(i), 'Laporan tersimpan')} />;
      case 'log':
        return <Log log={log} />;
      case 'book':
        return (
          <Book
            notes={notes}
            onSave={(n: NoteInput) => act(() => saveNote(n), n.id ? 'Catatan diperbarui' : 'Catatan tersimpan')}
            onDelete={(id: string) => act(() => deleteNote(id), 'Catatan dihapus')}
          />
        );
      case 'profile':
        return (
          <Profile
            key={profile.name + profile.serviceId + profile.division}
            personnel={profile}
            rank={rank}
            points={points}
            attendanceCount={attendance.length}
            reportCount={reports.length}
            onSave={(p: ProfileData) => act(() => saveProfile(p), 'Profil tersimpan')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen md:flex">
      <Sidebar page={page} onChange={go} />
      <div className="min-w-0 flex-1 overflow-x-clip pb-24 md:pb-0">
        <Header name={profile.name} rank={rank} onProfile={() => go('profile')} />
        <main className="mx-auto max-w-6xl p-4 md:p-6">
          <PageTransition page={page} render={renderPage} />
        </main>
      </div>
      <Toast message={toast ? toast.msg : null} />
      <LoadingScreen show={navLoading} />
    </div>
  );
}
