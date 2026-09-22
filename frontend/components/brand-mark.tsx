import React from "react";

interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 28, className = "" }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background soft ambient halo */}
      <circle cx="16" cy="16" r="14" fill="url(#brandGlow)" opacity="0.18" />

      {/* Constellation Connector Lines */}
      <line x1="8" y1="22" x2="16" y2="9" stroke="#e08846" strokeWidth="1.6" strokeDasharray="3 2" opacity="0.6" />
      <line x1="16" y1="9" x2="24" y2="20" stroke="#e08846" strokeWidth="1.6" strokeDasharray="3 2" opacity="0.6" />
      <line x1="8" y1="22" x2="24" y2="20" stroke="#7da887" strokeWidth="1.2" opacity="0.4" />

      {/* Connecting Person Star Nodes */}
      {/* Top Elder Node */}
      <circle cx="16" cy="9" r="4.2" fill="#e08846" />
      <circle cx="16" cy="9" r="2" fill="#f5f2eb" />

      {/* Left Node */}
      <circle cx="8" cy="22" r="3.6" fill="#7da887" />
      <circle cx="8" cy="22" r="1.6" fill="#f5f2eb" />

      {/* Right Node */}
      <circle cx="24" cy="20" r="3.8" fill="#c47d87" />
      <circle cx="24" cy="20" r="1.6" fill="#f5f2eb" />

      <defs>
        <radialGradient id="brandGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#e08846" />
          <stop offset="100%" stopColor="#e08846" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
