import { ClipboardList, Search, ShieldAlert, Target, Ticket, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const CATEGORIES: { name: string; points: number; Icon: LucideIcon }[] = [
  { name: 'Penangkapan', points: 3, Icon: ShieldAlert },
  { name: 'Kasus Besar', points: 10, Icon: Target },
  { name: 'Patroli', points: 5, Icon: Search },
  { name: 'Backup', points: 3, Icon: Zap },
  { name: 'Penilangan', points: 2, Icon: Ticket },
  { name: 'Administrasi', points: 6, Icon: ClipboardList },
];

export default function Laporan({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader title="Laporan Duty" onBack={onBack} />
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(({ name, points, Icon }) => (
          <button
            key={name}
            className="card flex flex-col items-center gap-2 px-2 py-5 transition hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline focus-visible:outline-4 focus-visible:outline-gold"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-xl border-[3px] border-ink bg-sand text-army">
              <Icon size={26} />
            </span>
            <span className="font-display text-lg">{name}</span>
            <span className="rounded-full border-2 border-ink bg-gold px-3 py-0.5 text-xs font-extrabold">+{points} Poin</span>
          </button>
        ))}
      </div>
    </div>
  );
}
