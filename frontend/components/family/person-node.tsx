"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FamilyMember } from "@/data/demo-family";

export interface PersonNodeData extends Record<string, unknown> {
  member: FamilyMember;
  isSelected?: boolean;
  isFocusedBranch?: boolean;
  isDimmed?: boolean;
  isPathHighlighted?: boolean;
  onSelectPerson?: (id: string) => void;
}

function PortraitSvg({ type, color }: { type: FamilyMember["portraitType"]; color: string }) {
  // Artistic silhouette portraits (clean SVG botanical/vintage silhouettes with zero remote dependencies)
  switch (type) {
    case "silhouette-grandpa":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="30" fill="var(--bg-canvas-subtle)" stroke={color} strokeWidth="1.5" />
          <path d="M22 28 Q32 18 42 28 Q44 38 32 44 Q20 38 22 28 Z" fill={color} fillOpacity="0.85" />
          <circle cx="27" cy="29" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="37" cy="29" r="3.5" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="30.5" y1="29" x2="33.5" y2="29" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M24 38 Q32 46 40 38 Q32 42 24 38 Z" fill="#ffffff" />
          <path d="M20 54 Q32 46 44 54" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "silhouette-grandma":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="30" fill="var(--bg-canvas-subtle)" stroke={color} strokeWidth="1.5" />
          <circle cx="32" cy="18" r="8" fill={color} fillOpacity="0.85" />
          <path d="M23 30 Q32 20 41 30 Q44 42 32 45 Q20 42 23 30 Z" fill={color} fillOpacity="0.85" />
          <path d="M26 31 Q32 26 38 31" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="32" cy="46" r="2.5" fill="#ffffff" />
          <path d="M19 54 Q32 47 45 54" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "silhouette-father":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="30" fill="var(--bg-canvas-subtle)" stroke={color} strokeWidth="1.5" />
          <path d="M22 25 Q32 16 42 25 Q43 38 32 42 Q21 38 22 25 Z" fill={color} fillOpacity="0.85" />
          <rect x="25" y="27" width="6" height="4" rx="1" stroke="#ffffff" strokeWidth="1.2" />
          <rect x="33" y="27" width="6" height="4" rx="1" stroke="#ffffff" strokeWidth="1.2" />
          <line x1="31" y1="29" x2="33" y2="29" stroke="#ffffff" strokeWidth="1.2" />
          <path d="M18 54 Q32 46 46 54" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "silhouette-mother":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="30" fill="var(--bg-canvas-subtle)" stroke={color} strokeWidth="1.5" />
          <path d="M20 28 Q32 14 44 28 Q46 40 32 44 Q18 40 20 28 Z" fill={color} fillOpacity="0.85" />
          <path d="M24 24 Q32 16 40 24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 54 Q32 46 46 54" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "silhouette-nora":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="30" fill="var(--accent-warm-soft)" stroke="var(--accent-warm)" strokeWidth="2" />
          <circle cx="32" cy="28" r="11" fill="var(--accent-warm)" />
          <path d="M22 26 Q32 14 42 26 Q40 38 32 39 Q24 38 22 26 Z" fill="#ffffff" fillOpacity="0.25" />
          <path d="M18 53 Q32 44 46 53" stroke="var(--accent-warm)" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="44" cy="20" r="3" fill="#ffffff" stroke="var(--accent-warm)" strokeWidth="1.5" />
        </svg>
      );
    case "silhouette-brother":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="30" fill="var(--bg-canvas-subtle)" stroke={color} strokeWidth="1.5" />
          <circle cx="32" cy="28" r="11" fill={color} fillOpacity="0.85" />
          <path d="M18 54 Q32 46 46 54" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "silhouette-sister":
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="30" fill="var(--bg-canvas-subtle)" stroke={color} strokeWidth="1.5" />
          <circle cx="32" cy="28" r="11" fill={color} fillOpacity="0.85" />
          <path d="M24 22 Q32 15 40 22" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M18 54 Q32 46 46 54" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <circle cx="32" cy="32" r="30" fill="var(--bg-canvas-subtle)" stroke={color} strokeWidth="1.5" />
          <circle cx="32" cy="28" r="11" fill={color} fillOpacity="0.8" />
          <path d="M18 54 Q32 46 46 54" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
  }
}

