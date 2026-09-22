"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { FamilyCanvas } from "@/components/family-canvas";
import { KinComposer } from "@/components/kin-composer";
import { User, Users } from "lucide-react";

function FamilyExperience() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "start" ? "start" : "demo";
  const initialSelected = searchParams.get("selected");
  const initialStory = searchParams.get("story");

  const [mode, setMode] = useState<"demo" | "start">(initialMode);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(initialSelected);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        padding: "0.75rem 1rem",
        gap: "0.65rem",
      }}
    >
      {/* Minimal Top Bar Chrome */}
      <header
        className="spatial-top-bar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.25rem 0.5rem",
          zIndex: 30,
          flexShrink: 0,
        }}
      >
        {/* Brand & Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <BrandMark size={28} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
            <span
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
              }}
            >
              KIN
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>
              family stories, connected
            </span>
          </div>
        </div>

        {/* Center Mode Switcher Affordance */}
        <div
          style={{
            display: "inline-flex",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-full)",
            padding: "3px",
            gap: "3px",
            boxShadow: "var(--shadow-sm)",
          }}
          role="tablist"
          aria-label="Family exploration modes"
        >
          <button
            onClick={() => setMode("demo")}
            role="tab"
            aria-selected={mode === "demo"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "5px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: mode === "demo" ? "var(--text-inverted)" : "var(--text-secondary)",
              backgroundColor: mode === "demo" ? "var(--accent-warm)" : "transparent",
              transition: "all var(--duration-fast)",
            }}
          >
            <Users size={14} />
            <span>Demo Constellation</span>
          </button>

          <button
            onClick={() => setMode("start")}
            role="tab"
            aria-selected={mode === "start"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "5px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: mode === "start" ? "var(--text-inverted)" : "var(--text-secondary)",
              backgroundColor: mode === "start" ? "var(--accent-warm)" : "transparent",
              transition: "all var(--duration-fast)",
            }}
          >
            <User size={14} />
            <span>Start With You</span>
          </button>
        </div>

        {/* Subtle Open Source & About Affordance */}
        <div className="spatial-badge-hide-mobile" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              backgroundColor: "rgba(30, 28, 25, 0.04)",
              padding: "3px 9px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            Open Source · MIT
          </span>
        </div>
      </header>

      {/* Main Spatial Family Playground Canvas */}
      <main style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <FamilyCanvas
          mode={mode}
          selectedPersonId={selectedPersonId}
          onSelectPerson={setSelectedPersonId}
          onSwitchToDemo={() => {
            setMode("demo");
            setSelectedPersonId(null);
          }}
        />

        {/* Floating Conversational AI Composer (Pinned to Bottom of Canvas) */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            display: "flex",
            justifyContent: "center",
            pointerEvents: "auto",
            zIndex: 20,
          }}
        >
          <KinComposer initialStory={initialStory} />
        </div>
      </main>

      {/* Subtle Spatial Status Bar */}
      <footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 0.5rem 0.25rem",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          flexShrink: 0,
        }}
      >
        <span>
          {mode === "demo"
            ? "Click relatives to explore stories and connections · Tap 'Trace kinship paths' for relationship discovery"
            : "Click satellite actions around 'You' to branch family roots · Everything runs locally"}
        </span>
        <span className="spatial-footer-secondary">Local-first · Zero cloud tracking</span>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "var(--bg-canvas)" }} />}>
      <FamilyExperience />
    </Suspense>
  );
}
