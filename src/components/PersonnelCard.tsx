import { Award, BadgeCheck, Flag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Personnel } from '../types';

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
    <section aria-label="Profil anggota" className="card relative overflow-hidden">
      <img src="/banner.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-right" />
      <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/60 to-night/25" />
      <div className="relative p-5">
        <p className="text-lg font-semibold text-fg/90">Selamat Datang,</p>
        <h2 className="truncate text-3xl leading-tight md:text-4xl">{personnel.name}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map(({ text, Icon }) => (
            <span
              key={text}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-night/60 px-3 py-1.5 text-sm font-bold backdrop-blur-sm"
            >
              <Icon size={14} className="text-leaf" /> {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
