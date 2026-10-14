"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FamilyMember } from "@/data/demo-family";
import { PersonPortrait } from "@/components/family/person-portrait";

export type ZoomBand = "far" | "medium" | "close";

export interface PersonNodeData extends Record<string, unknown> {
  member: FamilyMember;
  isSelected?: boolean;
  isFocusedBranch?: boolean;
  isDimmed?: boolean;
  isPathHighlighted?: boolean;
  isBlooming?: boolean;
  zoomBand?: ZoomBand;
  onSelectPerson?: (id: string) => void;
}

export const PersonNode = memo(function PersonNode({ data }: { data: PersonNodeData }) {
  const {
    member,
    isSelected,
    isDimmed,
    isPathHighlighted,
    isBlooming,
    zoomBand = "medium",
    onSelectPerson,
  } = data;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectPerson?.(member.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onSelectPerson?.(member.id);
    }
  };

  const datesText = member.birthYear && member.deathYear
    ? `${member.birthYear}–${member.deathYear}`
    : member.birthYear ? `b. ${member.birthYear}` : member.deathYear ? `d. ${member.deathYear}` : null;
  const compact = zoomBand === "far";
  const rich = zoomBand === "close" || isSelected;
  const portraitVariant = [...member.id].reduce((hash, letter) => hash + letter.charCodeAt(0), 0) % 4;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${member.name}, ${member.relationLabel}${datesText ? `, ${datesText}` : ""}`}
      aria-pressed={isSelected}
      className={`kin-person-card${isBlooming ? " kin-blooming-card" : ""}`}
      style={{
        position: "relative",
        width: compact ? 148 : 168,
        cursor: "pointer",
        opacity: isDimmed ? 0.28 : 1,
        filter: isDimmed ? "grayscale(35%)" : "none",
        transform: isSelected
          ? "translate(-3px, -6px) rotate(0deg)"
          : `rotate(${member.rotationDeg}deg)`,
        transition: "transform var(--duration-normal) var(--ease-natural), opacity var(--duration-normal) var(--ease-natural)",
        zIndex: isSelected ? 40 : isPathHighlighted ? 20 : 10,
      }}
    >
      <Handle id="parent-target" type="target" position={Position.Top} style={{ opacity: 0, width: 8, height: 8, top: -2 }} />
      <Handle id="parent-source" type="source" position={Position.Bottom} style={{ opacity: 0, width: 8, height: 8, bottom: -2 }} />
      <Handle id="side-left-target" type="target" position={Position.Left} style={{ opacity: 0, width: 8, height: 8 }} />
      <Handle id="side-right-target" type="target" position={Position.Right} style={{ opacity: 0, width: 8, height: 8 }} />
      <Handle id="side-left-source" type="source" position={Position.Left} style={{ opacity: 0, width: 8, height: 8 }} />
      <Handle id="side-right-source" type="source" position={Position.Right} style={{ opacity: 0, width: 8, height: 8 }} />

      <div
        style={{
          background: "var(--cream-hot)",
          border: isSelected || isPathHighlighted ? "var(--outline-heavy) solid var(--ink)" : "var(--outline-medium) solid var(--ink)",
          boxShadow: isSelected ? "var(--shadow-raised)" : "var(--shadow-rest)",
          overflow: "hidden",
        }}
      >
        {(member.isUserAnchor || isSelected) && <div className="tape-strip" />}

        <div
          style={{
            borderBottom: "var(--outline-thin) solid var(--ink)",
            background: member.branchSoft,
            lineHeight: 0,
          }}
        >
          <PersonPortrait type={member.portraitType} color={member.branchColor} size={compact ? 148 : 168} isSelf={member.isUserAnchor} variant={portraitVariant} />
        </div>

        <div style={{ padding: compact ? "7px 8px 8px" : "8px 10px 10px" }}>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: compact ? "0.92rem" : "1.02rem",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            {member.name}
          </div>

          {!compact && (
            <div
              style={{
                marginTop: 3,
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: member.isUserAnchor ? "var(--accent-warm)" : "var(--text-secondary)",
              }}
            >
              {member.relationLabel}{datesText ? ` · ${datesText}` : ""}
            </div>
          )}

          {rich && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
              }}
            >
              <span aria-label={`${member.memoriesCount} stories`}>📖 {member.memoriesCount}</span>
              <span aria-label={`${member.photosCount} photos`}>📷 {member.photosCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
