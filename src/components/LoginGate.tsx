import { useState } from 'react';
import { LogIn, MessageCircle } from 'lucide-react';
import { useAuth } from '../auth';

// Konfigurasi bantuan: isi VITE_DISCORD_DM dengan Discord User ID (angka) atau tautan https://discord.com/...
// Tautan profil Discord membuka profil Anda, lalu pengguna menekan tombol Message.
function dmUrl(raw: string | undefined): string | null {
  const v = (raw ?? '').trim();
  if (/^\d{17,20}$/.test(v)) return `https://discord.com/users/${v}`;
  return /^https:\/\/(www\.)?discord\.com\//.test(v) ? v : null;
}
const HELP_URL = dmUrl(import.meta.env.VITE_DISCORD_DM as string | undefined);

export default function LoginGate() {
  const { enabled, signIn } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const login = async () => {
    setBusy(true);
    setError('');
    const err = await signIn();
    if (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section aria-labelledby="login-title" className="card w-full max-w-sm p-6 shadow-soft sm:p-8">
        <div className="flex flex-col items-center text-center">
          <img src="/logo-banner.png" alt="Logo TNI AD" width={96} height={96} className="h-24 w-24 object-contain" />
          <h1 id="login-title" className="mt-4 text-2xl leading-tight">
            ARMY FACTION SYSTEM
          </h1>
          <p className="mt-1 text-sm font-semibold text-muted">Personnel Attendance &amp; Duty Management</p>
        </div>

        <div className="mt-8">
          {enabled ? (
            <>
              <p className="text-center text-sm text-muted">Masuk dengan akun Discord untuk mengisi presensi dan pengajuan cuti.</p>
              <button onClick={login} disabled={busy} className="btn mt-4 h-12 w-full bg-army text-base text-cream">
                <LogIn size={18} aria-hidden="true" /> {busy ? 'MENGALIHKAN...' : 'MASUK DENGAN DISCORD'}
              </button>
              {error && <p className="mt-3 break-words text-center text-sm font-bold text-rust">Login gagal: {error}</p>}
            </>
          ) : (
            <p className="break-words text-center text-sm text-muted">
              Database belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY, lalu deploy ulang.
            </p>
          )}
        </div>

        {HELP_URL && (
          <a
            href={HELP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-xl text-sm font-semibold text-muted transition-colors hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf"
          >
            <MessageCircle size={16} aria-hidden="true" /> Kendala Login?
          </a>
        )}
      </section>
    </main>
  );
}
