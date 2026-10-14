"use client";

import React from "react";
import { FamilyMember } from "@/data/demo-family";

interface PersonPortraitProps {
  type: FamilyMember["portraitType"];
  color: string;
  size?: number;
  isSelf?: boolean;
  variant?: number;
}

export function PersonPortrait({ type, color, size = 164, isSelf = false, variant = 0 }: PersonPortraitProps) {
  const common = { width: size, height: Math.round(size * 0.72), viewBox: "0 0 164 118" };
  const shade = Math.abs(variant) % 4;
  const skin = ["#f3d7b8", "#e8c4a0", "#c9916b", "#a96646"][shade];
  const hair = ["#2a241c", "#6b4a38", "#402b25", "#1e1b1a"][shade];

  switch (type) {
    case "silhouette-grandpa":
      return (
        <svg {...common} aria-hidden="true">
          <rect width="164" height="118" fill="#e8c9a2" />
          <rect x="0" y="78" width="164" height="40" fill={color} />
          <circle cx="82" cy="52" r="28" fill={skin} />
          <path d="M54 48c8-22 48-22 56 0" fill={shade % 2 ? "#aaa397" : "#c9c0b2"} />
          <rect x="52" y="48" width="60" height="8" fill="#2a241c" opacity="0.85" />
          <circle cx="70" cy="62" r="4" fill="#2a241c" />
          <circle cx="94" cy="62" r="4" fill="#2a241c" />
          <path d="M72 74c6 6 14 6 20 0" stroke="#2a241c" strokeWidth="2" fill="none" />
          <rect x="18" y="86" width="128" height="10" fill="#faf1de" opacity="0.3" />
        </svg>
      );
    case "silhouette-grandma":
      return (
        <svg {...common} aria-hidden="true">
          <rect width="164" height="118" fill="#f0cfd4" />
          <path d="M0 88h164v30H0z" fill={color} />
          <ellipse cx="82" cy="56" rx="26" ry="28" fill={skin} />
          <path d="M48 58c4-34 64-34 68 0-8 8-18 12-34 12s-26-4-34-12z" fill={shade % 2 ? "#b7ada0" : hair} />
          <circle cx="72" cy="60" r="3.5" fill="#2a241c" />
          <circle cx="92" cy="60" r="3.5" fill="#2a241c" />
          <path d="M74 72c5 5 11 5 16 0" stroke="#2a241c" strokeWidth="2" fill="none" />
          <circle cx="126" cy="28" r="8" fill="#fff8ea" stroke="#2a241c" strokeWidth="2" />
        </svg>
      );
    case "silhouette-father":
      return (
        <svg {...common} aria-hidden="true">
          <rect width="164" height="118" fill="#cfe0d2" />
          <path d="M22 72h120l-12 46H34z" fill={color} />
          <circle cx="82" cy="50" r="26" fill={skin} />
          <path d={shade % 2 ? "M56 48c7-19 42-24 52-4l-4 9H58z" : "M58 42c8-16 40-16 48 0v8H58z"} fill={hair} />
          {shade % 3 !== 1 && <>
            <rect x="64" y="52" width="14" height="8" rx="1" fill="none" stroke="#2a241c" strokeWidth="2" />
            <rect x="86" y="52" width="14" height="8" rx="1" fill="none" stroke="#2a241c" strokeWidth="2" />
            <path d="M78 56h8" stroke="#2a241c" strokeWidth="2" />
          </>}
          {shade % 3 === 1 && <>
            <circle cx="71" cy="56" r="3" fill="#2a241c" />
            <circle cx="93" cy="56" r="3" fill="#2a241c" />
            <path d="M73 69c5 4 13 4 18 0" stroke="#2a241c" strokeWidth="2" fill="none" />
          </>}
          <rect x="0" y="108" width="164" height="10" fill="#2a241c" opacity="0.12" />
        </svg>
      );
    case "silhouette-mother":
      return (
        <svg {...common} aria-hidden="true">
          <rect width="164" height="118" fill="#cddceb" />
          <path d="M30 70c18 8 86 8 104 0L122 118H42z" fill={color} />
          <ellipse cx="82" cy="50" rx="24" ry="26" fill={skin} />
          <path d={shade % 2 ? "M51 50c4-32 52-34 62-2-14 12-48 13-62 2z" : "M52 46c10-28 50-28 60 0-16 6-44 6-60 0z"} fill={hair} />
          <circle cx="72" cy="54" r="3.2" fill="#2a241c" />
          <circle cx="92" cy="54" r="3.2" fill="#2a241c" />
          <path d="M18 18h18v8H18z" fill="#e04d12" />
        </svg>
      );
    case "silhouette-nora":
      return (
        <svg {...common} aria-hidden="true">
          <rect width="164" height="118" fill="#ffd2b8" />
          <path d="M28 76h108l-10 42H38z" fill={color} />
          <circle cx="82" cy="50" r="27" fill={skin} />
          <path d={shade % 2 ? "M55 40c4-20 49-23 54 2-7 12-47 20-54-2z" : "M55 40c10-22 44-22 54 0-4 18-50 18-54 0z"} fill={hair} />
          <circle cx="72" cy="54" r="3.5" fill="#2a241c" />
          <circle cx="94" cy="54" r="3.5" fill="#2a241c" />
          <path d="M74 68c5 6 11 6 16 0" stroke="#2a241c" strokeWidth="2.2" fill="none" />
          {isSelf && <>
            <rect x="118" y="16" width="28" height="10" fill="#161310" />
            <text x="122" y="24" fontSize="8" fill="#fff8ea" fontFamily="Segoe UI, sans-serif" fontWeight="800">
              YOU
            </text>
          </>}
        </svg>
      );
    case "silhouette-brother":
      return (
        <svg {...common} aria-hidden="true">
          <rect width="164" height="118" fill="#ddd0ee" />
          <rect x="36" y="74" width="92" height="44" fill={color} />
          <circle cx="82" cy="50" r="25" fill={skin} />
          <path d="M60 34h44v16H60z" fill={hair} />
          <circle cx="72" cy="54" r="3" fill="#2a241c" />
          <circle cx="92" cy="54" r="3" fill="#2a241c" />
          <rect x="20" y="20" width="22" height="14" fill="#d39212" stroke="#161310" strokeWidth="2" />
        </svg>
      );
    case "silhouette-sister":
      return (
        <svg {...common} aria-hidden="true">
          <rect width="164" height="118" fill="#f8e3a8" />
          <path d="M26 78c20 12 92 12 112 0v40H26z" fill={color} />
          <ellipse cx="82" cy="50" rx="25" ry="26" fill={skin} />
          <path d="M50 50c8-30 56-30 64 0-12 10-52 10-64 0z" fill={hair} />
          <circle cx="72" cy="56" r="3" fill="#2a241c" />
          <circle cx="92" cy="56" r="3" fill="#2a241c" />
          <path d="M128 22c8 0 12 8 12 14s-12 6-12 0 4-14 0-14z" fill="#b4334c" />
        </svg>
      );
    case "silhouette-uncle":
      return (
        <svg {...common} aria-hidden="true">
          <rect width="164" height="118" fill="#f0cbb8" />
          <path d="M24 74h116v44H24z" fill={color} />
          <circle cx="82" cy="50" r="26" fill={skin} />
          <path d="M56 36c10-14 42-14 52 0v12H56z" fill={hair} />
          <path d="M60 58h44" stroke="#2a241c" strokeWidth="3" />
          <circle cx="70" cy="50" r="3" fill="#2a241c" />
          <circle cx="94" cy="50" r="3" fill="#2a241c" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden="true">
          <rect width="164" height="118" fill="#ead9b8" />
          <circle cx="82" cy="50" r="26" fill={color} />
          <path d="M40 118c10-28 94-28 104 0" fill={color} />
        </svg>
      );
  }
}
