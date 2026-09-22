"use client";

import React from "react";
import { DemoPerson } from "@/data/demo-family";

interface PersonNodeProps {
  person: DemoPerson;
  isSelected: boolean;
  isRelated: boolean;
  isDimmed: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

export function PersonNode({
  person,
  isSelected,
  isRelated,
  isDimmed,
  onClick,
  style,
}: PersonNodeProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`${person.name}, ${person.relation} (${person.generation}). Click to explore scrapbook memories and connections.`}
      aria-pressed={isSelected}
      style={{
        position: "absolute",
        left: `${person.x}%`,
        top: `${person.y}%`,
        transform: `translate(-50%, -50%) scale(${isSelected ? 1.08 : 1})`,
        opacity: isDimmed ? 0.38 : 1,
        transition: "all var(--duration-normal) var(--ease-natural)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.35rem",
        zIndex: isSelected ? 15 : isRelated ? 8 : 4,
        cursor: "pointer",
        padding: "4px",
        borderRadius: "var(--radius-md)",
        ...style,
      }}
    >
      {/* Circular Tactile Avatar Disc */}
      <div
        style={{
          width: isSelected ? "54px" : "46px",
          height: isSelected ? "54px" : "46px",
          borderRadius: "var(--radius-full)",
          backgroundColor: person.branchSoft,
          border: `2.5px solid ${isSelected ? "var(--accent-warm)" : person.branchColor}`,
          boxShadow: isSelected
            ? "0 0 0 4px var(--accent-warm-ring), var(--shadow-md)"
            : isRelated
            ? "0 0 0 3px rgba(30, 28, 25, 0.08), var(--shadow-sm)"
            : "var(--shadow-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isSelected ? "1.2rem" : "1.05rem",
          fontWeight: 700,
          color: person.branchColor,
          transition: "all var(--duration-fast) var(--ease-natural)",
        }}
      >
        <span style={{ transform: "translateY(-0.5px)" }}>{person.initials}</span>
      </div>

      {/* Label Pill */}
      <div
        style={{
          backgroundColor: isSelected
            ? "var(--accent-warm-soft)"
            : "var(--bg-surface)",
          border: `1px solid ${isSelected ? "var(--accent-warm)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-full)",
          padding: "3px 10px",
          display: "flex",
          alignItems: "center",
          gap: "0.3rem",
          boxShadow: "var(--shadow-sm)",
          whiteSpace: "nowrap",
          transition: "all var(--duration-fast)",
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: isSelected ? "var(--accent-warm-hover)" : "var(--text-primary)",
          }}
        >
          {person.name}
        </span>
        <span
          style={{
            fontSize: "0.72rem",
            color: isSelected ? "var(--accent-warm)" : "var(--text-muted)",
            fontWeight: 500,
          }}
        >
          · {person.relation}
        </span>
      </div>
    </button>
  );
}
