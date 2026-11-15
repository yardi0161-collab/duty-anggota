import { Award, BadgeCheck, Flag, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Profile } from '../types';
import Avatar from './Avatar';

interface Props {
  personnel: Profile;
  rank: string;
  verified: boolean;
}

export default function PersonnelCard({ personnel, rank, verified }: Props) {
  const chips: { text: string; Icon: LucideIcon; ok?: boolean }[] = [
    { text: rank, Icon: Award },
    { text: personnel.division || 'Divisi belum diatur', Icon: Flag },
    verified ? { text: 'AKSES TERVERIFIKASI', Icon: BadgeCheck, ok: true } : { text: 'BELUM TERVERIFIKASI', Icon: Lock },
  ];
  return (
    <section aria-label="Identitas personel" className="card relative overflow-hidden p-5">
      <img src="/logo-banner.png" alt="" aria-hidden="true" width={512} height={512} className="pointer-events-none absolute -right-6 top-1/2 h-[135%] -translate-y-1/2 object-contain opacity-15" />
      <div className="relative flex items-center gap-4">
        <Avatar size={64} name={personnel.name} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-muted">Selamat Datang,</p>
          <h2 className="break-words text-2xl leading-tight md:text-3xl">{personnel.name}</h2>
        </div>
      </div>
      <div className="relative mt-4 flex flex-wrap gap-2">
        {chips.map(({ text, Icon, ok }) => (
          <span key={text} className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-panel2 px-3 py-1.5 text-sm font-bold">
            <Icon size={14} className={ok ? 'text-leaf' : 'text-muted'} aria-hidden="true" />
            <span className="break-words">{text}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
