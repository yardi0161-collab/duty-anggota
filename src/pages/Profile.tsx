import { useState } from 'react';
import type { FormEvent } from 'react';
import { LogIn, LogOut, RotateCcw, Save } from 'lucide-react';
import type { Personnel } from '../types';
import { DIVISIONS } from '../lib';
import Avatar from '../components/Avatar';
import { useAuth } from '../auth';

interface Props {
  personnel: Personnel;
  rank: string;
  points: number;
  attendanceCount: number;
  reportCount: number;
  onSave: (p: Personnel) => void;
  onReset: () => void;
}

export default function Profile({ personnel, rank, points, attendanceCount, reportCount, onSave, onReset }: Props) {
  const { enabled, loading, user, signIn, signOut } = useAuth();
  const [form, setForm] = useState<Personnel>(personnel);
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.serviceId.trim()) {
      setError('Nama dan ID personel wajib diisi.');
      return;
    }
    onSave({ ...form, name: form.name.trim(), serviceId: form.serviceId.trim() });
    setError('');
  };

  const reset = () => {
    if (window.confirm('Kembalikan semua data ke data contoh? Data yang kamu simpan akan hilang.')) onReset();
  };

  const stats = [
    { label: 'Total poin', value: points },
    { label: 'Absensi', value: attendanceCount },
    { label: 'Laporan', value: reportCount },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="card flex flex-col items-center p-6 text-center">
        <Avatar size={110} />
        <h2 className="mt-2 text-2xl">{personnel.name}</h2>
        <p className="font-display text-lg text-muted">{rank}</p>
        <p className="text-sm font-semibold">Divisi {personnel.division} · {personnel.serviceId}</p>
        <div className="mt-4 grid w-full grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-panel2 p-2">
              <p className="font-display text-2xl">{s.value}</p>
              <p className="text-xs font-bold">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 w-full rounded-2xl border border-line bg-panel2 p-3 text-sm">
          {!enabled && <p className="text-muted">Login Discord belum aktif. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY (lihat README).</p>}
          {enabled && user && (
            <div className="flex items-center justify-between gap-2">
              <p className="min-w-0 truncate font-bold">Masuk sebagai {user.name}</p>
              <button onClick={signOut} className="btn px-3 py-1.5">
                <LogOut size={16} /> Keluar
              </button>
            </div>
          )}
          {enabled && !user && (
            <button onClick={signIn} disabled={loading} className="btn w-full bg-army text-cream">
              <LogIn size={18} /> LOGIN DENGAN DISCORD
            </button>
          )}
        </div>
      </section>
      <section className="card p-4">
        <h2 className="text-2xl">Informasi Akun</h2>
        <form onSubmit={submit} className="mt-2 space-y-2">
          <label className="block text-sm font-extrabold">
            Nama
            <input className="field mt-1 font-normal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block text-sm font-extrabold">
            Divisi
            <select className="field mt-1 font-normal" value={form.division} onChange={(e) => setForm({ ...form, division: e.target.value })}>
              {DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-extrabold">
            ID Personel
            <input className="field mt-1 font-normal" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} />
          </label>
          {error && <p className="text-sm font-bold text-rust">{error}</p>}
          <button type="submit" className="btn w-full bg-army text-cream">
            <Save size={18} /> SIMPAN PROFIL
          </button>
        </form>
        <button onClick={reset} className="btn mt-4 w-full bg-panel2">
          <RotateCcw size={18} /> RESET KE DATA CONTOH
        </button>
      </section>
    </div>
  );
}
