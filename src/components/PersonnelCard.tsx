import { Award, BadgeCheck, Flag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Personnel } from '../types';
import { Emblem, Soldier } from './Art';

interface Props {
  personnel: Personnel;
  rank: string;
}

export default function PersonnelCard({ personnel, rank }: Props) {
  const chips: { text: string; Icon: LucideIcon }[] = [
    { text: rank, Icon: Award },
    { text: personnel.division, Icon: Flag },
    { text: `Badge #${personnel.serviceId}`, Icon: BadgeCheck },
  ];
  return (
    <section aria-label="Profil anggota" className="card relative overflow-hidden p-4">
      <div className="pointer-events-none absolute -right-4 -top-4 opacity-15">
        <Emblem size={130} />
      </div>
      <div className="relative flex items-center gap-3">
        <Soldier size={64} />
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-bark">Profil Anggota</p>
          <h2 className="truncate text-2xl leading-tight md:text-3xl">{personnel.name}</h2>
        </div>
      </div>
      <div className="relative mt-3 flex flex-wrap gap-2">
        {chips.map(({ text, Icon }) => (
          <span key={text} className="inline-flex items-center gap-1 rounded-full border-[3px] border-ink bg-sand px-3 py-1 text-sm font-extrabold">
            <Icon size={14} /> {text}
          </span>
        ))}
      </div>
    </section>
  );
}
