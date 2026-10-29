/** Cartoon hero: a floating deed with a wax seal, coins raining into a fee vault, and a STAMPED! pop. */
export function HeroArt() {
  const coins = [
    { x: 70, d: 0 }, { x: 130, d: 0.8 }, { x: 190, d: 1.6 }, { x: 100, d: 1.2 }, { x: 165, d: 2.0 },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <svg viewBox="0 0 520 520" className="h-full w-full">
        {/* glow */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f2b632" stopOpacity=".35" />
            <stop offset="100%" stopColor="#f2b632" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f9f1de" />
            <stop offset="1" stopColor="#e6d3a7" />
          </linearGradient>
        </defs>
        <circle cx="260" cy="250" r="240" fill="url(#glow)" />

        {/* clouds */}
        <g fill="#1d1d26" stroke="#000" strokeWidth="4">
          <path d="M40 120c0-20 30-28 42-12 10-22 52-18 52 8 22-2 26 26 6 30H52c-16 0-22-18-12-26z" />
          <path d="M380 70c0-16 24-22 34-10 8-18 42-14 42 6 18-2 22 22 4 24h-70c-13 0-18-14-10-20z" />
        </g>

        {/* vault / fee sack */}
        <g transform="translate(300 300)">
          <ellipse cx="90" cy="190" rx="110" ry="14" fill="#000" opacity=".5" />
          <path d="M20 70c-30 40-30 110 70 116 100-6 100-76 70-116z" fill="#000" transform="translate(6 6)" />
          <path d="M20 70c-30 40-30 110 70 116 100-6 100-76 70-116z" fill="#f2b632" stroke="#000" strokeWidth="5" />
          <path d="M40 70c-6-20 10-36 50-36s56 16 50 36z" fill="#d89b16" stroke="#000" strokeWidth="5" />
          <rect x="52" y="58" width="76" height="16" rx="8" fill="#e5484d" stroke="#000" strokeWidth="4" />
          <text x="90" y="140" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontSize="44" fill="#1a1408">FEES</text>
          {/* coins pile */}
          {[[-10,170],[18,178],[150,176],[176,168]].map(([x,y],i)=>(
            <g key={i}><ellipse cx={x} cy={y} rx="18" ry="8" fill="#000"/><ellipse cx={x} cy={y-4} rx="18" ry="8" fill="#ffd25a" stroke="#000" strokeWidth="3"/></g>
          ))}
        </g>

        {/* falling coins into vault */}
        <g transform="translate(300 120)">
          {coins.map((c, i) => (
            <g key={i} style={{ animationDelay: `${c.d}s` }} className="animate-drop">
              <circle cx={c.x} cy="40" r="15" fill="#000" />
              <circle cx={c.x - 2} cy="38" r="15" fill="#ffd25a" stroke="#000" strokeWidth="3" />
              <text x={c.x - 2} y="44" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="800" fontSize="15" fill="#7a5200">$</text>
            </g>
          ))}
        </g>

        {/* the deed */}
        <g className="animate-floaty" style={{ transformOrigin: "180px 260px" }}>
          <rect x="62" y="132" width="240" height="300" rx="10" fill="#000" />
          <rect x="52" y="122" width="240" height="300" rx="10" fill="url(#pap)" stroke="#000" strokeWidth="5" />
          {/* scroll ends */}
          <rect x="40" y="108" width="264" height="26" rx="13" fill="#e6d3a7" stroke="#000" strokeWidth="5" />
          <rect x="40" y="410" width="264" height="26" rx="13" fill="#e6d3a7" stroke="#000" strokeWidth="5" />
          <rect x="72" y="150" width="200" height="252" fill="none" stroke="#1a1408" strokeWidth="2" strokeDasharray="2 5" />
          <text x="172" y="190" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontWeight="900" fontSize="30" fill="#1a1408">Deed of Fees</text>
          <text x="172" y="212" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#6b5a33" letterSpacing="2">No. 000420 · FEEDEED</text>
          {[236, 254, 272, 290, 308].map((y, i) => (
            <rect key={y} x="90" y={y} width={i % 2 ? 120 : 164} height="6" rx="3" fill="#cdb98a" />
          ))}
          <path d="M92 360c18-16 30 8 46-6s26 6 40-4" fill="none" stroke="#1a1408" strokeWidth="3" strokeLinecap="round" />
          <line x1="90" y1="372" x2="190" y2="372" stroke="#1a1408" strokeWidth="2" />
          {/* wax seal */}
          <g transform="translate(240 362) rotate(-14)">
            <circle r="34" fill="#000" transform="translate(4 4)" />
            <path d="M0-36l8 6 10-2 4 9 9 4-2 10 6 8-6 8 2 10-9 4-4 9-10-2-8 6-8-6-10 2-4-9-9-4 2-10-6-8 6-8-2-10 9-4 4-9 10 2z" fill="#e5484d" stroke="#000" strokeWidth="4" />
            <circle r="20" fill="none" stroke="#7d1418" strokeWidth="3" />
            <text y="9" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontSize="26" fill="#fff1e6">D</text>
          </g>
        </g>

        {/* rocket */}
        <g transform="translate(410 190) rotate(30)">
          <path d="M0 -40c18 14 22 40 14 62H-14c-8-22-4-48 14-62z" fill="#f4ead3" stroke="#000" strokeWidth="4" />
          <circle cx="0" cy="-8" r="7" fill="#3ee6a0" stroke="#000" strokeWidth="3" />
          <path d="M-14 14l-12 16 14-4zM14 14l12 16-14-4z" fill="#e5484d" stroke="#000" strokeWidth="3" />
          <path d="M-8 24c0 14 8 22 8 30 0-8 8-16 8-30z" fill="#f2b632" stroke="#000" strokeWidth="3" />
        </g>
      </svg>

      {/* STAMPED! pop */}
      <div className="absolute left-[2%] top-[58%] animate-stamp select-none">
        <div className="rounded-lg border-4 border-black bg-seal px-4 py-1.5 font-display text-2xl font-black italic text-white shadow-chunk sm:text-3xl">
          STAMPED!
        </div>
      </div>
    </div>
  );
}
