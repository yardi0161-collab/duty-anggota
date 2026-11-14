import { CalendarDays, CheckCircle2, HeartPulse, Mail, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Attendance, Status } from '../types';
import { STATUS_STYLE, toISO, todayISO } from '../lib';

const LABELS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];
const ICONS: Record<Status, LucideIcon> = { HADIR: CheckCircle2, IZIN: Mail, SAKIT: HeartPulse, ALPA: XCircle };

const short = (d: Date) => d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

export default function WeekAttendance({ attendance }: { attendance: Attendance[] }) {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  const days = Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
  const today = todayISO();

  return (
    <section className="card p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-ink bg-sand text-army">
          <CalendarDays size={20} />
        </span>
        <div>
          <h2 className="text-lg leading-tight">Presensi Minggu Ini</h2>
          <p className="text-xs font-bold text-bark">{short(days[0])} - {short(days[6])}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const iso = toISO(d);
          const rec = attendance.find((a) => a.date === iso);
          const isToday = iso === today;
          const past = iso < today;
          let tone = 'bg-cream text-bark';
          let Icon: LucideIcon | null = null;
          if (rec) {
            tone = STATUS_STYLE[rec.status];
            Icon = ICONS[rec.status];
          } else if (past) {
            tone = STATUS_STYLE.ALPA;
            Icon = XCircle;
          }
          return (
            <div
              key={iso}
              className={`flex flex-col items-center gap-1 rounded-xl border-[3px] border-ink py-2 text-[11px] font-extrabold ${tone} ${isToday ? 'ring-4 ring-gold' : ''}`}
            >
              <span>{LABELS[i]}</span>
              <span className="font-display text-base leading-none">{d.getDate()}</span>
              {Icon ? <Icon size={16} /> : <span className="h-1.5 w-1.5 rounded-full bg-bark" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
