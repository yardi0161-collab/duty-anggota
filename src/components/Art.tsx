export function Emblem({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4 56 12v18c0 15-10 26-24 30C18 56 8 45 8 30V12z" fill="#4b5320" stroke="#1f1f1a" strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 11 50 17v13c0 11-7 19-18 23C21 49 14 41 14 30V17z" fill="#e8d9a8" stroke="#1f1f1a" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="32,19 36,28 46,28.5 38.5,34.5 41,44 32,38.5 23,44 25.5,34.5 18,28.5 28,28" fill="#c9962b" stroke="#1f1f1a" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function Soldier({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#e8d9a8" stroke="#1f1f1a" strokeWidth="3" />
      <circle cx="32" cy="38" r="15" fill="#f2c9a0" stroke="#1f1f1a" strokeWidth="2.5" />
      <path d="M15 36c0-15 7-23 17-23s17 8 17 23z" fill="#4b5320" stroke="#1f1f1a" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="11" y="34" width="42" height="5" rx="2.5" fill="#3a4118" stroke="#1f1f1a" strokeWidth="2" />
      <polygon points="32,18 33.8,23 39,23.2 35,26.2 36.4,31 32,28.2 27.6,31 29,26.2 25,23.2 30.2,23" fill="#c9962b" />
      <circle cx="26.5" cy="44" r="1.8" fill="#1f1f1a" />
      <circle cx="37.5" cy="44" r="1.8" fill="#1f1f1a" />
      <path d="M27 50c3 3 7 3 10 0" fill="none" stroke="#1f1f1a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
