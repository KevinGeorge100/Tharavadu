"use client";

import React, { useState } from "react";
import { PersonPortrait } from "@/components/family/person-portrait";

interface AlbumStarterProps {
  initialStep?: "empty" | "anchor";
  onAnchorCreated: (name: string) => void;
  onAddRelativeSlot: (role: "parent" | "sibling" | "partner") => void;
  onTryStarterStory: (story: string) => void;
  onExploreDemo: () => void;
}

export function AlbumStarter({
  initialStep = "empty",
  onAnchorCreated,
  onAddRelativeSlot,
  onTryStarterStory,
  onExploreDemo,
}: AlbumStarterProps) {
  const [step, setStep] = useState<"empty" | "anchor">(initialStep);
  const [name, setName] = useState("Nora");
  const [photoOn, setPhotoOn] = useState(false);
  const [ghosts, setGhosts] = useState<Array<"parent" | "sibling" | "partner">>([]);

  const handleConfirmAnchor = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name.trim()) return;
    setStep("anchor");
    onAnchorCreated(name.trim());
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 560,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <p className="kin-stamp" style={{ fontSize: "0.78rem", color: "var(--accent-warm)" }}>
          {step === "empty" ? "Let's put someone on the map." : "Who's around you?"}
        </p>
      </div>

      <div
        style={{
          width: 220,
          background: "var(--cream-hot)",
          border: "var(--outline-heavy) solid var(--ink)",
          boxShadow: "var(--shadow-raised)",
          transform: "rotate(-1.1deg)",
        }}
      >
        <div className="tape-strip" />
        <button
          type="button"
          onClick={() => setPhotoOn(true)}
          aria-label="Add photo"
          style={{
            width: "100%",
            minHeight: 132,
            background: photoOn ? "transparent" : "repeating-linear-gradient(135deg, #ead9b8 0 10px, #decaa6 10px 20px)",
            borderBottom: "var(--outline-medium) solid var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {photoOn ? (
            <PersonPortrait type="silhouette-nora" color="var(--accent-warm)" size={220} />
          ) : (
            <span className="kin-stamp" style={{ fontSize: "0.72rem" }}>
              Add photo
            </span>
          )}
        </button>
        <div style={{ padding: 12 }}>
          {step === "empty" ? (
            <form onSubmit={handleConfirmAnchor} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label htmlFor="starter-name" className="kin-stamp" style={{ fontSize: "0.62rem" }}>
                Your name
              </label>
              <input
                id="starter-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                style={{
                  border: "none",
                  borderBottom: "var(--outline-medium) solid var(--ink)",
                  background: "transparent",
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  textAlign: "center",
                  padding: "8px 4px",
                  minHeight: 44,
                }}
              />
              <button type="submit" disabled={!name.trim()} className="kin-press" style={{ minHeight: 44, padding: "10px 12px" }}>
                {"That's me →"}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 700 }}>{name}</div>
              <div className="kin-stamp" style={{ fontSize: "0.62rem", color: "var(--accent-warm)", marginTop: 4 }}>
                You
              </div>
            </div>
          )}
        </div>
      </div>

      {step === "anchor" && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {(["parent", "sibling", "partner"] as const).map((role) => {
              const placed = ghosts.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setGhosts((current) => (current.includes(role) ? current : [...current, role]));
                    onAddRelativeSlot(role);
                  }}
                  style={{
                    width: 118,
                    minHeight: 92,
                    border: "var(--outline-medium) dashed var(--ink)",
                    background: placed ? "var(--branch-mustard-soft)" : "rgba(255, 248, 234, 0.55)",
                    boxShadow: placed ? "var(--shadow-rest)" : "none",
                    padding: 10,
                  }}
                >
                  <span className="kin-stamp" style={{ fontSize: "0.68rem" }}>
                    {placed ? role : role}
                  </span>
                  {!placed && <div style={{ marginTop: 8, fontSize: "1.2rem" }}>+</div>}
                </button>
              );
            })}
          </div>

          <div
            style={{
              width: "100%",
              background: "var(--bg-archival-note)",
              border: "var(--outline-heavy) solid var(--ink)",
              boxShadow: "var(--shadow-rest)",
              padding: 14,
            }}
          >
            <p className="kin-stamp" style={{ fontSize: "0.72rem" }}>
              Or just tell KIN a story
            </p>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", marginTop: 8 }}>
              “My mother is Anna and I have a brother called Joel.”
            </p>
            <button
              type="button"
              className="kin-press"
              style={{ marginTop: 12, minHeight: 44, padding: "10px 12px" }}
              onClick={() => onTryStarterStory("My mother is Anna and I have a brother called Joel.")}
            >
              Tell KIN →
            </button>
          </div>
        </div>
      )}

      <button type="button" onClick={onExploreDemo} className="kin-press-ghost" style={{ minHeight: 44, padding: "10px 14px" }}>
        Open the demo family
      </button>
    </div>
  );
}
