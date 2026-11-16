import { useEffect, useRef, useState } from 'react';
import { LogOut, Menu } from 'lucide-react';

export default function AccountMenu({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="btn h-11 w-11 px-0"
      >
        <Menu size={22} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 top-full z-40 mt-2 w-48 rounded-2xl border border-line bg-panel p-1 shadow-soft">
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
            className="flex min-h-[44px] w-full items-center gap-2 rounded-xl px-3 text-left font-display text-base transition-colors hover:bg-panel2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf"
          >
            <LogOut size={18} className="text-rust" aria-hidden="true" /> Keluar
          </button>
        </div>
      )}
    </div>
  );
}
