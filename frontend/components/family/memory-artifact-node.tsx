"use client";

import React, { memo } from "react";
import { MemoryPin } from "@/data/demo-family";

export interface MemoryNodeData extends Record<string, unknown> {
  memory: MemoryPin;
  isDimmed?: boolean;
}

export const MemoryArtifactNode = memo(function MemoryArtifactNode({ data }: { data: MemoryNodeData }) {
  const { memory, isDimmed } = data;
  const isPhoto = memory.type === "photo";
  const isPlace = memory.type === "artifact";

  return (
    <div
        className="kin-memory-bloom"
        style={
          {
            position: "relative",
            width: isPhoto ? 132 : 150,
            pointerEvents: "none",
            opacity: isDimmed ? 0.25 : 1,
            ["--bloom-rot"]: `${memory.rotationDeg}deg`,
            transform: `rotate(${memory.rotationDeg}deg)`,
          } as React.CSSProperties
        }
    >
      <div style={{ position: "absolute", top: -6, left: "46%", zIndex: 5 }}>
        <span className="memory-pin" />
      </div>

      <div
        style={{
          background: isPhoto ? "#efe4c8" : "var(--bg-archival-note)",
          border: "var(--outline-medium) solid var(--ink)",
          boxShadow: "var(--shadow-paper)",
          padding: isPhoto ? "8px 8px 10px" : "9px 10px",
        }}
      >
        {isPhoto && (
          <div
            style={{
              height: 54,
              marginBottom: 6,
              background: "repeating-linear-gradient(135deg, #dcc39a 0 8px, #c9ab78 8px 16px)",
              border: "var(--outline-thin) solid var(--ink)",
            }}
          />
        )}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 6, alignItems: "baseline" }}>
          <span
            className="kin-stamp"
            style={{
              fontSize: "0.58rem",
              color: isPlace ? "var(--branch-blue)" : "var(--accent-warm)",
            }}
          >
            {memory.title}
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.62rem",
              fontStyle: "italic",
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {memory.dateStr}
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.74rem",
            color: "var(--text-secondary)",
            lineHeight: 1.28,
            marginTop: 4,
          }}
        >
          {memory.snippet}
        </p>
      </div>
    </div>
  );
});
