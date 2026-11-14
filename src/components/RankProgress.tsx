import { useEffect, useState } from 'react';
import { Medal, Star } from 'lucide-react';
import { rankInfo } from '../lib';

export default function RankProgress({ points }: { points: number }) {
  const { current, next, percent } = rankInfo(points);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(percent), 60);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <section className="card p-4">
      <h2 className="flex items-center gap-2 text-xl">
        <Medal size={22} className="text-gold" /> Progres Kenaikan Pangkat
      </h2>
      <div className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold">
        <div>
          <p className="text-bark">Pangkat saat ini</p>
          <p className="font-display text-lg">{current.name}</p>
        </div>
        <div className="text-right">
          <p className="text-bark">Target pangkat</p>
          <p className="font-display text-lg">{next ? next.name : 'Pangkat tertinggi'}</p>
        </div>
      </div>
      <div
        className="relative mt-3 h-7 overflow-hidden rounded-full border-[3px] border-ink bg-sand"
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
      <div className="mt-2 flex justify-between text-sm font-bold">
        <span>Total poin: {points}</span>
        <span>{next ? `Target poin: ${next.points}` : 'Target tercapai'}</span>
        <span>{percent}%</span>
      </div>
    </section>
  );
}
