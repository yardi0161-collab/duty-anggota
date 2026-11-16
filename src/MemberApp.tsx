import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './auth';
import type { AuthUser } from './auth';
import type { CutiInput, DutyInput, NoteInput, Page, Profile as ProfileData } from './types';
import { NO_ROLE, dutyHours } from './lib';
import { photoUrl, useMemberData } from './data';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PageTransition from './components/PageTransition';
import LoadingCard from './components/LoadingCard';
import type { Status } from './components/LoadingCard';
import Home from './pages/Home';
import Log from './pages/Log';
import Book from './pages/Book';
import Profile from './pages/Profile';
import Absensi from './pages/Absensi';
import Laporan from './pages/Laporan';

const LOAD_MS = 450;
const BOOT: Status = { kind: 'loading', text: 'Memuat data anggota...' };
const FAILED = 'Gagal memproses data!';

const PAGE_TEXT: Record<Page, string> = {
  home: 'Membuka Dashboard...',
  absensi: 'Membuka absensi...',
  laporan: 'Memuat laporan...',
  log: 'Memuat riwayat aktivitas...',
  book: 'Memuat buku catatan...',
  profile: 'Memuat data personel...',
};

export default function MemberApp({ user }: { user: AuthUser }) {
  const { data, error, loading, refresh, submitDuty, submitCuti, saveNote, deleteNote, saveProfile } = useMemberData(user);
  const { signOut } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [status, setStatus] = useState<Status | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(0);

  // Satu kartu saja. Status baru menggantikan yang lama, dan perpindahan halaman tidak menimpa proses yang masih berjalan.
  const settle = useCallback((s: Status | null, ms: number) => {
    if (timer.current) clearTimeout(timer.current);
    setStatus(s);
    timer.current = ms > 0 ? setTimeout(() => setStatus(null), ms) : null;
  }, []);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const flash = useCallback(
    (text: string) => {
      if (pending.current > 0) return;
      settle({ kind: 'loading', text }, LOAD_MS);
    },
    [settle],
  );

  // Status "berhasil" baru tampil setelah proses benar-benar selesai. Gagal: kartu error, lalu error asli diteruskan ke form.
  const track = useCallback(
    async (text: string, fn: () => Promise<void>, okText?: string) => {
      pending.current += 1;
      settle({ kind: 'loading', text }, 0);
      try {
        await fn();
        pending.current -= 1;
        if (okText) settle({ kind: 'success', text: okText }, 1200);
        else settle(null, 0);
      } catch (e) {
        pending.current -= 1;
        settle({ kind: 'error', text: FAILED }, 1800);
        throw e;
      }
    },
    [settle],
  );

  const go = (p: Page) => {
    if (p === page) return;
    flash(PAGE_TEXT[p]);
    setPage(p);
  };

  const logout = () => {
    flash('Keluar...');
    void signOut();
  };

  const openPhoto = (path: string) =>
    track('Membuka foto...', async () => {
      const w = window.open('', '_blank');
      try {
        const url = await photoUrl(path);
        if (w) w.location.href = url;
      } catch (e) {
        if (w) w.close();
        throw e;
      }
    });

  if (loading) return <LoadingCard status={BOOT} />;
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

  const { profile, attendance, notes, log, access, ranks } = data;
  const verified = access.verified && access.rankName !== null;
  const rank = verified && access.rankName ? access.rankName : NO_ROLE;
  const curOrder = access.rankOrder;
  const nextRank = verified && curOrder !== null ? (ranks.find((r) => r.rankOrder > curOrder)?.rankName ?? null) : null;
  const dutyRows = attendance.filter((a) => a.kind === 'duty');
  const hours = dutyRows.reduce((s, a) => s + dutyHours(a.startTime, a.endTime), 0);

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
            onDuty={(i: DutyInput) => track('Mengirim absensi...', () => submitDuty(i), 'Absensi terkirim')}
            onCuti={(i: CutiInput) => track('Mengirim pengajuan cuti...', () => submitCuti(i), 'Pengajuan cuti terkirim')}
            onTabSwitch={(t) => flash(t === 'cuti' ? 'Memuat data cuti...' : 'Memuat presensi duty...')}
          />
        );
      case 'laporan':
        return <Laporan />;
      case 'log':
        return <Log log={log} onPhoto={openPhoto} />;
      case 'book':
        return (
          <Book
            notes={notes}
            onSave={(n: NoteInput) => track('Menyimpan catatan...', () => saveNote(n), n.id ? 'Catatan diperbarui' : 'Catatan tersimpan')}
            onDelete={(id: string) => track('Menghapus catatan...', () => deleteNote(id), 'Catatan dihapus')}
          />
        );
      case 'profile':
        return (
          <Profile
            key={profile.name + profile.serviceId + profile.division}
            personnel={profile}
            rank={rank}
            verified={verified}
            verifyNote={data.verifyNote}
            attendanceCount={attendance.length}
            dutyCount={dutyRows.length}
            leaveCount={attendance.length - dutyRows.length}
            onSave={(p: ProfileData) => track('Menyimpan data personel...', () => saveProfile(p), 'Data personel tersimpan')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen md:flex">
      <Sidebar page={page} onChange={go} />
      <div className="min-w-0 flex-1 overflow-x-clip pb-24 md:pb-0">
        <Header name={profile.name} rank={rank} onProfile={() => go('profile')} onLogout={logout} />
        <main className="mx-auto max-w-6xl p-4 md:p-6">
          <PageTransition page={page} render={renderPage} />
        </main>
      </div>
      <LoadingCard status={status} />
    </div>
  );
}
