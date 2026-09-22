"use client";

import React from "react";
import { DiscoveryPath } from "@/data/demo-paths";
import { X } from "lucide-react";

interface RelationshipPathModalProps {
  path: DiscoveryPath;
  onClose: () => void;
  onStepClick?: (personId: string) => void;
  onSeeWhy?: () => void;
}

export function RelationshipPathModal({ path, onClose, onStepClick, onSeeWhy }: RelationshipPathModalProps) {
  return (
    <div
      style={{
        width: "min(100%, 280px)",
        background: "var(--cream-hot)",
        border: "var(--outline-heavy) solid var(--ink)",
        boxShadow: "var(--shadow-raised)",
        padding: "16px 16px 14px",
        transform: "rotate(-0.8deg)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p className="kin-stamp" style={{ fontSize: "1.05rem" }}>
          {path.resultTitle}
        </p>
        <button type="button" onClick={onClose} aria-label="Close kinship trail" className="kin-press-ghost" style={{ width: 44, height: 44 }}>
          <X size={16} />
        </button>
      </div>

      <p
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.05rem",
          lineHeight: 1.3,
          marginTop: 8,
        }}
      >
        {path.humanExplanation}
      </p>

      <button
        type="button"
        className="kin-press"
        style={{ marginTop: 14, width: "100%", minHeight: 44, padding: "10px 12px" }}
        onClick={onSeeWhy}
      >
        See why →
      </button>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        {path.steps.map((step, idx) => (
          <button
            key={`${step.fromId}-${step.toId}`}
            type="button"
            onClick={() => onStepClick?.(step.toId)}
            className="kin-press-ghost"
            style={{
              textAlign: "left",
              padding: "8px 10px",
              minHeight: 44,
              fontSize: "0.72rem",
              textTransform: "none",
              letterSpacing: 0,
              fontWeight: 700,
            }}
          >
            {idx + 1}. {step.label}
          </button>
        ))}
      </div>
    </div>
  );
}
