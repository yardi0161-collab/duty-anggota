import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, HeartPulse, Mail, UserX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Attendance, Status } from '../types';
import { STATUS_STYLE, formatDate, timeOf, todayISO } from '../lib';

const BUTTONS: { status: Status; label: string; Icon: LucideIcon }[] = [
  { status: 'HADIR', label: 'HADIR', Icon: CheckCircle2 },
  { status: 'IZIN', label: 'IZIN', Icon: Mail },
  { status: 'SAKIT', label: 'SAKIT', Icon: HeartPulse },
  { status: 'ALPA', label: 'ALPA', Icon: UserX },
];

interface Props {
  attendance: Attendance[];
  onMark: (s: Status) => void;
}

export default function AttendanceCard({ attendance, onMark }: Props) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const today = attendance.find((a) => a.date === todayISO());
  const dateText = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="card p-4">
      <h2 className="text-xl">Absensi Hari Ini</h2>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border-[3px] border-ink bg-sand px-3 py-2">
        <span className="font-semibold">{dateText}</span>
        <span className="flex items-center gap-1 font-display text-xl">
          <Clock size={18} /> {timeOf(now)}
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold">
        Status hari ini:{' '}
        {today ? (
          <span className={`rounded-lg px-2 py-0.5 font-display ${STATUS_STYLE[today.status]}`}>{today.status} pukul {today.time}</span>
        ) : (
          <span className="text-bark">belum absen</span>
        )}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {BUTTONS.map(({ status, label, Icon }) => (
          <button key={status} onClick={() => onMark(status)} className={`btn ${STATUS_STYLE[status]}`}>
            <Icon size={18} /> {label}
          </button>
        ))}
      </div>
      <h3 className="mt-4 text-lg">Riwayat Kehadiran</h3>
      <ul className="mt-1 divide-y-2 divide-sand">
        {attendance.slice(0, 5).map((a) => (
          <li key={a.id} className="flex items-center justify-between py-1.5 text-sm">
            <span className="font-semibold">{formatDate(a.date)} · {a.time}</span>
            <span className={`rounded-lg px-2 py-0.5 font-display ${STATUS_STYLE[a.status]}`}>{a.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
