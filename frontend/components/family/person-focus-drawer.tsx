"use client";

import React from "react";
import { FamilyMember } from "@/data/demo-family";
import { X, Sparkles, BookOpen, Camera, ArrowRight, Plus } from "lucide-react";

interface PersonFocusDrawerProps {
  member: FamilyMember;
  onClose: () => void;
  onSelectRelative: (id: string) => void;
  onStartDiscovery: (sourceId: string) => void;
}

export function PersonFocusDrawer({
  member,
  onClose,
  onSelectRelative,
  onStartDiscovery,
}: PersonFocusDrawerProps) {
  const datesText = member.deathYear
    ? `${member.birthYear}–${member.deathYear}`
    : `b. ${member.birthYear}`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "370px",
        backgroundColor: "var(--bg-surface-elevated)",
        border: "1.5px solid var(--border-default)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        overflow: "hidden",
      }}
    >
      {/* Decorative Wabi-Sabi Tape at Top */}
      <div className="tape-strip" />

      {/* Header: Name, Relationship & Close Button */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: member.branchColor,
              backgroundColor: member.branchSoft,
              padding: "2px 7px",
              borderRadius: "var(--radius-xs)",
              marginBottom: "4px",
            }}
          >
            {member.branchName}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.15,
            }}
          >
            {member.name}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginTop: "2px",
            }}
          >
            {member.relationLabel} · {datesText}
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close details"
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "var(--radius-full)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            backgroundColor: "var(--bg-surface-hover)",
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Archival Quote Card */}
      {member.quote && (
        <div
          style={{
            backgroundColor: "var(--bg-archival-note)",
            border: "1px dashed var(--border-warm)",
            borderRadius: "var(--radius-sm)",
            padding: "9px 12px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.86rem",
              fontStyle: "italic",
              color: "var(--text-secondary)",
              lineHeight: 1.35,
            }}
          >
            “{member.quote}”
          </p>
        </div>
      )}

      {/* Preserved Memories & Photos Stats Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "0.78rem",
          color: "var(--text-secondary)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <BookOpen size={14} color="var(--accent-warm)" />
          <strong>{member.memoriesCount}</strong> memories
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <Camera size={14} color="var(--branch-blue)" />
          <strong>{member.photosCount}</strong> archival photos
        </span>
      </div>

      {/* Archival Notes Snippets */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--text-muted)",
          }}
        >
          Archival Fragments
        </span>
        {member.archivalNotes.slice(0, 2).map((note, idx) => (
          <div
            key={idx}
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              lineHeight: 1.3,
              paddingLeft: "8px",
              borderLeft: `2px solid ${member.branchBorder}`,
            }}
          >
            {note}
          </div>
        ))}
      </div>

      {/* Direct Connections / Quick Navigation */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--text-muted)",
          }}
        >
          Direct Relatives (Click to travel)
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {member.directConnections.map((rel) => (
            <button
              key={rel.id}
              onClick={() => onSelectRelative(rel.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.78rem",
                padding: "4px 9px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--bg-canvas-subtle)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
                transition: "all var(--duration-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-warm)";
                e.currentTarget.style.backgroundColor = "var(--accent-warm-soft)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.backgroundColor = "var(--bg-canvas-subtle)";
              }}
            >
              <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{rel.relation}:</span>
              <strong>{rel.name}</strong>
              <ArrowRight size={11} color="var(--text-muted)" />
            </button>
          ))}
        </div>
      </div>

      {/* Primary Discovery & Action Bar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "4px",
          paddingTop: "8px",
          borderTop: "1px dashed var(--border-subtle)",
        }}
      >
        <button
          onClick={() => onStartDiscovery(member.id)}
          style={{
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            backgroundColor: "var(--accent-warm)",
            color: "var(--text-inverted)",
            padding: "7px 12px",
            borderRadius: "var(--radius-md)",
            fontSize: "0.82rem",
            fontWeight: 600,
            boxShadow: "var(--shadow-sm)",
            transition: "all var(--duration-fast)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-warm-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-warm)")}
        >
          <Sparkles size={14} />
          <span>Find connection</span>
        </button>

        <button
          onClick={() => alert(`[Demo Action] In KIN milestone 5, you can attach audio or scanned letters to ${member.name}.`)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            backgroundColor: "var(--bg-surface-hover)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-default)",
            padding: "7px 11px",
            borderRadius: "var(--radius-md)",
            fontSize: "0.82rem",
            fontWeight: 500,
          }}
        >
          <Plus size={14} />
          <span>Add memory</span>
        </button>
      </div>
    </div>
  );
}
