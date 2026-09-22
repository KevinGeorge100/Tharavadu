"use client";

import React from "react";
import { ExtractionCandidate } from "@/data/demo-stories";
import { Check, Edit3, X, Sparkles } from "lucide-react";

interface ExtractionPreviewProps {
  candidate: ExtractionCandidate;
  onAccept: () => void;
  onDismiss: () => void;
}

export function ExtractionPreview({
  candidate,
  onAccept,
  onDismiss,
}: ExtractionPreviewProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "480px",
        margin: "0 auto",
        backgroundColor: "var(--bg-surface-elevated)",
        border: "2px solid var(--accent-warm)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-selected)",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        animation: "fadeIn 200ms ease",
        zIndex: 35,
      }}
    >
      <div className="tape-strip" style={{ width: "42px", height: "14px", top: "-7px" }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={16} color="var(--accent-warm)" />
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "var(--text-primary)",
            }}
          >
            KIN understood:
          </span>
        </div>

        <button
          onClick={onDismiss}
          aria-label="Dismiss extraction"
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "var(--radius-full)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            backgroundColor: "var(--bg-surface-hover)",
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Extracted Tree Diagram */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.86rem",
          lineHeight: 1.4,
          backgroundColor: "var(--bg-canvas-subtle)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 14px",
          color: "var(--text-primary)",
        }}
      >
        <div style={{ fontWeight: 700, color: "var(--accent-warm)" }}>
          {candidate.primaryName} ({candidate.primaryRole})
        </div>
        {candidate.relatives.map((rel, idx) => {
          const isLast = idx === candidate.relatives.length - 1;
          const branchPrefix = isLast ? "└── " : "├── ";
          return (
            <div key={idx} style={{ color: "var(--text-secondary)" }}>
              {branchPrefix}
              <strong>{rel.name}</strong> — {rel.relation}
            </div>
          );
        })}
      </div>

      {/* Metadata Pill */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
        <span>
          <strong>{candidate.peopleCount} people</strong> · <strong>{candidate.connectionCount} relationships</strong>
        </span>
        <span style={{ fontStyle: "italic" }}>Deterministic Python reasoning on backend</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
        <button
          onClick={onAccept}
          style={{
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            backgroundColor: "var(--accent-warm)",
            color: "var(--text-inverted)",
            padding: "8px 14px",
            borderRadius: "var(--radius-md)",
            fontSize: "0.86rem",
            fontWeight: 600,
            boxShadow: "var(--shadow-sm)",
            transition: "all var(--duration-fast)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-warm-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-warm)")}
        >
          <Check size={16} />
          <span>Looks right (Add branch 🌿)</span>
        </button>

        <button
          onClick={() => alert("[Demo Action] In KIN milestone 5, you can correct names, change cousin levels, or split homonyms.")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            backgroundColor: "var(--bg-surface-hover)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-default)",
            padding: "8px 14px",
            borderRadius: "var(--radius-md)",
            fontSize: "0.84rem",
            fontWeight: 500,
          }}
        >
          <Edit3 size={14} />
          <span>Fix something</span>
        </button>
      </div>
    </div>
  );
}
