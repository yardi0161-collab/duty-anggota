import { useState } from 'react';
import type { FormEvent } from 'react';
import { ClipboardList, LifeBuoy, Search, Send, ShieldAlert, Target, Ticket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReportInput, ReportRow } from '../types';
import { REPORT_CATEGORIES, formatDate, todayISO } from '../lib';
import PageHeader from '../components/PageHeader';

// Ikon: perisai-tanda-seru = penangkapan, target = kasus besar, kaca pembesar = patroli,
// pelampung = backup (bantuan), tiket = penilangan, papan klip = administrasi.
const ICONS: Record<string, LucideIcon> = {
  Penangkapan: ShieldAlert,
  'Kasus Besar': Target,
  Patroli: Search,
  Backup: LifeBuoy,
  Penilangan: Ticket,
  Administrasi: ClipboardList,
};

interface Props {
  reports: ReportRow[];
  onBack: () => void;
  onSubmit: (i: ReportInput) => Promise<void>;
}

export default function Laporan({ reports, onBack, onSubmit }: Props) {
  const [category, setCategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const selected = REPORT_CATEGORIES.find((c) => c.name === category) ?? null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    if (!title.trim() || !description.trim() || !date) {
      setError('Isi judul, deskripsi, dan tanggal laporan.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSubmit({ category: selected.name, title: title.trim(), description: description.trim(), date });
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan laporan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Laporan Duty" onBack={onBack} />
      <p className="text-sm font-semibold text-muted">Pilih kategori laporan.</p>
      <div className="grid grid-cols-2 gap-3">
        {REPORT_CATEGORIES.map(({ name, points }) => {
          const Icon = ICONS[name];
          const active = name === category;
          return (
            <button
              key={name}
              onClick={() => setCategory(name)}
              aria-pressed={active}
              className={`card flex flex-col items-center gap-2 px-2 py-5 transition active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf ${
                active ? 'border-leaf bg-leafbg' : ''
              }`}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-panel2 text-leaf">
                <Icon size={26} aria-hidden="true" />
              </span>
              <span className="font-display text-lg">{name}</span>
              <span className="rounded-full border border-leaf/30 bg-leafbg px-3 py-0.5 text-xs font-bold text-leaf">+{points} Poin</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <form onSubmit={submit} className="card space-y-3 p-4">
          <h3 className="text-xl">Laporan {selected.name}</h3>
          <label className="block text-sm font-extrabold">
            Judul laporan
            <input className="field mt-1 font-normal" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block text-sm font-extrabold">
            Deskripsi
            <textarea className="field mt-1 min-h-32 font-normal leading-relaxed" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="block text-sm font-extrabold">
            Tanggal
            <input type="date" max={todayISO()} className="field mt-1 font-normal sm:max-w-xs" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          {error && <p className="break-words text-sm font-bold text-rust">{error}</p>}
          <button type="submit" disabled={busy} className="btn w-full bg-army text-cream">
            <Send size={18} /> {busy ? 'MENYIMPAN...' : 'KIRIM LAPORAN'}
          </button>
        </form>
      )}

      <section className="space-y-3">
        <h3 className="text-xl">Laporan Saya</h3>
        {reports.length === 0 && <p className="card p-4 text-muted">Belum ada laporan.</p>}
        {reports.map((r) => (
          <article key={r.id} className="card p-4">
            <p className="text-xs font-semibold text-muted">
              {r.category} · {formatDate(r.date)}
            </p>
            <h4 className="mt-1 break-words font-display text-lg leading-snug">{r.title}</h4>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{r.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
