import { useState } from 'react';
import type { FormEvent } from 'react';
import { LogOut, Save } from 'lucide-react';
import type { Profile as ProfileData } from '../types';
import { DIVISIONS } from '../lib';
import Avatar from '../components/Avatar';
import { useAuth } from '../auth';

interface Props {
  personnel: ProfileData;
  rank: string;
  points: number;
  attendanceCount: number;
  reportCount: number;
  onSave: (p: ProfileData) => Promise<void>;
}

export default function Profile({ personnel, rank, points, attendanceCount, reportCount, onSave }: Props) {
  const { signOut } = useAuth();
  const [form, setForm] = useState<ProfileData>(personnel);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSave({ name: form.name.trim(), division: form.division, serviceId: form.serviceId.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan profil.');
    } finally {
      setBusy(false);
    }
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
        <h2 className="mt-2 break-words text-2xl">{personnel.name}</h2>
        <p className="font-display text-lg text-muted">{rank}</p>
        <p className="break-words text-sm font-semibold">
          {personnel.division ? `Divisi ${personnel.division}` : 'Divisi belum diatur'}
          {personnel.serviceId ? ` · ${personnel.serviceId}` : ''}
        </p>
        <div className="mt-4 grid w-full grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-line bg-panel2 p-2">
              <p className="font-display text-2xl">{s.value}</p>
              <p className="text-xs font-bold">{s.label}</p>
            </div>
          ))}
        </div>
        <button onClick={() => void signOut()} className="btn mt-4 w-full">
          <LogOut size={18} /> KELUAR
        </button>
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
              <option value="">Belum diatur</option>
              {DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-extrabold">
            ID Personel
            <input className="field mt-1 font-normal" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} />
          </label>
          {error && <p className="break-words text-sm font-bold text-rust">{error}</p>}
          <button type="submit" disabled={busy} className="btn w-full bg-army text-cream">
            <Save size={18} /> {busy ? 'MENYIMPAN...' : 'SIMPAN PROFIL'}
          </button>
        </form>
      </section>
    </div>
  );
}
