import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  unit: string;
  Icon: LucideIcon;
}

export default function StatCard({ label, value, unit, Icon }: Props) {
  return (
    <div className="card p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leafbg text-leaf">
        <Icon size={20} />
      </span>
      <p className="mt-3 text-sm font-semibold text-muted">{label}</p>
      <p>
        <span className="font-display text-3xl">{value}</span> <span className="text-sm font-semibold text-muted">{unit}</span>
      </p>
    </div>
  );
}
