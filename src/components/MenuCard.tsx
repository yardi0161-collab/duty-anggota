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
      className={`card flex flex-col gap-3 p-4 text-left transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf ${
        primary ? 'border-leaf/30 bg-leafbg' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-night/60 text-leaf">
          <Icon size={22} aria-hidden="true" />
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel2 text-fg">
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
      <span className="font-display text-lg leading-tight">{title}</span>
    </button>
  );
}
