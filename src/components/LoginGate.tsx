import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../auth';

export default function LoginGate() {
  const { enabled, signIn } = useAuth();
  const [error, setError] = useState('');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <img src="/logo-banner.png" alt="Logo TNI AD" width={112} height={112} className="h-28 w-28 object-contain" />
      <h1 className="text-2xl">ARMY FACTION SYSTEM</h1>
      {enabled ? (
        <>
          <p className="max-w-sm text-muted">Masuk dengan akun Discord untuk mengisi absensi dan laporan.</p>
          <button onClick={async () => setError((await signIn()) ?? '')} className="btn bg-army text-cream">
            <LogIn size={18} /> LOGIN DENGAN DISCORD
          </button>
          {error && <p className="max-w-sm break-words text-sm font-bold text-rust">Login gagal: {error}</p>}
        </>
      ) : (
        <p className="max-w-sm break-words text-muted">Database belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY, lalu deploy ulang.</p>
      )}
    </main>
  );
}
