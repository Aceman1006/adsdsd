export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect x="6" y="10" width="44" height="46" rx="6" fill="#000" />
      <rect x="3" y="7" width="44" height="46" rx="6" fill="#f4ead3" stroke="#000" strokeWidth="3" />
      <path d="M11 19h28M11 27h22M11 35h26" stroke="#1a1408" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="44" r="15" fill="#000" />
      <circle cx="42" cy="42" r="15" fill="#e5484d" stroke="#000" strokeWidth="3" />
      <text x="42" y="49" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontSize="20" fill="#fff1e6">D</text>
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-2xl font-black italic tracking-tight">
        fee<span className="text-gold">deed</span>
      </span>
    </span>
  );
}
