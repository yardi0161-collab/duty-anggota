import { useState } from 'react';
import { useAuth } from '../auth';
import { initials } from '../lib';

// Foto dari akun OAuth2. Tanpa foto atau gagal dimuat: inisial nama.
export default function Avatar({ size = 48, name }: { size?: number; name?: string }) {
  const { user } = useAuth();
  const [failed, setFailed] = useState<string | null>(null);
  const photo = user ? user.avatarUrl : null;
  const label = name ?? (user ? user.name : '');

  if (photo && failed !== photo) {
    return (
      <img
        src={photo}
        alt="Foto profil"
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setFailed(photo)}
        className="shrink-0 rounded-full border border-line bg-panel2 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      role="img"
      aria-label={`Avatar ${label}`}
      className="flex shrink-0 items-center justify-center rounded-full border border-line bg-panel2 font-display text-leaf"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials(label)}
    </span>
  );
}
