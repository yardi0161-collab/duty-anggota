import { useEffect, useState } from 'react';
import { ChevronRight, ClipboardCheck, Clock } from 'lucide-react';
import { timeOf } from '../lib';

interface Props {
  onOpen: () => void;
}

export default function AttendanceCard({ onOpen }: Props) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateText = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <button
      onClick={onOpen}
      className="card w-full p-4 text-left transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-leaf"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-olive text-white">
            <ClipboardCheck size={24} />
          </span>
          <div>
            <h2 className="text-xl leading-tight">Absensi</h2>
            <p className="text-sm font-semibold text-muted">Ketuk untuk isi Laporan Duty atau Izin</p>
          </div>
        </div>
        <ChevronRight size={26} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-panel2 px-3 py-2">
        <span className="font-semibold">{dateText}</span>
        <span className="flex items-center gap-1 font-display text-xl">
          <Clock size={18} /> {timeOf(now)}
        </span>
      </div>
    </button>
  );
}
