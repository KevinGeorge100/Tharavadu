"use client";

import React from "react";
import { ExtractionCandidate } from "@/data/demo-stories";
import { PersonPortrait } from "@/components/family/person-portrait";
import { BackendGraph, Proposal } from "@/lib/api/types";

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
        Tharavadu understood
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

interface LiveExtractionPreviewProps {
  proposal: Proposal;
  graph: BackendGraph;
  selfId: string;
  resolutions: Record<string, string>;
  busy: boolean;
  error: string | null;
  onAccept: () => void;
  onDismiss: () => void;
  onChangeIdentity: (ref: string) => void;
}

export function LiveExtractionPreview({
  proposal,
  graph,
  selfId,
  resolutions,
  busy,
  error,
  onAccept,
  onDismiss,
  onChangeIdentity,
}: LiveExtractionPreviewProps) {
  const existing = new Map(graph.people.map((person) => [person.id, person.name]));
  const selfName = existing.get(selfId) || "You";
  const names = new Map(proposal.extraction.entities.map((entity) => [entity.ref, entity.name]));
  const nameOf = (ref: string) => ref === "self" ? selfName : names.get(ref) || "Unknown person";
  const unresolved = Object.keys(proposal.candidates).filter((ref) => !resolutions[ref]);
  const relationshipText = (source: string, target: string, type: string) => {
    if (type === "PARENT_OF") return `${source} is a parent of ${target}`;
    if (type === "SIBLING_OF") return `${source} and ${target} are siblings`;
    return `${source} and ${target} are spouses`;
  };

  return (
    <div
      role="region"
      aria-label="Review family proposal"
      style={{ width: "100%", maxWidth: 560, margin: "0 auto", background: "var(--cream-hot)", border: "var(--outline-heavy) solid var(--ink)", boxShadow: "var(--shadow-raised)", padding: 16, transform: "rotate(-0.3deg)", maxHeight: "70vh", overflowY: "auto" }}
    >
      <div className="tape-strip" />
      <p className="kin-stamp" style={{ fontSize: "0.92rem" }}>Tharavadu understood</p>
      <p style={{ fontFamily: "var(--font-serif)", marginTop: 8, fontSize: "0.9rem" }}>
        {proposal.extraction.entities.length} {proposal.extraction.entities.length === 1 ? "person" : "people"} and {proposal.extraction.relationships.length} {proposal.extraction.relationships.length === 1 ? "connection" : "connections"} to review. Nothing has been added yet.
      </p>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 12, paddingBottom: 4 }}>
        {proposal.extraction.entities.map((entity) => {
          const matches = graph.people.filter((person) => person.name.toLocaleLowerCase() === entity.name.toLocaleLowerCase());
          const choice = resolutions[entity.ref];
          const status = proposal.candidates[entity.ref]
            ? choice === "new" ? "New person" : choice ? `Existing: ${existing.get(choice) || entity.name}` : "Choose identity"
            : entity.existing_id && existing.has(entity.existing_id)
              ? `Existing: ${existing.get(entity.existing_id)}`
              : matches.length === 1 ? "Existing person" : "New person";
          return (
            <div key={entity.ref} style={{ minWidth: 116, border: "var(--outline-medium) solid var(--ink)", boxShadow: "var(--shadow-rest)", background: "var(--cream)" }}>
              <PersonPortrait type={portraitFor(entity.name)} color="var(--branch-terracotta)" size={116} />
              <div style={{ padding: "6px 8px 8px" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "0.78rem" }}>{entity.name}</div>
                <div className="kin-stamp" style={{ fontSize: "0.55rem", marginTop: 2, color: "var(--accent-warm)" }}>{status}</div>
                {proposal.candidates[entity.ref] && (
                  <button type="button" disabled={busy} onClick={() => onChangeIdentity(entity.ref)} className="kin-press-ghost" style={{ fontSize: "0.62rem", marginTop: 5, minHeight: 34, padding: "4px 6px" }}>
                    {choice ? "Change choice" : "Choose person"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        <p className="kin-stamp" style={{ fontSize: "0.7rem" }}>Connections</p>
        {proposal.extraction.relationships.length ? (
          <ul style={{ paddingLeft: 18, marginTop: 4, fontFamily: "var(--font-serif)", fontSize: "0.84rem", lineHeight: 1.5 }}>
            {proposal.extraction.relationships.map((edge, index) => (
              <li key={`${edge.source}-${edge.target}-${edge.type}-${index}`}>
                {relationshipText(nameOf(edge.source), nameOf(edge.target), edge.type)}
              </li>
            ))}
          </ul>
        ) : <p style={{ fontSize: "0.82rem" }}>No relationships were found. Discard and try a clearer story.</p>}
      </div>

      {proposal.extraction.warnings.length > 0 && (
        <div style={{ marginTop: 10, padding: 10, background: "var(--cream)", border: "var(--outline-thin) solid var(--ink)" }}>
          <p className="kin-stamp" style={{ fontSize: "0.68rem" }}>A few things to check</p>
          <ul style={{ paddingLeft: 18, marginTop: 4, fontSize: "0.76rem", lineHeight: 1.45 }}>
            {proposal.extraction.warnings.map((warning, index) => <li key={index}>{warning}</li>)}
          </ul>
        </div>
      )}

      {unresolved.length > 0 && <p style={{ marginTop: 10, fontSize: "0.78rem", fontWeight: 700 }}>Choose which existing person each repeated name means before confirming.</p>}
      {error && <p role="alert" style={{ marginTop: 10, fontSize: "0.78rem", color: "var(--accent-warm)", fontWeight: 700 }}>{error}</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button type="button" disabled={busy} onClick={onDismiss} className="kin-press-ghost" style={{ padding: "10px 12px", minHeight: 44, flex: 1 }}>Discard story</button>
        <button type="button" disabled={busy || unresolved.length > 0 || proposal.extraction.relationships.length === 0} onClick={onAccept} className="kin-press" style={{ padding: "10px 12px", minHeight: 44, flex: 1 }}>
          {busy ? "Saving…" : "Looks right →"}
        </button>
      </div>
    </div>
  );
}
