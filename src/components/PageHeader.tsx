import { ArrowLeft, Shield } from 'lucide-react';

interface Props {
  title: string;
  onBack: () => void;
}

export default function PageHeader({ title, onBack }: Props) {
  return (
    <div className="flex items-start justify-between gap-3">
      <button onClick={onBack} aria-label="Kembali" className="btn group bg-panel2 px-3 py-2">
        <ArrowLeft size={20} className="transition-transform duration-200 group-hover:-translate-x-1" />
      </button>
      <div className="text-right">
        <p className="flex items-center justify-end gap-1 text-xs font-extrabold text-muted">
          <Shield size={14} /> ARMY FACTION
        </p>
        <h2 className="text-3xl leading-tight">{title}</h2>
      </div>
    </div>
  );
}
