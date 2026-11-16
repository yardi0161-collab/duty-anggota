import Avatar from './Avatar';
import AccountMenu from './AccountMenu';

interface Props {
  name: string;
  rank: string;
  onProfile: () => void;
  onLogout: () => void;
}

export default function Header({ onProfile, onLogout }: Props) {
  return (
    <header className="border-b border-line bg-night">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        <AccountMenu onLogout={onLogout} />
        <button
          onClick={onProfile}
          aria-label="Buka profil"
          className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-leaf"
        >
          <Avatar size={48} />
        </button>
        <div className="min-w-0">
          <h1 className="break-words text-xl leading-tight md:text-2xl">ARMY FACTION SYSTEM</h1>
          <p className="break-words text-xs font-semibold text-muted md:text-sm">Personnel Attendance &amp; Duty Management</p>
        </div>
      </div>
    </header>
  );
}
