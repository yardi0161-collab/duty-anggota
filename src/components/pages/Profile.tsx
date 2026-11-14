import { useState } from 'react';
import type { FormEvent } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import type { Personnel } from '../types';
import { DIVISIONS } from '../lib';
import { Soldier } from '../components/Art';

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
        <Soldier size={110} />
        <h2 className="mt-2 text-2xl">{personnel.name}</h2>
        <p className="font-display text-lg text-bark">{rank}</p>
        <p className="text-sm font-semibold">Divisi {personnel.division} · {personnel.serviceId}</p>
        <div className="mt-4 grid w-full grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border-[3px] border-ink bg-sand p-2">
              <p className="font-display text-2xl">{s.value}</p>
              <p className="text-xs font-bold">{s.label}</p>
            </div>
          ))}
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
        <button onClick={reset} className="btn mt-4 w-full bg-sand">
          <RotateCcw size={18} /> RESET KE DATA CONTOH
        </button>
      </section>
    </div>
  );
}
