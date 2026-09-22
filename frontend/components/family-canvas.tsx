"use client";

import React, { useState } from "react";
import { Plus, User, Sparkles, RefreshCw } from "lucide-react";
import { DEMO_PEOPLE, DEMO_EDGES } from "@/data/demo-family";
import { PersonNode } from "@/components/person-node";
import { PersonCard } from "@/components/person-card";

interface FamilyCanvasProps {
  mode: "demo" | "start";
  onSwitchToDemo: () => void;
  onFocusComposer?: () => void;
  selectedPersonId?: string | null;
  onSelectPerson?: (id: string | null) => void;
}

interface LocalStartedNode {
  id: string;
  name: string;
  relation: string;
  initials: string;
  branchColor: string;
  branchSoft: string;
  branchBorder: string;
  story: string;
  x: number;
  y: number;
}

export function FamilyCanvas({
  mode,
  onSwitchToDemo,
  onFocusComposer,
  selectedPersonId: propSelectedPersonId,
  onSelectPerson,
}: FamilyCanvasProps) {
  // Demo Mode State
  const [internalSelectedPersonId, setInternalSelectedPersonId] = useState<string | null>(null);
  const activeSelectedPersonId = propSelectedPersonId !== undefined ? propSelectedPersonId : internalSelectedPersonId;
  const setSelectedPersonId = (id: string | null) => {
    if (onSelectPerson) {
      onSelectPerson(id);
    } else {
      setInternalSelectedPersonId(id);
    }
  };

  const [showingPath, setShowingPath] = useState(false);

  // "Start with you" local interactive additions state
  const [addedNodes, setAddedNodes] = useState<LocalStartedNode[]>([]);

  // Selected person in Demo Mode
  const personMap = new Map(DEMO_PEOPLE.map((p) => [p.id, p]));
  const selectedPerson = activeSelectedPersonId ? personMap.get(activeSelectedPersonId) : undefined;

  // Relationship path calculation for demo trace
  // Nora -> Julian -> Arthur or Nora -> Julian -> Eleanor
  const pathEdgeKeys = new Set<string>();
  if (showingPath && activeSelectedPersonId) {
    if (activeSelectedPersonId === "arthur") {
      pathEdgeKeys.add("arthur-julian");
      pathEdgeKeys.add("julian-nora");
    } else if (activeSelectedPersonId === "eleanor") {
      pathEdgeKeys.add("eleanor-julian");
      pathEdgeKeys.add("julian-nora");
    } else if (activeSelectedPersonId === "clara") {
      pathEdgeKeys.add("clara-nora");
    } else if (activeSelectedPersonId === "julian") {
      pathEdgeKeys.add("julian-nora");
    } else if (activeSelectedPersonId === "leo") {
      pathEdgeKeys.add("nora-leo");
    } else if (activeSelectedPersonId === "maya") {
      pathEdgeKeys.add("nora-leo");
      pathEdgeKeys.add("leo-maya");
    }
  }

  // Handle adding a relative in "Start with you" mode
  const handleAddRelative = (role: "parent" | "partner" | "sibling") => {
    const id = `local-${role}-${Date.now()}`;
    let newNode: LocalStartedNode;

    if (role === "parent") {
      newNode = {
        id,
        name: "Parent",
        relation: "Mother / Father",
        initials: "P",
        branchColor: "var(--branch-sage)",
        branchSoft: "var(--branch-sage-soft)",
        branchBorder: "var(--branch-sage-border)",
        story: "Added during local first-run onboarding. In KIN milestone 5, narratives will automatically suggest dates and birthplaces.",
        x: 50,
        y: 28,
      };
    } else if (role === "partner") {
      newNode = {
        id,
        name: "Partner",
        relation: "Spouse",
        initials: "P",
        branchColor: "var(--branch-rose)",
        branchSoft: "var(--branch-rose-soft)",
        branchBorder: "var(--branch-rose-border)",
        story: "Your partner or spouse. Linked side-by-side with symmetric relationship invariants.",
        x: 72,
        y: 54,
      };
    } else {
      newNode = {
        id,
        name: "Sibling",
        relation: "Brother / Sister",
        initials: "S",
        branchColor: "var(--branch-blue)",
        branchSoft: "var(--branch-blue-soft)",
        branchBorder: "var(--branch-blue-border)",
        story: "Your sibling. Connected directly with sibling-of invariants that prevent ancestral contradictions.",
        x: 28,
        y: 54,
      };
    }

    setAddedNodes((prev) => [...prev.filter((n) => n.relation !== newNode.relation), newNode]);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "580px",
        height: "calc(100vh - 190px)",
        backgroundColor: "var(--bg-canvas)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
      role="region"
      aria-label="Family universe exploration canvas"
    >
      {/* Background Subtle Organic Texture */}
      <div className="spatial-canvas-bg" />

      {/* Canvas Top Mode Badge */}
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "20px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            padding: "4px 12px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {mode === "demo" ? "Fictional family universe" : "Your personal canvas"}
        </span>

        {mode === "demo" && (
          <button
            onClick={() => setShowingPath(!showingPath)}
            style={{
              fontSize: "0.78rem",
              fontWeight: 500,
              color: showingPath ? "var(--accent-warm-hover)" : "var(--text-muted)",
              backgroundColor: showingPath ? "var(--accent-warm-soft)" : "rgba(255, 255, 255, 0.8)",
              border: `1px solid ${showingPath ? "var(--accent-warm)" : "var(--border-subtle)"}`,
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              backdropFilter: "blur(8px)",
              transition: "all var(--duration-fast)",
            }}
          >
            <Sparkles size={12} color="var(--accent-warm)" />
            <span>{showingPath ? "Reset path highlight" : "Trace kinship paths"}</span>
          </button>
        )}
      </div>

      {/* =====================================================================
          MODE A: "START WITH YOU" FIRST-RUN CANVAS
         ===================================================================== */}
      {mode === "start" && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* SVG Connectors to any added relatives */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} aria-hidden="true">
            {addedNodes.map((node) => (
              <line
                key={node.id}
                x1="50%"
                y1="54%"
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke="var(--accent-warm)"
                strokeWidth="2.2"
                strokeDasharray="4 3"
                opacity="0.75"
              />
            ))}
          </svg>

          {/* Any Dynamically Added Relative Nodes */}
          {addedNodes.map((node) => (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
                animation: "scaleIn 220ms var(--ease-natural)",
                zIndex: 6,
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: "var(--bg-surface)",
                  border: `2.5px solid ${node.branchColor}`,
                  color: node.branchColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                {node.initials}
              </div>
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  padding: "2px 8px",
                  borderRadius: "var(--radius-full)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {node.name} ({node.relation})
              </span>
            </div>
          ))}

          {/* Central "You" Anchor Node & Satellites */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6rem",
              zIndex: 10,
            }}
          >
            {/* Satellite Action 1: Add a Parent (Top) */}
            <button
              onClick={() => handleAddRelative("parent")}
              aria-label="Add a parent to your family tree"
              style={{
                position: "absolute",
                top: "-52px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--branch-sage)",
                backgroundColor: "var(--bg-surface)",
                border: "1px dashed var(--branch-sage)",
                padding: "5px 12px",
                borderRadius: "var(--radius-full)",
                boxShadow: "var(--shadow-sm)",
                transition: "all var(--duration-fast)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--branch-sage-soft)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface)")}
            >
              <Plus size={13} />
              <span>Add a parent</span>
            </button>

            {/* Satellite Action 2: Add a Sibling (Left) */}
            <button
              onClick={() => handleAddRelative("sibling")}
              aria-label="Add a sibling to your family tree"
              style={{
                position: "absolute",
                left: "-130px",
                top: "40px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--branch-blue)",
                backgroundColor: "var(--bg-surface)",
                border: "1px dashed var(--branch-blue)",
                padding: "5px 12px",
                borderRadius: "var(--radius-full)",
                boxShadow: "var(--shadow-sm)",
                transition: "all var(--duration-fast)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--branch-blue-soft)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface)")}
            >
              <Plus size={13} />
              <span>Add a sibling</span>
            </button>

            {/* Satellite Action 3: Add a Partner (Right) */}
            <button
              onClick={() => handleAddRelative("partner")}
              aria-label="Add a partner or spouse to your family tree"
              style={{
                position: "absolute",
                right: "-130px",
                top: "40px",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--branch-rose)",
                backgroundColor: "var(--bg-surface)",
                border: "1px dashed var(--branch-rose)",
                padding: "5px 12px",
                borderRadius: "var(--radius-full)",
                boxShadow: "var(--shadow-sm)",
                transition: "all var(--duration-fast)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--branch-rose-soft)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface)")}
            >
              <Plus size={13} />
              <span>Add a partner</span>
            </button>

            {/* Central Circle "You" */}
            <div
              style={{
                width: "82px",
                height: "82px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--accent-warm-soft)",
                border: "3px solid var(--accent-warm)",
                boxShadow: "0 0 0 8px rgba(217, 119, 54, 0.16), var(--shadow-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-warm)",
                transition: "transform var(--duration-fast)",
              }}
            >
              <User size={38} strokeWidth={2.2} />
            </div>

            {/* Satellite Action 4: Tell KIN a story (Bottom) */}
            <button
              onClick={() => {
                if (onFocusComposer) {
                  onFocusComposer();
                } else {
                  document.getElementById("kin-story-input")?.focus();
                }
              }}
              aria-label="Tell KIN a story about your family"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--accent-warm)",
                backgroundColor: "var(--bg-surface)",
                border: "1px dashed var(--accent-warm)",
                padding: "5px 13px",
                borderRadius: "var(--radius-full)",
                boxShadow: "var(--shadow-sm)",
                transition: "all var(--duration-fast)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-warm-soft)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-surface)")}
            >
              <Sparkles size={13} />
              <span>Tell KIN a story</span>
            </button>

            {/* Title & Welcoming Story Prompt */}
            <div style={{ textAlign: "center", maxWidth: "260px", marginTop: "0.25rem" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Start with you.
              </h2>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                Every family starts somewhere.
              </p>
            </div>

            {/* Reset / Explore Demo Affordance */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button
                onClick={onSwitchToDemo}
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  padding: "5px 14px",
                  borderRadius: "var(--radius-full)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                Or explore the 3-generation demo →
              </button>

              {addedNodes.length > 0 && (
                <button
                  onClick={() => setAddedNodes([])}
                  aria-label="Reset added relatives"
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    padding: "4px 8px",
                  }}
                  title="Clear added relatives"
                >
                  <RefreshCw size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE B: FULL 3-GENERATION FICTIONAL DEMO CONSTELLATION
         ===================================================================== */}
      {mode === "demo" && (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
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

              const edgeKey = `${edge.from}-${edge.to}`;
              const reverseKey = `${edge.to}-${edge.from}`;
              const isPathHighlighted = pathEdgeKeys.has(edgeKey) || pathEdgeKeys.has(reverseKey);
              const isSelectedConnected =
                activeSelectedPersonId !== null &&
                (edge.from === activeSelectedPersonId || edge.to === activeSelectedPersonId);

              const strokeColor = isPathHighlighted
                ? "var(--accent-warm)"
                : isSelectedConnected
                ? "var(--accent-warm)"
                : "rgba(30, 28, 25, 0.16)";

              const strokeWidth = isPathHighlighted ? 3.2 : isSelectedConnected ? 2.2 : 1.2;
              const strokeDash = isPathHighlighted ? "6 3" : edge.type === "spouse" ? "4 3" : undefined;
              const opacity = isPathHighlighted ? 1 : isSelectedConnected ? 0.9 : 0.45;

              return (
                <line
                  key={edgeKey}
                  x1={`${p1.x}%`}
                  y1={`${p1.y}%`}
                  x2={`${p2.x}%`}
                  y2={`${p2.y}%`}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  opacity={opacity}
                  style={{
                    transition:
                      "stroke var(--duration-fast), stroke-width var(--duration-fast), opacity var(--duration-fast)",
                  }}
                />
              );
            })}
          </svg>

          {/* Interactive Person Nodes */}
          {DEMO_PEOPLE.map((person) => {
            const isSelected = activeSelectedPersonId ? person.id === activeSelectedPersonId : false;
            const isRelated = selectedPerson ? selectedPerson.connections.some((c) => c.id === person.id) : false;
            const isDimmed = activeSelectedPersonId ? !isSelected && !isRelated : false;

            return (
              <PersonNode
                key={person.id}
                person={person}
                isSelected={isSelected}
                isRelated={isRelated}
                isDimmed={isDimmed}
                onClick={() => {
                  setSelectedPersonId(person.id);
                  setShowingPath(false);
                }}
              />
            );
          })}

          {/* Floating Person Scrapbook Card (Bottom Right on Desktop / Bottom Sheet on Mobile) */}
          {selectedPerson && (
            <div className="person-details-container">
              <PersonCard
                person={selectedPerson}
                onSelectPerson={(id) => {
                  setSelectedPersonId(id);
                  setShowingPath(false);
                }}
                onClose={() => setSelectedPersonId(null)}
                onShowConnectionPath={() => setShowingPath(!showingPath)}
                isShowingPath={showingPath}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
