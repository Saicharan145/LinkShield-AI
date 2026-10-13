import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconDimension = isSm ? 'w-8 h-8' : isLg ? 'w-12 h-12' : 'w-10 h-10';
  const titleSize = isSm ? 'text-base' : isLg ? 'text-2xl' : 'text-lg';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Precision Engineered Dual-tone SVG Shield */}
      <div className={`relative ${iconDimension} rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-slate-900 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 group`}>
        {/* Ambient subtle glow ring */}
        <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm group-hover:bg-cyan-400/20 transition-all pointer-events-none" />

        <svg
          viewBox="0 0 24 24"
          className="w-5/8 h-5/8 text-cyan-400 relative z-10 transition-transform group-hover:scale-105"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main Shield Boundary */}
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            className="stroke-cyan-400 fill-cyan-950/40"
          />
          {/* Internal Security Radar Crosshair / Core */}
          <path
            d="M12 8v4l3 3"
            className="stroke-blue-400"
            strokeWidth="2"
          />
          <circle
            cx="12"
            cy="12"
            r="2"
            className="fill-cyan-300 stroke-cyan-200"
          />
        </svg>

        {/* Small corner accent */}
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className={`font-bold tracking-tight text-white ${titleSize}`}>
            LinkShield
          </span>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono-code text-sm">
            AI
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono-code font-semibold tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-800/60 px-1.5 py-0.2 rounded">
            SaaS v2.4
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[11px] text-slate-400 tracking-wide font-sans hidden sm:block">
            Smart Phishing & Typosquat URL Detector
          </p>
        )}
      </div>
    </div>
  );
};
