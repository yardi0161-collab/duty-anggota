import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { rankInfo } from '../lib';

export default function RankProgress({ points }: { points: number }) {
  const { current, next, percent } = rankInfo(points);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 60);
    return () => clearTimeout(t);
  }, [percent]);

  const remaining = next ? Math.max(0, next.points - points) : 0;

  return (
    <section className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-bark">Target Pangkat Selanjutnya</p>
          <p className="font-display text-2xl leading-tight">{next ? next.name : 'Pangkat tertinggi'}</p>
          <p className="text-xs font-bold text-bark">Pangkat saat ini: {current.name}</p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 text-center">
          <div className="rounded-xl border-[3px] border-ink bg-sand px-2 py-1">
            <p className="text-[11px] font-extrabold text-bark">Poin</p>
            <p className="font-display text-xl leading-tight">{points}</p>
          </div>
          <div className="rounded-xl border-[3px] border-ink bg-sand px-2 py-1">
            <p className="text-[11px] font-extrabold text-bark">Kurang</p>
            <p className="font-display text-xl leading-tight">{remaining}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm font-extrabold">
        <span>Progres kenaikan pangkat</span>
        <span>{percent}%</span>
      </div>
      <div
        className="relative mt-1 h-7 overflow-hidden rounded-full border-[3px] border-ink bg-sand"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-olive transition-[width] duration-1000 ease-out"
          style={{
            width: `${width}%`,
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 10px, transparent 10px 20px)',
          }}
        />
        <Star size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gold" fill="currentColor" />
      </div>
      <p className="mt-1 text-xs font-bold text-bark">
        {next ? `Total poin: ${points}/${next.points}` : 'Target tercapai'}
      </p>
    </section>
  );
}
