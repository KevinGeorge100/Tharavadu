"use client";

import React from "react";
import { DiscoveryPath } from "@/data/demo-paths";
import { X, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";

interface RelationshipPathModalProps {
  path: DiscoveryPath;
  onClose: () => void;
  onStepClick?: (personId: string) => void;
}

export function RelationshipPathModal({
  path,
  onClose,
  onStepClick,
}: RelationshipPathModalProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "var(--bg-surface-elevated)",
        border: "2px solid var(--accent-warm)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-selected)",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        animation: "fadeIn 200ms ease",
      }}
    >
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
            Kinship Path Discovery
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close kinship path"
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

      {/* Traversal Summary Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--accent-warm-soft)",
          border: "1px solid var(--accent-warm-border)",
          padding: "8px 12px",
          borderRadius: "var(--radius-md)",
          fontSize: "0.85rem",
          fontWeight: 600,
          color: "var(--accent-warm)",
        }}
      >
        <CheckCircle2 size={16} color="var(--accent-warm)" style={{ flexShrink: 0 }} />
        <span>{path.humanExplanation}</span>
      </div>

      {/* Step by Step Traversal Breadcrumbs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--text-muted)",
          }}
        >
          Generational Journey (Click step to focus)
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {path.steps.map((step, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 10px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--bg-canvas-subtle)",
                border: "1px solid var(--border-subtle)",
                fontSize: "0.82rem",
                color: "var(--text-primary)",
                cursor: onStepClick ? "pointer" : "default",
              }}
              onClick={() => onStepClick && onStepClick(step.toId)}
            >
              <span
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--accent-warm)",
                  color: "#ffffff",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </span>
              <span style={{ flex: 1 }}>{step.label}</span>
              <ChevronRight size={14} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
