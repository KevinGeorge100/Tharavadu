"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { FamilyCanvas } from "@/components/family/family-canvas";
import { AlbumStarter } from "@/components/onboarding/album-starter";
import { KinComposer } from "@/components/kin/kin-composer";
import { ExtractionPreview } from "@/components/kin/extraction-preview";
import { DEMO_PROMPT_STORIES, DemoPromptStory, ExtractionCandidate } from "@/data/demo-stories";
import { User, Users } from "lucide-react";

function KinAppContent() {
  const searchParams = useSearchParams();

  // Query parameter state mapping
  const urlMode = searchParams.get("mode");
  const urlStep = searchParams.get("step");
  const urlSelected = searchParams.get("selected");
  const urlDiscovery = searchParams.get("discovery");
  const urlExtract = searchParams.get("extract");
  const urlBranchAdded = searchParams.get("branchAdded") === "true";

  const [mode, setMode] = useState<"demo" | "first-run">(
    urlMode === "first-run" ? "first-run" : "demo"
  );
  const [starterStep, setStarterStep] = useState<"empty" | "anchor">(
    urlStep === "anchor" ? "anchor" : "empty"
  );
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(urlSelected || null);
  const [discoveryKey, setDiscoveryKey] = useState<string | null>(urlDiscovery || null);
  const [branchAdded, setBranchAdded] = useState(urlBranchAdded);

  // Active AI extraction simulation candidate
  const initialCandidate: ExtractionCandidate | null =
    urlExtract === "joseph" ? DEMO_PROMPT_STORIES[0].candidate : null;
  const [activeExtraction, setActiveExtraction] = useState<ExtractionCandidate | null>(initialCandidate);

  // Story submission handler
  const handleStorySubmitted = (storyText: string) => {
    // Check if matching preset story or generic family story
    const matched = DEMO_PROMPT_STORIES.find((item) =>
      storyText.toLowerCase().includes("joseph") ||
      storyText.toLowerCase().includes("brother") ||
      item.storyText.toLowerCase() === storyText.toLowerCase()
    );

    if (matched) {
      setActiveExtraction(matched.candidate);
    } else {
      setActiveExtraction({
        primaryName: "New Family Memory",
        primaryRole: "Spoken Story",
        relatives: [
          { name: "Family Archive", relation: "Oral History" },
        ],
        peopleCount: 1,
        connectionCount: 1,
        explanation: `KIN extracted candidate relationships from: "${storyText.slice(0, 40)}..."`,
      });
    }
  };

  const handlePromptStorySelect = (promptStory: DemoPromptStory) => {
    setActiveExtraction(promptStory.candidate);
  };

  const handleAcceptExtraction = () => {
    setBranchAdded(true);
    setActiveExtraction(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "var(--bg-canvas)",
      }}
    >
      {/* Texture Background */}
      <div className="kin-canvas-bg" />

      {/* Minimal Top Bar Chrome */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 18px",
          zIndex: 30,
          flexShrink: 0,
          borderBottom: "1px solid var(--border-subtle)",
          backgroundColor: "rgba(252, 248, 241, 0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Brand & Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <BrandMark size={28} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "var(--text-primary)",
                  lineHeight: 1.1,
                }}
              >
                KIN
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                }}
              >
                · {mode === "demo" ? "The Davis Family Constellation" : "Personal Album Starter"}
              </span>
            </div>
          </div>
        </div>

        {/* Mode Switcher Affordance */}
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
          aria-label="Family canvas view modes"
        >
          <button
            onClick={() => {
              setMode("demo");
              setSelectedPersonId(null);
              setDiscoveryKey(null);
            }}
            role="tab"
            aria-selected={mode === "demo"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
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
            <span>Family Canvas</span>
          </button>

          <button
            onClick={() => {
              setMode("first-run");
              setStarterStep("empty");
            }}
            role="tab"
            aria-selected={mode === "first-run"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 14px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: mode === "first-run" ? "var(--text-inverted)" : "var(--text-secondary)",
              backgroundColor: mode === "first-run" ? "var(--accent-warm)" : "transparent",
              transition: "all var(--duration-fast)",
            }}
          >
            <User size={14} />
            <span>Start Fresh</span>
          </button>
        </div>
      </header>

      {/* Main Family Canvas Experience (Dominates 85%+ of screen) */}
      <main style={{ flex: 1, position: "relative", minHeight: 0 }}>
        {mode === "demo" ? (
          <FamilyCanvas
            initialSelectedId={selectedPersonId}
            initialDiscoveryPathKey={discoveryKey}
            isNewBranchAdded={branchAdded}
            onSelectPerson={setSelectedPersonId}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <AlbumStarter
              initialStep={starterStep}
              onAnchorCreated={() => {
                setStarterStep("anchor");
              }}
              onAddRelativeSlot={(role) => {
                alert(`[Demo Slot] Staging ghost card for ${role}. In KIN milestone 5, this creates a local entity proposal.`);
              }}
              onTryStarterStory={(storyText) => {
                setMode("demo");
                handleStorySubmitted(storyText);
              }}
              onExploreDemo={() => {
                setMode("demo");
                setSelectedPersonId(null);
              }}
            />
          </div>
        )}

        {/* Demo AI Extraction Preview Modal (Materializes when story analyzed) */}
        {activeExtraction && (
          <div
            style={{
              position: "absolute",
              bottom: "100px",
              left: "16px",
              right: "16px",
              display: "flex",
              justifyContent: "center",
              zIndex: 35,
            }}
          >
            <ExtractionPreview
              candidate={activeExtraction}
              onAccept={handleAcceptExtraction}
              onDismiss={() => setActiveExtraction(null)}
            />
          </div>
        )}

        {/* Floating Conversational AI Story Note Strip (Pinned to Lower Center) */}
        {mode === "demo" && !activeExtraction && (
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
            <KinComposer
              onSubmitStory={handleStorySubmitted}
              onSelectPromptStory={handlePromptStorySelect}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ width: "100vw", height: "100vh", backgroundColor: "var(--bg-canvas)" }} />}>
      <KinAppContent />
    </Suspense>
  );
}
