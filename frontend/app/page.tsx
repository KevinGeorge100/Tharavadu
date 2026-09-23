"use client";

import React, { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { AlbumStarter } from "@/components/onboarding/album-starter";
import { TharavaduComposer } from "@/components/tharavadu/tharavadu-composer";
import { ExtractionPreview } from "@/components/tharavadu/extraction-preview";
import { IdentityCollision, CollisionChoice } from "@/components/tharavadu/identity-collision";
import { DEMO_PROMPT_STORIES, DemoPromptStory, ExtractionCandidate } from "@/data/demo-stories";

const FamilyCanvas = dynamic(
  () => import("@/components/family/family-canvas").then((mod) => mod.FamilyCanvas),
  { ssr: false }
);

function TharavaduAppContent() {
  const searchParams = useSearchParams();

  const urlMode = searchParams.get("mode");
  const urlStep = searchParams.get("step");
  const urlSelected = searchParams.get("selected");
  const urlDiscovery = searchParams.get("discovery");
  const urlExtract = searchParams.get("extract");
  const urlBranchAdded = searchParams.get("branchAdded") === "true";
  const urlCollision = searchParams.get("collision") === "true";

  const [mode, setMode] = useState<"demo" | "first-run">(urlMode === "first-run" ? "first-run" : "demo");
  const [starterStep, setStarterStep] = useState<"empty" | "anchor">(urlStep === "anchor" ? "anchor" : "empty");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(urlSelected || null);
  const [discoveryKey, setDiscoveryKey] = useState<string | null>(urlDiscovery || null);
  const [branchAdded, setBranchAdded] = useState(urlBranchAdded);
  const [collisionOpen, setCollisionOpen] = useState(urlCollision);
  const [collisionNote, setCollisionNote] = useState<string | null>(null);

  const initialCandidate: ExtractionCandidate | null =
    urlExtract === "joseph" ? DEMO_PROMPT_STORIES[0].candidate : null;
  const [activeExtraction, setActiveExtraction] = useState<ExtractionCandidate | null>(initialCandidate);

  const handleStorySubmitted = (storyText: string) => {
    const lower = storyText.toLowerCase();
    if (lower.includes("george")) {
      setActiveExtraction(null);
      setCollisionOpen(true);
      return;
    }

    const matched = DEMO_PROMPT_STORIES.find(
      (item) =>
        lower.includes("joseph") ||
        lower.includes("brother") ||
        item.storyText.toLowerCase() === lower
    );

    if (matched) setActiveExtraction(matched.candidate);
    else {
      setActiveExtraction({
        primaryName: "Spoken story",
        primaryRole: "family note",
        relatives: [{ name: "Someone Tharavadu heard", relation: "mentioned" }],
        peopleCount: 1,
        connectionCount: 1,
        explanation: storyText,
      });
    }
  };

  const handlePromptStorySelect = (promptStory: DemoPromptStory) => {
    if (promptStory.id === "two-georges") {
      setActiveExtraction(null);
      setCollisionOpen(true);
      return;
    }
    setActiveExtraction(promptStory.candidate);
  };

  const handleAcceptExtraction = () => {
    setBranchAdded(true);
    setActiveExtraction(null);
  };

  const handleCollision = (choice: CollisionChoice) => {
    const labels: Record<CollisionChoice, string> = {
      "george-davis": "George Davis — Dad's cousin",
      "george-miller": "George Miller — Grandpa's brother",
      new: "Someone new",
    };
    setCollisionNote(`${labels[choice]} noted. Tharavadu will wait for you to confirm.`);
    setCollisionOpen(false);
    window.setTimeout(() => setCollisionNote(null), 2400);
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
      <div className="kin-canvas-bg" />

      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          zIndex: 30,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <BrandMark size={30} ariaLabel="Tharavadu logo" />
          <div>
            <div className="kin-stamp" style={{ fontSize: "1rem", lineHeight: 1 }} aria-label="Tharavadu (തറവാട്)">
              Tharavadu <span lang="ml" style={{ fontSize: "0.82rem", opacity: 0.85, fontWeight: 500, marginLeft: 4 }}>തറവാട്</span>
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {mode === "demo" ? "Demo Family" : "New album"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            className={mode === "demo" ? "kin-press" : "kin-press-ghost"}
            onClick={() => {
              setMode("demo");
              setSelectedPersonId(null);
              setDiscoveryKey(null);
            }}
            style={{ minHeight: 44, padding: "8px 12px", fontSize: "0.68rem" }}
          >
            Family
          </button>
          <button
            type="button"
            className={mode === "first-run" ? "kin-press" : "kin-press-ghost"}
            onClick={() => {
              setMode("first-run");
              setStarterStep("empty");
            }}
            style={{ minHeight: 44, padding: "8px 12px", fontSize: "0.68rem" }}
          >
            New album
          </button>
        </div>
      </header>

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
              padding: 20,
              overflowY: "auto",
            }}
          >
            <AlbumStarter
              key={starterStep}
              initialStep={starterStep}
              onAnchorCreated={() => setStarterStep("anchor")}
              onAddRelativeSlot={() => undefined}
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

        {collisionOpen && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 40,
              background: "rgba(22, 19, 16, 0.28)",
            }}
          >
            <IdentityCollision onChoose={handleCollision} onDismiss={() => setCollisionOpen(false)} />
          </div>
        )}

        {collisionNote && <div className="kin-bloom-label">{collisionNote}</div>}

        {activeExtraction && (
          <div
            style={{
              position: "absolute",
              bottom: 108,
              left: 16,
              right: 16,
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

        {mode === "demo" && !activeExtraction && !collisionOpen && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 12,
              display: "flex",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <TharavaduComposer onSubmitStory={handleStorySubmitted} onSelectPromptStory={handlePromptStorySelect} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div style={{ width: "100vw", height: "100vh", backgroundColor: "var(--bg-canvas)" }} />}>
      <TharavaduAppContent />
    </Suspense>
  );
}
