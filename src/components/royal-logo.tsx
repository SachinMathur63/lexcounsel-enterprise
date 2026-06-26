// Vajra Legal Chambers — Royal Emblem (Crown + Scales of Justice)
export function RoyalLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vajra Legal Chambers"
    >
      <defs>
        <linearGradient id="vlc-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5D77A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C6A14" />
        </linearGradient>
      </defs>
      {/* Crown */}
      <path
        d="M14 18 L20 28 L26 14 L32 28 L38 14 L44 28 L50 18 L48 32 L16 32 Z"
        fill="url(#vlc-gold)"
        stroke="#3a2a06"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="18" r="1.8" fill="#3a2a06" />
      <circle cx="32" cy="14" r="2" fill="#3a2a06" />
      <circle cx="44" cy="18" r="1.8" fill="#3a2a06" />
      {/* Crown base */}
      <rect x="16" y="32" width="32" height="3" fill="url(#vlc-gold)" stroke="#3a2a06" strokeWidth="0.6" />
      {/* Scales beam */}
      <line x1="32" y1="36" x2="32" y2="56" stroke="url(#vlc-gold)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="14" y1="40" x2="50" y2="40" stroke="url(#vlc-gold)" strokeWidth="1.6" strokeLinecap="round" />
      {/* Strings */}
      <line x1="18" y1="40" x2="14" y2="48" stroke="url(#vlc-gold)" strokeWidth="0.8" />
      <line x1="18" y1="40" x2="22" y2="48" stroke="url(#vlc-gold)" strokeWidth="0.8" />
      <line x1="46" y1="40" x2="42" y2="48" stroke="url(#vlc-gold)" strokeWidth="0.8" />
      <line x1="46" y1="40" x2="50" y2="48" stroke="url(#vlc-gold)" strokeWidth="0.8" />
      {/* Pans */}
      <path d="M12 48 L24 48 L20 52 Z" fill="url(#vlc-gold)" stroke="#3a2a06" strokeWidth="0.6" />
      <path d="M40 48 L52 48 L48 52 Z" fill="url(#vlc-gold)" stroke="#3a2a06" strokeWidth="0.6" />
      {/* Base */}
      <rect x="26" y="55" width="12" height="3" rx="1" fill="url(#vlc-gold)" stroke="#3a2a06" strokeWidth="0.6" />
    </svg>
  );
}
