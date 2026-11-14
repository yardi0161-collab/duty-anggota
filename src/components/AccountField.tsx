import { Lock } from 'lucide-react';

interface Props {
  label: string;
  value: string;
}

export default function AccountField({ label, value }: Props) {
  return (
    <label className="block text-sm font-extrabold">
      <span className="flex items-center gap-1">
        {label} <Lock size={12} className="text-bark" />
      </span>
      <input readOnly value={value} className="field mt-1 cursor-not-allowed bg-sand font-normal" />
    </label>
  );
}
