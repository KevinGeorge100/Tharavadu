"use client";

import React, { memo } from "react";
import { MemoryPin } from "@/data/demo-family";

export interface MemoryNodeData extends Record<string, unknown> {
  memory: MemoryPin;
  isDimmed?: boolean;
}

export const MemoryArtifactNode = memo(function MemoryArtifactNode({ data }: { data: MemoryNodeData }) {
  const { memory, isDimmed } = data;

  return (
    <div
      style={{
        position: "relative",
        width: "150px",
        pointerEvents: "none", // Quiet artifact that doesn't block node drag
        opacity: isDimmed ? 0.3 : 0.95,
        transform: `rotate(${memory.rotationDeg}deg)`,
        transition: "opacity var(--duration-normal) var(--ease-natural)",
      }}
    >
      {/* Little Red Archival Pin Motif */}
      <div
        style={{
          position: "absolute",
          top: "-5px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
        }}
      >
        <span className="memory-pin" />
      </div>

      {/* Parchment Story Note */}
      <div
        style={{
          backgroundColor: "var(--bg-archival-note)",
          border: "1px solid #ebd9c3",
          borderRadius: "var(--radius-sm)",
          padding: "8px 9px",
          boxShadow: "0 2px 6px rgba(45, 35, 25, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.68rem",
              fontWeight: 600,
              color: "var(--accent-warm)",
            }}
          >
            {memory.title}
          </span>
          <span style={{ fontSize: "0.62rem", color: "var(--text-faint)" }}>{memory.dateStr}</span>
        </div>

        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.74rem",
            color: "var(--text-secondary)",
            lineHeight: 1.3,
            marginTop: "3px",
          }}
        >
          {memory.snippet}
        </p>
      </div>
    </div>
  );
});
