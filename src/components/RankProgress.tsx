import { Lock } from 'lucide-react';
import { NO_ROLE } from '../lib';

interface Props {
  rank: string;
  nextRank: string | null;
  verified: boolean;
}

export default function RankProgress({ rank, nextRank, verified }: Props) {
  return (
    <section className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted">Target Pangkat Selanjutnya</p>
          <p className="break-words font-display text-2xl leading-tight">{verified ? (nextRank ?? 'Pangkat tertinggi') : '-'}</p>
          <p className="break-words text-xs font-semibold text-muted">Pangkat saat ini: {verified ? rank : '-'}</p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 text-center">
          {['DUTY', 'JAM'].map((label) => (
            <div key={label} className="flex items-center gap-1.5 rounded-xl border border-line bg-panel2 px-3 py-2 font-display text-sm">
              <Lock size={14} className={verified ? 'text-leaf' : 'text-muted'} aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>
      </div>
      {!verified && <p className="mt-3 break-words text-sm font-semibold text-muted">{NO_ROLE}</p>}
      <div className="mt-4 flex justify-center rounded-2xl border border-line bg-panel2 py-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-leaf/40 bg-night px-5 py-1.5 font-display text-sm tracking-[0.2em] text-leaf">
          <Lock size={16} aria-hidden="true" /> DI LOCK
        </span>
      </div>
    </section>
  );
}
