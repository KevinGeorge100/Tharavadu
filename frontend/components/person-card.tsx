"use client";

import React from "react";
import { X, Sparkles, Compass } from "lucide-react";
import { DemoPerson } from "@/data/demo-family";

interface PersonCardProps {
  person: DemoPerson;
  onSelectPerson: (id: string) => void;
  onClose: () => void;
  onShowConnectionPath?: () => void;
  isShowingPath?: boolean;
}

export function PersonCard({
  person,
  onSelectPerson,
  onClose,
  onShowConnectionPath,
  isShowingPath = false,
}: PersonCardProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.4rem",
        boxShadow: "var(--shadow-floating)",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem",
        maxWidth: "420px",
        width: "100%",
        animation: "slideUp 220ms var(--ease-natural)",
      }}
      role="region"
      aria-label={`Scrapbook details for ${person.name}`}
    >
      {/* Header with avatar, name, and close button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius-full)",
              backgroundColor: person.branchSoft,
              border: `2px solid ${person.branchColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: person.branchColor,
            }}
          >
            {person.initials}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                {person.name}
              </h3>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  backgroundColor: person.branchSoft,
                  color: person.branchColor,
                  border: `1px solid ${person.branchBorder}`,
                  padding: "1px 7px",
                  borderRadius: "var(--radius-full)",
                }}
              >
                {person.relation}
              </span>
            </div>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              {person.generation}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close details"
          style={{
            padding: "6px",
            borderRadius: "var(--radius-full)",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all var(--duration-fast)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-canvas-subtle)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Memory / Story note */}
      <div
        style={{
          backgroundColor: "var(--bg-canvas)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "0.85rem 1rem",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--accent-warm)",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            marginBottom: "0.35rem",
          }}
        >
          <Sparkles size={11} />
          Family Scrapbook Note
        </span>
        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.55, fontStyle: "italic" }}>
          &ldquo;{person.story}&rdquo;
        </p>
      </div>

      {/* Direct Connected Relatives Chips */}
      <div>
        <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
          Direct connections (click to navigate):
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {person.connections.map((conn) => (
            <button
              key={conn.id}
              onClick={() => onSelectPerson(conn.id)}
              style={{
                fontSize: "0.78rem",
                padding: "3px 9px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--bg-surface-warm)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                transition: "all var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-warm)";
                e.currentTarget.style.backgroundColor = "var(--accent-warm-soft)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.backgroundColor = "var(--bg-surface-warm)";
              }}
            >
              <span style={{ color: "var(--text-muted)" }}>{conn.relation}:</span>
              <span style={{ fontWeight: 600 }}>{conn.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Path Discovery Action */}
      {onShowConnectionPath && person.id !== "nora" && (
        <button
          onClick={onShowConnectionPath}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.45rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            padding: "7px 12px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: isShowingPath ? "var(--accent-warm-soft)" : "var(--bg-canvas)",
            border: `1px solid ${isShowingPath ? "var(--accent-warm)" : "var(--border-subtle)"}`,
            color: isShowingPath ? "var(--accent-warm-hover)" : "var(--text-secondary)",
            transition: "all var(--duration-fast)",
            marginTop: "0.2rem",
          }}
          onMouseEnter={(e) => {
            if (!isShowingPath) {
              e.currentTarget.style.borderColor = "var(--border-hover)";
              e.currentTarget.style.color = "var(--text-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isShowingPath) {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }
          }}
        >
          <Compass size={13} color="var(--accent-warm)" />
          <span>
            {isShowingPath ? "Tracing kinship connection path" : `How is ${person.name} connected to Nora?`}
          </span>
        </button>
      )}
    </div>
  );
}
