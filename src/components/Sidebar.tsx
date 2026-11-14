import { BookOpen, Home, ScrollText, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Page } from '../types';

const ITEMS: { id: Page; label: string; Icon: LucideIcon }[] = [
  { id: 'home', label: 'HOME', Icon: Home },
  { id: 'log', label: 'LOG', Icon: ScrollText },
  { id: 'book', label: 'BUKU', Icon: BookOpen },
  { id: 'profile', label: 'PROFILE', Icon: User },
];

interface Props {
  page: Page;
  onChange: (p: Page) => void;
}

export default function Sidebar({ page, onChange }: Props) {
  return (
    <nav
      aria-label="Menu utama"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t-4 border-ink bg-bark p-2 md:sticky md:top-0 md:h-screen md:w-48 md:shrink-0 md:flex-col md:gap-2 md:border-r-4 md:border-t-0 md:p-3 md:pt-6"
    >
      {ITEMS.map(({ id, label, Icon }) => {
        const active = page === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl border-[3px] px-2 py-2 font-display transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-gold md:flex-none md:flex-row md:gap-3 md:px-3 ${
              active ? 'border-ink bg-gold text-ink shadow-soft' : 'border-transparent text-cream hover:bg-army'
            }`}
          >
            <Icon size={22} />
            <span className="text-sm md:text-base">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
