"use client";

import React, { useState } from "react";
import { User, Plus, Sparkles, ArrowRight, BookOpen } from "lucide-react";

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

  const handleConfirmAnchor = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;
    setStep("anchor");
    onAnchorCreated(name.trim());
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "520px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.2rem",
        zIndex: 10,
      }}
    >
      {/* Question Header */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.85rem",
            fontStyle: "italic",
            color: "var(--accent-warm)",
            letterSpacing: "0.02em",
          }}
        >
          {step === "empty" ? "Chapter One · Beginning" : "Chapter One · Root Established"}
        </span>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.85rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.15,
            marginTop: "2px",
          }}
        >
          {step === "empty" ? "Who should we start with?" : `Nice to meet you, ${name}.`}
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginTop: "4px",
            maxWidth: "380px",
            marginInline: "auto",
          }}
        >
          {step === "empty"
            ? "Every family album begins with an anchor. Enter your name or a beloved relative to ground the tree."
            : "Who belongs around you? Tap a slot to branch your roots, or tell KIN a story."}
        </p>
      </div>

      {/* Primary Person Card (Editable or Confirmed Anchor) */}
      <div
        className="photo-card-frame"
        style={{
          width: "240px",
          padding: "16px 14px 14px",
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--bg-surface-elevated)",
          border: "2px solid var(--accent-warm)",
          boxShadow: "var(--shadow-selected)",
          transform: "rotate(-0.8deg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div className="tape-strip" />

        {/* Photo Area */}
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--accent-warm-soft)",
            border: "1.5px dashed var(--accent-warm)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-warm)",
            gap: "4px",
          }}
        >
          <User size={34} strokeWidth={2} />
          <span style={{ fontSize: "0.68rem", fontWeight: 600 }}>This is you</span>
        </div>

        {/* Name Input or Confirmed Display */}
        {step === "empty" ? (
          <form onSubmit={handleConfirmAnchor} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              aria-label="Enter your name"
              autoFocus
              style={{
                width: "100%",
                padding: "8px 10px",
                fontFamily: "var(--font-serif)",
                fontSize: "1.1rem",
                fontWeight: 700,
                textAlign: "center",
                borderRadius: "var(--radius-sm)",
                border: "1.5px solid var(--border-default)",
                backgroundColor: "var(--bg-canvas-subtle)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                width: "100%",
                padding: "7px 12px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--accent-warm)",
                color: "var(--text-inverted)",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span>Begin album</span>
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          <div style={{ textAlign: "center" }}>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {name}
            </h3>
            <span
              style={{
                fontSize: "0.76rem",
                fontWeight: 600,
                color: "var(--accent-warm)",
                backgroundColor: "var(--accent-warm-soft)",
                padding: "2px 8px",
                borderRadius: "var(--radius-xs)",
              }}
            >
              Anchor Person · Storyteller
            </span>
          </div>
        )}
      </div>

      {/* Step 2: Ghost Relative Slots & Natural Intro */}
      {step === "anchor" && (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            animation: "fadeIn 250ms ease",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={() => onAddRelativeSlot("parent")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--branch-sage)",
                backgroundColor: "var(--bg-surface)",
                border: "1.5px dashed var(--branch-sage)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                boxShadow: "var(--shadow-sm)",
                transition: "all var(--duration-fast)",
              }}
            >
              <Plus size={14} />
              <span>Add a parent</span>
            </button>

            <button
              onClick={() => onAddRelativeSlot("sibling")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--branch-blue)",
                backgroundColor: "var(--bg-surface)",
                border: "1.5px dashed var(--branch-blue)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                boxShadow: "var(--shadow-sm)",
                transition: "all var(--duration-fast)",
              }}
            >
              <Plus size={14} />
              <span>Add a sibling</span>
            </button>

            <button
              onClick={() => onAddRelativeSlot("partner")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--branch-rose)",
                backgroundColor: "var(--bg-surface)",
                border: "1.5px dashed var(--branch-rose)",
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                boxShadow: "var(--shadow-sm)",
                transition: "all var(--duration-fast)",
              }}
            >
              <Plus size={14} />
              <span>Add a partner</span>
            </button>
          </div>

          {/* Prominent "OR JUST TELL KIN" strip */}
          <div
            style={{
              width: "100%",
              backgroundColor: "var(--bg-archival-note)",
              border: "1.5px solid var(--border-warm)",
              borderRadius: "var(--radius-md)",
              padding: "12px 14px",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={14} color="var(--accent-warm)" />
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--accent-warm)",
                }}
              >
                Or Just Tell KIN
              </span>
            </div>

            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.92rem",
                fontStyle: "italic",
                color: "var(--text-secondary)",
              }}
            >
              “My mother is Anna and I have a brother called Joel.”
            </p>

            <button
              onClick={() => onTryStarterStory("My mother is Anna and I have a brother called Joel.")}
              style={{
                alignSelf: "flex-start",
                marginTop: "2px",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--accent-warm)",
                backgroundColor: "var(--accent-warm-soft)",
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Try this story in composer</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Switch to Explore Demo Constellation Button */}
      <div style={{ marginTop: "6px" }}>
        <button
          onClick={onExploreDemo}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <BookOpen size={14} color="var(--accent-warm)" />
          <span>Or explore the 3-generation Davis family constellation →</span>
        </button>
      </div>
    </div>
  );
}
