import { useEffect, useState } from 'react';

// Wadah loading: kotak kecil di tengah layar. Animasi logo (naik-turun, berkedip, bayangan) tidak diubah.
export interface Status {
  kind: 'loading' | 'success' | 'error';
  text: string;
}

const TEXT_COLOR: Record<Status['kind'], string> = {
  loading: 'text-fg',
  success: 'text-leaf',
  error: 'text-rust',
};

export default function LoadingCard({ status }: { status: Status | null }) {
  const [last, setLast] = useState<Status | null>(status);
  const [mounted, setMounted] = useState(status !== null);

  useEffect(() => {
    if (status) {
      setLast(status);
      setMounted(true);
      return undefined;
    }
    const t = setTimeout(() => setMounted(false), 250);
    return () => clearTimeout(t);
  }, [status]);

  if (!mounted || !last) return null;
  const animating = last.kind === 'loading';

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-night/70 p-4 transition-opacity duration-200 ${
        status ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div role="status" aria-live="polite" className="flex w-64 max-w-full flex-col items-center rounded-2xl border border-line bg-panel px-6 py-6 shadow-soft">
        <img src="/logo-banner.png" alt="" width={112} height={112} className={`h-20 w-20 object-contain md:h-24 md:w-24 ${animating ? 'loader-logo' : ''}`} />
        <div className={`mt-1 h-3 w-16 rounded-[50%] bg-black blur-md ${animating ? 'loader-shadow' : 'opacity-30'}`} />
        <p className={`mt-3 break-words text-center text-sm font-semibold ${TEXT_COLOR[last.kind]}`}>{last.text}</p>
      </div>
    </div>
  );
}
