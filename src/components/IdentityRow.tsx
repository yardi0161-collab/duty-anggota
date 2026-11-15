import Avatar from './Avatar';

interface Props {
  name: string;
  division: string;
  rank: string;
}

export default function IdentityRow({ name, division, rank }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-panel2 p-3">
      <Avatar size={48} name={name} />
      <div className="min-w-0">
        <p className="break-words font-display text-lg leading-snug">{name}</p>
        <p className="break-words text-sm text-muted">
          {division || 'Divisi belum diatur'} · {rank}
        </p>
      </div>
    </div>
  );
}
