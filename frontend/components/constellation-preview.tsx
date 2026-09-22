"use client";

import React, { useState } from "react";
import { Sparkles, BookOpen } from "lucide-react";

export interface DemoPerson {
  id: string;
  name: string;
  role: string;
  generation: string;
  branchColor: string;
  accentBg: string;
  story: string;
  connections: Array<{ id: string; relation: string }>;
  x: number; // percentage in SVG coordinate space (0-100)
  y: number; // percentage in SVG coordinate space (0-100)
}

const DEMO_PEOPLE: DemoPerson[] = [
  {
    id: "arthur",
    name: "Arthur",
    role: "Grandfather",
    generation: "1932",
    branchColor: "var(--accent-amber)",
    accentBg: "var(--accent-amber-soft)",
    story: "Kept a hand-drawn map of the constellations and taught his grandkids how to navigate by the North Star.",
    connections: [
      { id: "eleanor", relation: "Spouse" },
      { id: "julian", relation: "Father of" },
    ],
    x: 28,
    y: 18,
  },
  {
    id: "eleanor",
    name: "Eleanor",
    role: "Grandmother",
    generation: "1936",
    branchColor: "var(--branch-rose)",
    accentBg: "var(--branch-rose-soft)",
    story: "Collected wild chamomile every June and hand-wrote secret recipe books passed down to Clara.",
    connections: [
      { id: "arthur", relation: "Spouse" },
      { id: "julian", relation: "Mother of" },
    ],
    x: 72,
    y: 18,
  },
  {
    id: "julian",
    name: "Julian",
    role: "Father",
    generation: "1962",
    branchColor: "var(--branch-sage)",
    accentBg: "var(--branch-sage-soft)",
    story: "Woodworker and avid gardener. Rebuilt the family summer cabin with timber he shaped by hand.",
    connections: [
      { id: "arthur", relation: "Son of" },
      { id: "eleanor", relation: "Son of" },
      { id: "clara", relation: "Spouse" },
      { id: "nora", relation: "Father of" },
      { id: "leo", relation: "Father of" },
    ],
    x: 34,
    y: 52,
  },
  {
    id: "clara",
    name: "Clara",
    role: "Mother",
    generation: "1965",
    branchColor: "var(--branch-teal)",
    accentBg: "var(--branch-teal-soft)",
    story: "Botanist and librarian who documented folklore plants and read bedtime mythologies by candlelight.",
    connections: [
      { id: "julian", relation: "Spouse" },
      { id: "nora", relation: "Mother of" },
      { id: "leo", relation: "Mother of" },
    ],
    x: 66,
    y: 52,
  },
  {
    id: "nora",
    name: "Nora",
    role: "Self",
    generation: "1994",
    branchColor: "var(--accent-amber)",
    accentBg: "var(--accent-amber-soft)",
    story: "Exploring family memories and weaving them into KIN's constellation graph.",
    connections: [
      { id: "julian", relation: "Daughter of" },
      { id: "clara", relation: "Daughter of" },
      { id: "leo", relation: "Sister of" },
    ],
    x: 32,
    y: 84,
  },
  {
    id: "leo",
    name: "Leo",
    role: "Brother",
    generation: "1998",
    branchColor: "var(--branch-violet)",
    accentBg: "var(--branch-violet-soft)",
    story: "Sound designer and archivist digitizing old tape recordings of grandfather Arthur's fireside stories.",
    connections: [
      { id: "julian", relation: "Son of" },
      { id: "clara", relation: "Son of" },
      { id: "nora", relation: "Brother of" },
    ],
    x: 68,
    y: 84,
  },
];

// Edges between demo people
const DEMO_EDGES: Array<{ from: string; to: string; type: "parent" | "spouse" | "sibling" }> = [
  { from: "arthur", to: "eleanor", type: "spouse" },
  { from: "arthur", to: "julian", type: "parent" },
  { from: "eleanor", to: "julian", type: "parent" },
  { from: "julian", to: "clara", type: "spouse" },
  { from: "julian", to: "nora", type: "parent" },
  { from: "julian", to: "leo", type: "parent" },
  { from: "clara", to: "nora", type: "parent" },
  { from: "clara", to: "leo", type: "parent" },
  { from: "nora", to: "leo", type: "sibling" },
];

