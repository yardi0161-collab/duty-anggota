import { Emblem, Soldier } from './Art';

interface Props {
  name: string;
  rank: string;
}

export default function Header({ name, rank }: Props) {
  return (
    <header className="border-b-4 border-ink bg-army text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Emblem size={52} />
          <div className="min-w-0">
            <h1 className="truncate text-2xl leading-none md:text-3xl">ARMY FACTION SYSTEM</h1>
            <p className="truncate text-xs font-semibold text-sand md:text-sm">Personnel Attendance &amp; Duty Management</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="font-display leading-tight">{name}</p>
            <p className="text-xs font-semibold text-sand">{rank}</p>
          </div>
          <Soldier size={44} />
        </div>
      </div>
      <div className="h-1.5 bg-gold" />
    </header>
  );
}
