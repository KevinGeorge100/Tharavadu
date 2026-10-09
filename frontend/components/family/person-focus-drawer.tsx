"use client";

import React from "react";
import { FamilyMember } from "@/data/demo-family";
import { X } from "lucide-react";

interface PersonFocusDrawerProps {
  member: FamilyMember;
  compact?: boolean;
  onClose: () => void;
  onSelectRelative: (id: string) => void;
  onStartDiscovery: (sourceId: string) => void;
  onExploreBranch: (sourceId: string) => void;
  onOpenMemories?: (personId: string) => void;
  onEditPerson?: (personId: string) => void;
}

export function PersonFocusDrawer({
  member,
  compact = false,
  onClose,
  onSelectRelative,
  onStartDiscovery,
  onExploreBranch,
  onOpenMemories,
  onEditPerson,
}: PersonFocusDrawerProps) {
  const datesText = member.birthYear && member.deathYear
    ? `${member.birthYear}–${member.deathYear}`
    : member.birthYear ? `b. ${member.birthYear}` : member.deathYear ? `d. ${member.deathYear}` : null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: compact ? "100%" : "280px",
        backgroundColor: "var(--cream-hot)",
        border: "var(--outline-medium) solid var(--ink)",
        boxShadow: "var(--shadow-rest)",
        padding: "14px 14px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div className="tape-strip" />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p className="kin-stamp" style={{ fontSize: "0.62rem", color: member.branchColor }}>
            {member.branchName}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.28rem",
              fontWeight: 700,
              lineHeight: 1.1,
              marginTop: 4,
            }}
          >
            {member.name}
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.84rem", color: "var(--text-muted)" }}>
            {member.relationLabel}{datesText ? ` · ${datesText}` : ""}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close details" className="kin-press-ghost" style={{ width: 44, height: 44 }}>
          <X size={16} />
        </button>
      </div>

      {member.quote && (
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.88rem",
            fontStyle: "italic",
            lineHeight: 1.35,
            background: "var(--bg-archival-note)",
            border: "var(--outline-thin) solid var(--ink)",
            padding: "8px 10px",
          }}
        >
          “{member.quote}”
        </p>
      )}

      <div style={{ display: "flex", gap: 14, fontSize: "0.78rem", fontWeight: 700 }}>
        <span>📖 {member.memoriesCount}</span>
        <span>📷 {member.photosCount}</span>
      </div>
      {onOpenMemories && <button className="kin-press-ghost" onClick={() => onOpenMemories(member.id)} style={{ minHeight: 44 }}>Memories ({member.memoriesCount}) · Add memory</button>}
      {onEditPerson && <button className="kin-press-ghost" onClick={() => onEditPerson(member.id)} style={{ minHeight: 44 }}>Edit person</button>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {member.directConnections.map((rel) => (
          <button
            key={rel.id}
            type="button"
            onClick={() => onSelectRelative(rel.id)}
            className="kin-press-ghost"
            style={{ padding: "8px 10px", minHeight: 44, fontSize: "0.7rem" }}
          >
            {rel.relation}: {rel.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {compact && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button type="button" className="kin-press-ghost" style={{ padding: "10px 12px", minHeight: 44, flex: 1 }} onClick={() => onExploreBranch(member.id)}>
            Explore
          </button>
          <button type="button" className="kin-press" style={{ padding: "10px 12px", minHeight: 44, flex: 1 }} onClick={() => onStartDiscovery(member.id)}>
            Connect
          </button>
        </div>
      )}
    </div>
  );
}