export function ConstellationPreview() {
  const [selectedId, setSelectedId] = useState<string>("nora");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeId = hoveredId || selectedId;
  const activePerson = DEMO_PEOPLE.find((p) => p.id === activeId) || DEMO_PEOPLE[0];
  const selectedPerson = DEMO_PEOPLE.find((p) => p.id === selectedId) || DEMO_PEOPLE[0];

  const personMap = new Map(DEMO_PEOPLE.map((p) => [p.id, p]));

  // Is an edge connected to the currently active person?
  const isEdgeHighlighted = (from: string, to: string) => {
    return from === activeId || to === activeId;
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Interactive Constellation Visual Canvas */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "360px",
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--shadow-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        role="region"
        aria-label="Fictional family constellation interactive demo map"
      >
        {/* Soft background ambient gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(224, 136, 70, 0.08) 0%, rgba(14, 15, 18, 0) 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Constellation SVG Connectors */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          {DEMO_EDGES.map((edge) => {
            const p1 = personMap.get(edge.from);
            const p2 = personMap.get(edge.to);
            if (!p1 || !p2) return null;

            const isHighlighted = isEdgeHighlighted(edge.from, edge.to);
            const strokeColor = isHighlighted ? "var(--accent-amber)" : "var(--border-default)";
            const strokeWidth = isHighlighted ? 2.4 : 1.2;
            const strokeDash = edge.type === "spouse" ? "4 3" : undefined;
            const opacity = isHighlighted ? 0.95 : 0.45;

            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={`${p1.x}%`}
                y1={`${p1.y}%`}
                x2={`${p2.x}%`}
                y2={`${p2.y}%`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDash}
                opacity={opacity}
                style={{
                  transition: "stroke var(--duration-fast), stroke-width var(--duration-fast), opacity var(--duration-fast)",
                }}
              />
            );
          })}
        </svg>

        {/* Person Nodes Positioned on Canvas */}
        {DEMO_PEOPLE.map((person) => {
          const isSelected = person.id === selectedId;
          const isHovered = person.id === hoveredId;
          const isConnectedToActive =
            activePerson.connections.some((c) => c.id === person.id) || person.id === activeId;

          return (
            <button
              key={person.id}
              onClick={() => setSelectedId(person.id)}
              onMouseEnter={() => setHoveredId(person.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setSelectedId(person.id)}
              aria-label={`${person.name}, ${person.role}. Click to explore story and relationships.`}
              aria-pressed={isSelected}
              style={{
                position: "absolute",
                left: `${person.x}%`,
                top: `${person.y}%`,
                transform: `translate(-50%, -50%) scale(${isSelected || isHovered ? 1.08 : 1})`,
                transition: "all var(--duration-normal) var(--ease-spring)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.35rem",
                zIndex: isSelected ? 10 : 2,
                cursor: "pointer",
                padding: "4px",
                borderRadius: "var(--radius-md)",
              }}
            >
              {/* Circular Avatar Orb */}
              <div
                style={{
                  width: isSelected ? "48px" : "42px",
                  height: isSelected ? "48px" : "42px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: `2px solid ${isSelected ? "var(--accent-amber)" : person.branchColor}`,
                  boxShadow: isSelected
                    ? "0 0 16px var(--accent-amber-glow)"
                    : isHovered
                    ? "0 0 10px rgba(255,255,255,0.15)"
                    : "var(--shadow-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: isSelected ? "1rem" : "0.9rem",
                  fontWeight: 600,
                  color: person.branchColor,
                  transition: "all var(--duration-fast)",
                }}
              >
                {person.name[0]}
              </div>

              {/* Name & Role Label Pill */}
              <div
                style={{
                  backgroundColor: isSelected
                    ? "var(--bg-surface-active)"
                    : isConnectedToActive
                    ? "var(--bg-surface-elevated)"
                    : "rgba(21, 23, 28, 0.85)",
                  border: `1px solid ${isSelected ? "var(--accent-amber)" : "var(--border-subtle)"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "2px 8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  whiteSpace: "nowrap",
                  backdropFilter: "blur(4px)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {person.name}
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  {person.role}
                </span>
              </div>
            </button>
          );
        })}

        {/* Canvas Bottom Legend / Instructions */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            right: "14px",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            backgroundColor: "rgba(14, 15, 18, 0.75)",
            padding: "4px 10px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)",
            pointerEvents: "none",
          }}
        >
          <Sparkles size={12} color="var(--accent-amber)" />
          <span>Fictional preview · Tap any relative to explore</span>
        </div>
      </div>

      {/* Selected Person Story & Kinship Card */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.4rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.85rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span
              style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "var(--radius-full)",
                backgroundColor: selectedPerson.branchColor,
              }}
            />
            <h3 style={{ fontSize: "1.15rem", fontWeight: 600, color: "var(--text-primary)" }}>
              {selectedPerson.name}
            </h3>
            <span
              style={{
                fontSize: "0.82rem",
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-surface-elevated)",
                padding: "2px 8px",
                borderRadius: "var(--radius-full)",
              }}
            >
              {selectedPerson.role} · Est. {selectedPerson.generation}
            </span>
          </div>

          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <BookOpen size={13} color="var(--accent-amber)" />
            <span>Family scrapbook snippet</span>
          </span>
        </div>

        {/* Narrative story text */}
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            fontStyle: "italic",
          }}
        >
          &ldquo;{selectedPerson.story}&rdquo;
        </p>

        {/* Connected Relatives Buttons */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.2rem" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginRight: "0.2rem" }}>
            Direct connections:
          </span>
          {selectedPerson.connections.map((conn) => {
            const relative = personMap.get(conn.id);
            if (!relative) return null;
            return (
              <button
                key={conn.id}
                onClick={() => setSelectedId(conn.id)}
                style={{
                  fontSize: "0.78rem",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  transition: "all var(--duration-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-amber)";
                  e.currentTarget.style.backgroundColor = "var(--bg-surface-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.backgroundColor = "var(--bg-surface-elevated)";
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>{conn.relation}:</span>
                <span style={{ fontWeight: 500, color: relative.branchColor }}>{relative.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
