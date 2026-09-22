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
      <rect x="1.5" y="1.5" width="29" height="29" fill="#fff8ea" stroke="#161310" strokeWidth="2.5" />
      <path d="M16 6.5 C11 12 9 16 16 26" stroke="#161310" strokeWidth="2.2" fill="none" />
      <path d="M16 6.5 C21 12 23 16 16 26" stroke="#e04d12" strokeWidth="2.2" fill="none" />
      <circle cx="16" cy="7.5" r="2.4" fill="#e04d12" stroke="#161310" strokeWidth="1.4" />
      <circle cx="10.2" cy="18" r="2.1" fill="#3d6d46" stroke="#161310" strokeWidth="1.4" />
      <circle cx="21.8" cy="18" r="2.1" fill="#355f86" stroke="#161310" strokeWidth="1.4" />
    </svg>
  );
}
