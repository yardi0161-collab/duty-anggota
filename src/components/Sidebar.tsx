import { BookOpen, Home, ScrollText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Page } from '../types';

const ITEMS: { id: Page; label: string; Icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'log', label: 'Log', Icon: ScrollText },
  { id: 'book', label: 'Buku', Icon: BookOpen },
];

interface Props {
  page: Page;
  onChange: (p: Page) => void;
}

export default function Sidebar({ page, onChange }: Props) {
  return (
    <nav
      aria-label="Menu utama"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-night/95 pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:h-screen md:w-48 md:shrink-0 md:flex-col md:gap-1 md:border-r md:border-t-0 md:p-3 md:pt-6"
    >
      {ITEMS.map(({ id, label, Icon }) => {
        const active = page === id || (id === 'home' && (page === 'absensi' || page === 'laporan'));
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            aria-current={active ? 'page' : undefined}
            className={`relative flex flex-1 flex-col items-center gap-1 px-2 py-3 font-display transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf md:flex-none md:flex-row md:gap-3 md:rounded-xl md:px-3 ${
              active ? 'text-leaf md:bg-leafbg' : 'text-muted hover:text-fg'
            }`}
          >
            <Icon size={22} />
            <span className="text-sm md:text-base">{label}</span>
            <span
              aria-hidden="true"
              className={`absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded bg-leaf transition-opacity md:hidden ${active ? 'opacity-100' : 'opacity-0'}`}
            />
          </button>
        );
      })}
    </nav>
  );
}
