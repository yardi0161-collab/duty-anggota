import { useMemo, useState } from 'react';
import { Image as ImageIcon, Search } from 'lucide-react';
import type { LogRow } from '../types';
import { formatStamp, localDate } from '../lib';
import { photoUrl } from '../data';

export default function Log({ log }: { log: LogRow[] }) {
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [photoError, setPhotoError] = useState('');

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return log.filter((r) => {
      const d = localDate(r.createdAt);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return `${r.action} ${r.detail}`.toLowerCase().includes(needle);
    });
  }, [log, q, from, to]);

  const openPhoto = async (path: string) => {
    setPhotoError('');
    const w = window.open('', '_blank');
    try {
      const url = await photoUrl(path);
      if (w) w.location.href = url;
    } catch (e) {
      if (w) w.close();
      setPhotoError(e instanceof Error ? e.message : 'Foto gagal dibuka.');
    }
  };

  return (
    <section className="card p-4">
      <h2 className="text-2xl">Log Aktivitas</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <label className="block text-xs font-semibold text-muted">
          Cari
          <div className="relative mt-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="field pl-9 text-base font-normal" placeholder="Aktivitas atau detail" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </label>
        <label className="block text-xs font-semibold text-muted">
          Dari tanggal
          <input type="date" className="field mt-1 text-base font-normal" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="block text-xs font-semibold text-muted">
          Sampai tanggal
          <input type="date" className="field mt-1 text-base font-normal" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>
      {photoError && <p className="mt-2 break-words text-sm font-bold text-rust">{photoError}</p>}
      <ul className="mt-3 divide-y divide-line">
        {rows.map((r) => (
          <li key={r.id} className="py-3">
            <p className="text-xs font-semibold text-muted">{formatStamp(r.createdAt)}</p>
            <p className="mt-0.5 break-words font-semibold leading-snug">
              {r.memberName} {r.action}.
            </p>
            {r.detail && <p className="break-words text-sm text-muted">{r.detail}</p>}
            {r.photoPaths.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {r.photoPaths.map((p, i) => (
                  <button key={p} onClick={() => openPhoto(p)} className="btn px-3 py-1.5 text-sm">
                    <ImageIcon size={16} /> Foto {i + 1}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      {rows.length === 0 && (
        <p className="mt-3 text-muted">{log.length === 0 ? 'Belum ada aktivitas.' : 'Tidak ada aktivitas yang cocok dengan filter.'}</p>
      )}
    </section>
  );
}
