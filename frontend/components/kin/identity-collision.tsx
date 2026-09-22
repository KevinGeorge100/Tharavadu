"use client";

import React from "react";
import { PersonPortrait } from "@/components/family/person-portrait";

export type CollisionChoice = "george-davis" | "george-miller" | "new";

interface IdentityCollisionProps {
  onChoose: (choice: CollisionChoice) => void;
  onDismiss: () => void;
}

const CANDIDATES: {
  id: CollisionChoice;
  name: string;
  relation: string;
  color: string;
  portrait: "silhouette-uncle" | "silhouette-father";
}[] = [
  {
    id: "george-davis",
    name: "George Davis",
    relation: "Dad's cousin",
    color: "var(--branch-sage)",
    portrait: "silhouette-father",
  },
  {
    id: "george-miller",
    name: "George Miller",
    relation: "Grandpa's brother",
    color: "var(--branch-terracotta)",
    portrait: "silhouette-uncle",
  },
];

export function IdentityCollision({ onChoose, onDismiss }: IdentityCollisionProps) {
  return (
    <div
      role="dialog"
      aria-labelledby="two-georges-title"
      style={{
        width: "100%",
        maxWidth: "520px",
        background: "var(--cream-hot)",
        border: "var(--outline-heavy) solid var(--ink)",
        boxShadow: "var(--shadow-raised)",
        padding: "16px 16px 14px",
        transform: "rotate(-0.4deg)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <p id="two-georges-title" className="kin-stamp" style={{ fontSize: "1.05rem", color: "var(--ink)" }}>
            Two Georges 👀
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.95rem",
              marginTop: 4,
              color: "var(--text-secondary)",
            }}
          >
            Which one did you mean?
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Close"
          className="kin-press-ghost"
          style={{ width: 44, height: 44 }}
        >
          ×
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 10,
          marginTop: 14,
        }}
      >
        {CANDIDATES.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => onChoose(person.id)}
            aria-label={`${person.name}, ${person.relation}`}
            style={{
              textAlign: "left",
              background: "var(--cream-hot)",
              border: "var(--outline-medium) solid var(--ink)",
              boxShadow: "var(--shadow-rest)",
              minHeight: 44,
            }}
          >
            <PersonPortrait type={person.portrait} color={person.color} size={148} />
            <div style={{ padding: "8px 10px 10px" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: "0.95rem" }}>{person.name}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: person.color, marginTop: 2 }}>
                {person.relation}
              </div>
            </div>
          </button>
        ))}

        <button
          type="button"
          onClick={() => onChoose("new")}
          className="kin-press-ghost"
          style={{
            minHeight: 160,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 12,
          }}
        >
          <span style={{ fontSize: "1.6rem" }}>+</span>
          <span>Someone new</span>
        </button>
      </div>
    </div>
  );
}
