import { useState } from 'react';
import { useAuth } from '../auth';

const LOGO = '/logo.png';

export default function Avatar({ size = 48 }: { size?: number }) {
  const { user } = useAuth();
  const [failed, setFailed] = useState<string | null>(null);
  const photo = user ? user.avatarUrl : null;
  const src = photo && failed !== photo ? photo : LOGO;
  const isLogo = src === LOGO;

  return (
    <img
      src={src}
      alt={isLogo ? 'Logo TNI AD' : 'Foto profil'}
      referrerPolicy="no-referrer"
      onError={() => {
        if (photo) setFailed(photo);
      }}
      className={`shrink-0 rounded-full border border-line bg-panel2 ${isLogo ? 'object-contain p-1.5' : 'object-cover'}`}
      style={{ width: size, height: size, borderRadius: '50%' }}
    />
  );
}