export const PersonNode = memo(function PersonNode({ data }: { data: PersonNodeData }) {
  const { member, isSelected, isDimmed, isPathHighlighted, onSelectPerson } = data;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectPerson) {
      onSelectPerson(member.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (onSelectPerson) {
        onSelectPerson(member.id);
      }
    }
  };

  const datesText = member.deathYear
    ? `${member.birthYear}–${member.deathYear}`
    : `b. ${member.birthYear}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${member.name}, ${member.relationLabel}, ${datesText}`}
      aria-pressed={isSelected}
      style={{
        position: "relative",
        width: "215px",
        cursor: "pointer",
        outline: "none",
        opacity: isDimmed ? 0.38 : 1,
        filter: isDimmed ? "grayscale(40%)" : "none",
        transform: isSelected
          ? "scale(1.05) translateZ(0)"
          : `rotate(${member.rotationDeg}deg) translateZ(0)`,
        transition: "all var(--duration-normal) var(--ease-natural)",
        zIndex: isSelected ? 30 : 10,
      }}
    >
      {/* React Flow Connection Handles (Top, Bottom, Sides for Organic Art Nouveau Branches) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: isSelected ? "var(--accent-warm)" : member.branchColor,
          width: 8,
          height: 8,
          border: "2px solid #ffffff",
          top: -4,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: isSelected ? "var(--accent-warm)" : member.branchColor,
          width: 8,
          height: 8,
          border: "2px solid #ffffff",
          bottom: -4,
        }}
      />

      {/* Miniature Scrapbook Artifact Card */}
      <div
        className="photo-card-frame"
        style={{
          borderRadius: "var(--radius-md)",
          padding: "10px 12px 10px",
          backgroundColor: isSelected ? "var(--bg-surface-elevated)" : "var(--bg-surface-card)",
          border: isSelected
            ? "2px solid var(--accent-warm)"
            : isPathHighlighted
            ? "2px solid var(--accent-warm)"
            : "1px solid var(--border-default)",
          boxShadow: isSelected
            ? "var(--shadow-selected)"
            : isPathHighlighted
            ? "0 0 0 2px var(--accent-warm-ring), var(--shadow-lg)"
            : "var(--shadow-card)",
          transition: "all var(--duration-normal) var(--ease-natural)",
        }}
      >
        {/* Wabi-Sabi Tape Accent for Anchor or Selected Node */}
        {(member.isUserAnchor || isSelected) && <div className="tape-strip" />}

        {/* Top Portrait & Branch Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Portrait Vignette */}
          <div
            style={{
              flexShrink: 0,
              width: "50px",
              height: "50px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: member.branchSoft,
              border: `1px solid ${member.branchBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <PortraitSvg type={member.portraitType} color={member.branchColor} />
          </div>

          {/* Name & Relation */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.02rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}
            >
              {member.name}
            </span>

            <span
              style={{
                fontSize: "0.76rem",
                fontWeight: 600,
                color: member.isUserAnchor ? "var(--accent-warm)" : member.branchColor,
                marginTop: "1px",
              }}
            >
              {member.relationLabel}
            </span>

            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.72rem",
                fontStyle: "italic",
                color: "var(--text-muted)",
                marginTop: "1px",
              }}
            >
              {datesText}
            </span>
          </div>
        </div>

        {/* Subtle Bottom Memory Bar */}
        <div
          style={{
            marginTop: "8px",
            paddingTop: "6px",
            borderTop: "1px dashed var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: member.branchSoft,
              color: member.branchColor,
              padding: "1px 6px",
              borderRadius: "var(--radius-xs)",
              fontWeight: 500,
              fontSize: "0.68rem",
            }}
          >
            {member.branchName}
          </span>

          <span title={`${member.memoriesCount} memories preserved`}>
            📝 {member.memoriesCount} notes
          </span>
        </div>
      </div>
    </div>
  );
});
