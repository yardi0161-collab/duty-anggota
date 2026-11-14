import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  Icon: LucideIcon;
  primary?: boolean;
  onClick: () => void;
}

export default function MenuCard({ title, Icon, primary = false, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`card flex flex-col gap-4 p-4 text-left transition hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-4 focus-visible:outline-gold ${
        primary ? 'bg-army text-cream' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl border-[3px] border-ink ${primary ? 'bg-gold text-ink' : 'bg-sand text-army'}`}>
          <Icon size={22} />
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-ink bg-sand text-ink">
          <ArrowRight size={18} />
        </span>
      </div>
      <span className="font-display text-xl">{title}</span>
    </button>
  );
}
