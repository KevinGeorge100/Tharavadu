"use client";

import React from "react";
import { ExtractionCandidate } from "@/data/demo-stories";
import { PersonPortrait } from "@/components/family/person-portrait";

interface ExtractionPreviewProps {
  candidate: ExtractionCandidate;
  onAccept: () => void;
  onDismiss: () => void;
}

function portraitFor(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("joseph") || lower.includes("thomas") || lower.includes("mathew")) return "silhouette-uncle" as const;
  if (lower.includes("clara")) return "silhouette-mother" as const;
  if (lower.includes("julian")) return "silhouette-father" as const;
  if (lower.includes("george")) return "silhouette-uncle" as const;
  return "silhouette-brother" as const;
}

export function ExtractionPreview({ candidate, onAccept, onDismiss }: ExtractionPreviewProps) {
  const people = [{ name: candidate.primaryName, relation: candidate.primaryRole }, ...candidate.relatives];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "520px",
        margin: "0 auto",
        background: "var(--cream-hot)",
        border: "var(--outline-heavy) solid var(--ink)",
        boxShadow: "var(--shadow-raised)",
        padding: "16px",
        transform: "rotate(-0.3deg)",
      }}
    >
      <div className="tape-strip" />
      <p className="kin-stamp" style={{ fontSize: "0.92rem" }}>
        KIN understood
      </p>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 12, paddingBottom: 4 }}>
        {people.map((person) => (
          <div
            key={person.name}
            style={{
              minWidth: 116,
              border: "var(--outline-medium) solid var(--ink)",
              boxShadow: "var(--shadow-rest)",
              background: "var(--cream)",
            }}
          >
            <PersonPortrait type={portraitFor(person.name)} color="var(--branch-terracotta)" size={116} />
            <div style={{ padding: "6px 8px 8px" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "0.78rem" }}>{person.name}</div>
              <div className="kin-stamp" style={{ fontSize: "0.55rem", marginTop: 2, color: "var(--accent-warm)" }}>
                {person.relation}
              </div>
            </div>
          </div>
        ))}
      </div>

      <pre
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.82rem",
          fontWeight: 700,
          lineHeight: 1.45,
          marginTop: 12,
          whiteSpace: "pre-wrap",
        }}
      >
        {candidate.primaryName}
        {"\n"}
        {candidate.relatives.map((rel, idx) => {
          const prefix = idx === candidate.relatives.length - 1 ? "└── " : "├── ";
          return `${prefix}${rel.name} · ${rel.relation.toLowerCase()}`;
        }).join("\n")}
      </pre>

      <p className="kin-stamp" style={{ marginTop: 8, fontSize: "0.68rem", color: "var(--text-muted)" }}>
        {candidate.peopleCount} people · {candidate.connectionCount} connections
      </p>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="button" onClick={onDismiss} className="kin-press-ghost" style={{ padding: "10px 12px", minHeight: 44, flex: 1 }}>
          Fix something
        </button>
        <button type="button" onClick={onAccept} className="kin-press" style={{ padding: "10px 12px", minHeight: 44, flex: 1 }}>
          Looks right →
        </button>
      </div>
    </div>
  );
}
