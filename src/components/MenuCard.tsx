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
      className={`card flex items-center gap-3 p-4 text-left transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf ${
        primary ? 'border-leaf/30 bg-leafbg' : ''
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-night/60 text-leaf">
        <Icon size={22} />
      </span>
      <span className="min-w-0 flex-1 truncate font-display text-lg">{title}</span>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel2 text-fg">
        <ArrowRight size={16} />
      </span>
    </button>
  );
}
