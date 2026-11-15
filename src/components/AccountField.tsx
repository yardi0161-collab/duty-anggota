import { Lock } from 'lucide-react';

interface Props {
  label: string;
  value: string;
}

export default function AccountField({ label, value }: Props) {
  return (
    <div className="text-sm font-extrabold">
      <span className="flex items-center gap-1">
        {label} <Lock size={12} className="text-muted" aria-hidden="true" />
      </span>
      <p className="field mt-1 min-h-[44px] cursor-not-allowed whitespace-normal break-words bg-night font-normal text-muted">{value}</p>
    </div>
  );
}
