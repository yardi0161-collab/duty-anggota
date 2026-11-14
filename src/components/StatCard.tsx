import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  unit: string;
  Icon: LucideIcon;
  tone: string;
}

export default function StatCard({ label, value, unit, Icon, tone }: Props) {
  return (
    <div className="card p-3">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-ink text-white ${tone}`}>
        <Icon size={20} />
      </span>
      <p className="mt-2 text-sm font-extrabold text-bark">{label}</p>
      <p>
        <span className="font-display text-3xl">{value}</span> <span className="text-sm font-bold text-bark">{unit}</span>
      </p>
    </div>
  );
}
