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
        <linearGradient id="pBgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#222222" />
          <stop offset="100%" stopColor="#121212" />
        </linearGradient>
        <linearGradient id="pAmberGrad" x1="20" y1="15" x2="85" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFC01E" />
          <stop offset="50%" stopColor="#FFA116" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="pStemGrad" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>
        <linearGradient id="pPromptGrad" x1="45" y1="60" x2="80" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFA116" />
          <stop offset="100%" stopColor="#FF7A00" />
        </linearGradient>
      </defs>

      {/* Dark Rounded Squircle Badge with subtle outline */}
      <rect width="100" height="100" rx="22" fill="url(#pBgGrad)" />
      <rect x="1.5" y="1.5" width="97" height="97" rx="20.5" stroke="#333333" strokeWidth="2" />

      {/* Vertical Backbone of 'P' */}
      <rect x="22" y="18" width="14" height="64" rx="7" fill="url(#pStemGrad)" />

      {/* Sweeping Upper Ribbon Loop of 'P' */}
      <path
        d="M30 18H56C69.8071 18 81 29.1929 81 43C81 56.8071 69.8071 68 56 68H30V55H56C62.6274 55 68 49.6274 68 43C68 36.3726 62.6274 31 56 31H30V18Z"
        fill="url(#pAmberGrad)"
      />

      {/* Terminal Code Execution Prompt '>_' */}
      <path
        d="M48 62L62 72L48 82"
        stroke="url(#pPromptGrad)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="68"
        y1="82"
        x2="79"
        y2="82"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Java Steam Ember Dot */}
      <circle cx="80" cy="22" r="4.5" fill="#FFA116" />
    </svg>
  );
};

export default PranavJavaSymbol;
