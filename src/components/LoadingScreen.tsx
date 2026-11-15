import { useEffect, useState } from 'react';

// Animasi mengacu pada konsep loader Uiverse (BlackisPlay): naik-turun, berkedip, dan bayangan di bawah objek.
export default function LoadingScreen({ show }: { show: boolean }) {
  const [mounted, setMounted] = useState(show);

  useEffect(() => {
    if (show) {
      setMounted(true);
      return undefined;
    }
    const t = setTimeout(() => setMounted(false), 250);
    return () => clearTimeout(t);
  }, [show]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-center bg-night transition-opacity duration-200 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img src="/logo-banner.png" alt="Logo TNI AD" width={112} height={112} className="loader-logo h-24 w-24 object-contain md:h-28 md:w-28" />
      <div className="loader-shadow mt-1 h-3 w-20 rounded-[50%] bg-black blur-md" />
      <p className="mt-4 text-xs font-semibold tracking-wide text-muted">Memuat...</p>
    </div>
  );
}
