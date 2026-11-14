import { Lock } from 'lucide-react';
import { rankInfo } from '../lib';

export default function RankProgress({ points }: { points: number }) {
  const { current, next } = rankInfo(points);
  const remaining = next ? Math.max(0, next.points - points) : 0;

  return (
    <section className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted">Target Pangkat Selanjutnya</p>
          <p className="font-display text-2xl leading-tight">{next ? next.name : 'Pangkat tertinggi'}</p>
          <p className="text-xs font-semibold text-muted">Pangkat saat ini: {current.name}</p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 text-center">
          <div className="rounded-xl border border-line bg-panel2 px-3 py-1">
            <p className="text-[11px] font-semibold text-muted">Poin</p>
            <p className="font-display text-xl leading-tight">{points}</p>
          </div>
          <div className="rounded-xl border border-line bg-panel2 px-3 py-1">
            <p className="text-[11px] font-semibold text-muted">Kurang</p>
            <p className="font-display text-xl leading-tight">{remaining}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center rounded-2xl border border-line bg-panel2 py-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-leaf/40 bg-night px-5 py-1.5 font-display text-sm tracking-[0.25em] text-leaf shadow-[inset_0_0_12px_rgba(76,193,95,0.14)]">
          <Lock size={16} /> DI LOCK
        </span>
      </div>
    </section>
  );
}
