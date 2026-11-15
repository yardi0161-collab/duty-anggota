import { Award, BadgeCheck, Flag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Profile } from '../types';

interface Props {
  personnel: Profile;
  rank: string;
}

export default function PersonnelCard({ personnel, rank }: Props) {
  const chips: { text: string; Icon: LucideIcon }[] = [
    { text: rank, Icon: Award },
    { text: personnel.division || 'Divisi belum diatur', Icon: Flag },
    { text: personnel.serviceId ? `Badge #${personnel.serviceId}` : 'Badge belum diatur', Icon: BadgeCheck },
  ];
  return (
    <section aria-label="Profil anggota" className="card relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-leafbg via-panel to-night" />
      <img src="/logo-banner.png" alt="" aria-hidden="true" width={512} height={512} className="absolute -right-6 top-1/2 h-[135%] -translate-y-1/2 object-contain opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-night/85 via-night/40 to-transparent" />
      <div className="relative p-5">
        <p className="text-lg font-semibold text-fg/90">Selamat Datang,</p>
        <h2 className="break-words text-3xl leading-tight md:text-4xl">{personnel.name}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map(({ text, Icon }) => (
            <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-night/70 px-3 py-1.5 text-sm font-bold">
              <Icon size={14} className="text-leaf" /> {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
