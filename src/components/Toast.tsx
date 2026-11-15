import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div role="status" className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-center md:justify-end">
      <div className="card flex animate-pop shadow-soft items-center gap-2 bg-army px-4 py-3 font-display text-cream">
        <CheckCircle2 className="text-leaf" size={22} />
        {message}
      </div>
    </div>
  );
}
