import React from 'react';

interface PranavJavaSymbolProps {
  className?: string;
}

export const PranavJavaSymbol: React.FC<PranavJavaSymbolProps> = ({
  className = 'h-6 w-6'
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Luxury Carbon Dark Gradient */}
        <linearGradient id="pkBgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e1e24" />
          <stop offset="50%" stopColor="#131317" />
          <stop offset="100%" stopColor="#0a0a0d" />
        </linearGradient>

        {/* Ambient Warm Golden Glow */}
        <radialGradient id="pkGlow" cx="50" cy="50" r="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA116" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFA116" stopOpacity="0" />
        </radialGradient>

        {/* Outer Rim Highlight */}
        <linearGradient id="pkBorderGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA116" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#FFC01E" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#383842" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#202026" stopOpacity="0.8" />
        </linearGradient>

        {/* Platinum White Gradient for Stems */}
        <linearGradient id="pkStemGrad" x1="0" y1="20" x2="0" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Vibrant Amber / Gold Flame Gradient for P Loop & K Arms */}
        <linearGradient id="pkAmberGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD026" />
          <stop offset="45%" stopColor="#FFA116" />
          <stop offset="100%" stopColor="#FF5E00" />
        </linearGradient>
      </defs>

      {/* Dark Rounded Squircle Badge with Inner Glow */}
      <rect width="100" height="100" rx="22" fill="url(#pkBgGrad)" />
      <rect width="100" height="100" rx="22" fill="url(#pkGlow)" />
      <rect x="1.5" y="1.5" width="97" height="97" rx="20.5" stroke="url(#pkBorderGrad)" strokeWidth="1.8" />

      {/* ===== LETTER 'P' ===== */}
      {/* P Vertical Stem (Platinum White) */}
      <line x1="21" y1="23" x2="21" y2="77" stroke="url(#pkStemGrad)" strokeWidth="8.5" strokeLinecap="round" />

      {/* P Upper Loop (Amber-Gold Ribbon) */}
      <path
        d="M21 23 H35 C45.5 23 45.5 49 35 49 H21"
        stroke="url(#pkAmberGrad)"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ===== LETTER 'K' ===== */}
      {/* K Vertical Stem (Platinum White) */}
      <line x1="56" y1="23" x2="56" y2="77" stroke="url(#pkStemGrad)" strokeWidth="8.5" strokeLinecap="round" />

      {/* K Upper Arm (Amber-Gold) */}
      <line x1="57" y1="47" x2="79" y2="23" stroke="url(#pkAmberGrad)" strokeWidth="8.5" strokeLinecap="round" />

      {/* K Lower Leg (Amber-Gold / Code Chevron) */}
      <line x1="57" y1="53" x2="79" y2="77" stroke="url(#pkAmberGrad)" strokeWidth="8.5" strokeLinecap="round" />

      {/* Java Glowing Ember Spark / Dot at top right */}
      <circle cx="81" cy="18" r="4.5" fill="#FFA116" />
      <circle cx="81" cy="18" r="2" fill="#FFFFFF" />

      {/* Code Terminal Prompt Accent Under 'P' */}
      <line x1="32" y1="68" x2="43" y2="68" stroke="#FFA116" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
};

export default PranavJavaSymbol;
