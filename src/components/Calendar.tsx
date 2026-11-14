import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Attendance, Report } from '../types';
import { STATUS_STYLE, formatDate, toISO, todayISO } from '../lib';

const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

interface Props {
  attendance: Attendance[];
  reports: Report[];
  selected: string;
  onSelect: (iso: string) => void;
}

export default function Calendar({ attendance, reports, selected, onSelect }: Props) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const today = todayISO();
  const shift = (n: number) => setCursor(new Date(year, month + n, 1));

  const dayAttendance = attendance.find((a) => a.date === selected);
  const dayReports = reports.filter((r) => r.date === selected);

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between">
        <button className="btn bg-sand px-2 py-1" onClick={() => shift(-1)} aria-label="Bulan sebelumnya">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl capitalize">{cursor.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h2>
        <button className="btn bg-sand px-2 py-1" onClick={() => shift(1)} aria-label="Bulan selanjutnya">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-extrabold text-bark">
        {DAY_LABELS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} />;
          const iso = toISO(new Date(year, month, day));
          const hasA = attendance.some((a) => a.date === iso);
          const hasR = reports.some((r) => r.date === iso);
          const isSel = iso === selected;
          return (
            <button
              key={iso}
              onClick={() => onSelect(iso)}
              aria-pressed={isSel}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-gold ${
                isSel ? 'border-ink bg-army text-cream' : iso === today ? 'border-gold bg-sand' : 'border-transparent hover:bg-sand'
              }`}
            >
              {day}
              <span className="flex h-2 gap-0.5">
                {hasA && <span className="h-2 w-2 rounded-full bg-olive ring-1 ring-ink" />}
                {hasR && <span className="h-2 w-2 rounded-full bg-gold ring-1 ring-ink" />}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex gap-4 text-xs font-bold">
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-olive ring-1 ring-ink" /> Absensi</span>
        <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-gold ring-1 ring-ink" /> Laporan</span>
      </div>
      <div className="mt-3 rounded-xl border-[3px] border-ink bg-cream p-3 text-sm">
        <p className="font-display text-base">{formatDate(selected)}</p>
        {!dayAttendance && dayReports.length === 0 && <p className="text-bark">Tidak ada catatan pada tanggal ini.</p>}
        {dayAttendance && (
          <p className="mt-1">
            Absensi: <span className={`rounded-lg px-2 py-0.5 font-display ${STATUS_STYLE[dayAttendance.status]}`}>{dayAttendance.status}</span> pukul {dayAttendance.time}
          </p>
        )}
        {dayReports.map((r) => (
          <p key={r.id} className="mt-1 font-semibold">Laporan: {r.title}</p>
        ))}
      </div>
    </section>
  );
}
