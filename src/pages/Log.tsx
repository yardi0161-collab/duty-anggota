import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Attendance, Report } from '../types';
import { STATUS_STYLE, formatDate } from '../lib';

interface Props {
  attendance: Attendance[];
  reports: Report[];
}

export default function Log({ attendance, reports }: Props) {
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const rows = useMemo(() => {
    const dates = Array.from(new Set([...attendance.map((a) => a.date), ...reports.map((r) => r.date)])).sort().reverse();
    return dates
      .map((date) => {
        const att = attendance.find((a) => a.date === date);
        const rs = reports.filter((r) => r.date === date);
        const points = (att ? att.points : 0) + rs.reduce((s, r) => s + r.points, 0);
        return { date, att, rs, points };
      })
      .filter((r) => {
        if (from && r.date < from) return false;
        if (to && r.date > to) return false;
        const text = `${r.att ? r.att.status : ''} ${r.rs.map((x) => x.title).join(' ')}`.toLowerCase();
        return text.includes(q.trim().toLowerCase());
      });
  }, [attendance, reports, q, from, to]);

  const total = rows.reduce((s, r) => s + r.points, 0);

  return (
    <section className="card p-4">
      <h2 className="text-2xl">Log Aktivitas</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-bark" />
          <input className="field pl-9" placeholder="Cari status atau laporan" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari" />
        </div>
        <input type="date" className="field" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="Dari tanggal" />
        <input type="date" className="field" value={to} onChange={(e) => setTo(e.target.value)} aria-label="Sampai tanggal" />
      </div>
      <p className="mt-2 text-sm font-bold">{rows.length} hari ditampilkan · Total poin {total}</p>
      <div className="mt-2 overflow-x-auto rounded-xl border-[3px] border-ink">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-army font-display text-cream">
            <tr>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Status</th>
              <th className="p-2">Jam</th>
              <th className="p-2">Laporan kegiatan</th>
              <th className="p-2 text-right">Poin</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-sand">
            {rows.map((r) => (
              <tr key={r.date}>
                <td className="p-2 font-semibold">{formatDate(r.date)}</td>
                <td className="p-2">
                  {r.att ? <span className={`rounded-lg px-2 py-0.5 font-display ${STATUS_STYLE[r.att.status]}`}>{r.att.status}</span> : '-'}
                </td>
                <td className="p-2">{r.att ? r.att.time : '-'}</td>
                <td className="p-2">{r.rs.length ? r.rs.map((x) => x.title).join(', ') : '-'}</td>
                <td className={`p-2 text-right font-extrabold ${r.points < 0 ? 'text-rust' : 'text-army'}`}>{r.points > 0 ? `+${r.points}` : r.points}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-bark">Tidak ada data yang cocok. Ubah kata kunci atau rentang tanggal.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
