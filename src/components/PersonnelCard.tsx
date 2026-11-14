import { Award, BadgeCheck, Flag, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Personnel } from '../types';

interface Props {
  personnel: Personnel;
  rank: string;
}

export default function PersonnelCard({ personnel, rank }: Props) {
  const items: { label: string; value: string; Icon: LucideIcon; tone: string }[] = [
    { label: 'Nama', value: personnel.name, Icon: User, tone: 'bg-olive' },
    { label: 'Pangkat', value: rank, Icon: Award, tone: 'bg-gold' },
    { label: 'Divisi', value: personnel.division, Icon: Flag, tone: 'bg-bark' },
    { label: 'ID Personel', value: personnel.serviceId, Icon: BadgeCheck, tone: 'bg-army' },
  ];
  return (
    <section aria-label="Identitas personel" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(({ label, value, Icon, tone }) => (
        <div key={label} className="card flex items-center gap-3 p-3">
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-[3px] border-ink text-white ${tone}`}>
            <Icon size={24} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-bark">{label}</p>
            <p className="truncate font-display text-lg leading-tight">{value}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
