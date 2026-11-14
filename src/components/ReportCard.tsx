import { useState } from 'react';
import type { FormEvent } from 'react';
import { Send } from 'lucide-react';
import type { Report, ReportInput } from '../types';
import { DIVISIONS, formatDate, todayISO } from '../lib';

interface Props {
  reports: Report[];
  defaultDivision: string;
  onSubmit: (r: ReportInput) => void;
}

export default function ReportCard({ reports, defaultDivision, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [division, setDivision] = useState(defaultDivision);
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Isi judul dan deskripsi kegiatan terlebih dahulu.');
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim(), division, date });
    setTitle('');
    setDescription('');
    setError('');
  };

  return (
    <section className="card p-4">
      <h2 className="text-xl">Laporan Duty</h2>
      <form onSubmit={submit} className="mt-2 space-y-2">
        <input className="field" placeholder="Judul laporan" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Judul laporan" />
        <textarea className="field min-h-24" placeholder="Deskripsi kegiatan" value={description} onChange={(e) => setDescription(e.target.value)} aria-label="Deskripsi kegiatan" />
        <div className="grid grid-cols-2 gap-2">
          <select className="field" value={division} onChange={(e) => setDivision(e.target.value)} aria-label="Divisi">
            {DIVISIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Tanggal laporan" />
        </div>
        {error && <p className="text-sm font-bold text-rust">{error}</p>}
        <button type="submit" className="btn w-full bg-army text-cream">
          <Send size={18} /> KIRIM LAPORAN
        </button>
      </form>
      <h3 className="mt-4 text-lg">Laporan Terkirim</h3>
      <ul className="mt-1 divide-y-2 divide-line">
        {reports.slice(0, 3).map((r) => (
          <li key={r.id} className="py-1.5 text-sm">
            <p className="font-extrabold">{r.title}</p>
            <p className="text-muted">{formatDate(r.date)} · {r.division} · +{r.points} poin</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
