import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from './auth';
import type { CutiInput, DutyInput, NoteInput, Page, Profile as ProfileData } from './types';
import { NO_ROLE, dutyHours } from './lib';
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
  const { data, error, loading, refresh, submitDuty, submitCuti, saveNote, deleteNote, saveProfile } = useMemberData(user);
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

  const { profile, attendance, notes, log, access, ranks, verifyNote } = data;
  const verified = access.verified && access.rankName !== null;
  const rank = verified && access.rankName ? access.rankName : NO_ROLE;
  const curOrder = access.rankOrder;
  const nextRank = verified && curOrder !== null ? (ranks.find((r) => r.rankOrder > curOrder)?.rankName ?? null) : null;
  const dutyRows = attendance.filter((a) => a.kind === 'duty');
  const hours = dutyRows.reduce((s, a) => s + dutyHours(a.startTime, a.endTime), 0);

  const act = async (fn: () => Promise<void>, ok: string) => {
    await fn();
    notify(ok);
  };

  const renderPage = (p: Page): ReactNode => {
    switch (p) {
      case 'home':
        return <Home personnel={profile} rank={rank} nextRank={nextRank} verified={verified} attendance={attendance} dutyCount={dutyRows.length} hours={hours} onNavigate={go} />;
      case 'absensi':
        return (
          <Absensi
            personnel={profile}
            rank={rank}
            verified={verified}
            onBack={() => go('home')}
            onDuty={(i: DutyInput) => act(() => submitDuty(i), 'Presensi duty tersimpan')}
            onCuti={(i: CutiInput) => act(() => submitCuti(i), 'Pengajuan cuti tersimpan')}
            onTabSwitch={flashLoading}
          />
        );
      case 'laporan':
        return <Laporan />;
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
            verified={verified}
            verifyNote={verifyNote}
            attendanceCount={attendance.length}
            dutyCount={dutyRows.length}
            leaveCount={attendance.length - dutyRows.length}
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
