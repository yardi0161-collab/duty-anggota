import { CalendarDays, CheckCircle2, XCircle } from 'lucide-react';
import { toISO, todayISO } from '../lib';

const LABELS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];
const short = (d: Date) => d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

// Hijau = ada absensi pada tanggal itu. Merah = belum ada. Hanya dua warna, murni dari data.
export default function WeekAttendance({ dates }: { dates: string[] }) {
  const filled = new Set(dates);
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
  const today = todayISO();

  return (
    <section className="card p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-panel2 text-leaf">
          <CalendarDays size={20} />
        </span>
        <div>
          <h2 className="text-lg leading-tight">Presensi Minggu Ini</h2>
          <p className="text-xs font-bold text-muted">
            {short(days[0])} - {short(days[6])}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const iso = toISO(d);
          const done = filled.has(iso);
          return (
            <div
              key={iso}
              aria-label={`${LABELS[i]} ${d.getDate()}: ${done ? 'sudah absen' : 'belum absen'}`}
              className={`flex flex-col items-center gap-1 rounded-xl border border-line py-2 text-[11px] font-extrabold text-white ${
                done ? 'bg-olive' : 'bg-rust'
              } ${iso === today ? 'ring-2 ring-fg' : ''}`}
            >
              <span>{LABELS[i]}</span>
              <span className="font-display text-base leading-none">{d.getDate()}</span>
              {done ? <CheckCircle2 size={16} aria-hidden="true" /> : <XCircle size={16} aria-hidden="true" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
