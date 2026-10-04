"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { AlbumStarter } from "@/components/onboarding/album-starter";
import { TharavaduComposer } from "@/components/tharavadu/tharavadu-composer";
import { ExtractionPreview } from "@/components/tharavadu/extraction-preview";
import { IdentityCollision, CollisionChoice } from "@/components/tharavadu/identity-collision";
import { LiveAuthDialog } from "@/components/tharavadu/live-auth-dialog";
import { LiveFamilyDialog } from "@/components/tharavadu/live-family-dialog";
import { DEMO_PROMPT_STORIES, DemoPromptStory, ExtractionCandidate } from "@/data/demo-stories";
import { FamilyMember } from "@/data/demo-family";
import {
  getMe,
  logout,
  listFamilies,
  getFamilyGraph,
  backendGraphToCanvas,
  User,
  Family,
  CanvasEdge,
  ApiError,
} from "@/lib/api";

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

  const [mode, setMode] = useState<"demo" | "first-run" | "live">(
    urlMode === "first-run" ? "first-run" : urlMode === "live" ? "live" : "demo"
  );
  const [starterStep, setStarterStep] = useState<"empty" | "anchor">(urlStep === "anchor" ? "anchor" : "empty");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(urlSelected || null);
  const [discoveryKey, setDiscoveryKey] = useState<string | null>(urlDiscovery || null);
  const [branchAdded, setBranchAdded] = useState(urlBranchAdded);
  const [collisionOpen, setCollisionOpen] = useState(urlCollision);
  const [collisionNote, setCollisionNote] = useState<string | null>(null);

  // Live backend API state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [families, setFamilies] = useState<Family[]>([]);
  const [activeFamily, setActiveFamily] = useState<Family | null>(null);
  const [liveGraphData, setLiveGraphData] = useState<{
    members: FamilyMember[];
    edges: CanvasEdge[];
    positions: Record<string, { x: number; y: number }>;
  } | null>(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const [, setLiveError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createFamilyModalOpen, setCreateFamilyModalOpen] = useState(false);

  const initialCandidate: ExtractionCandidate | null =
    urlExtract === "joseph" ? DEMO_PROMPT_STORIES[0].candidate : null;
  const [activeExtraction, setActiveExtraction] = useState<ExtractionCandidate | null>(initialCandidate);

  // Load families and their graphs
  const loadFamiliesAndGraph = useCallback(async (preferFamilyId?: string) => {
    try {
      setLiveError(null);
      const fams = await listFamilies();
      setFamilies(fams);
      if (fams.length > 0) {
        const selected = preferFamilyId ? fams.find((f) => f.id === preferFamilyId) || fams[0] : fams[0];
        setActiveFamily(selected);
        setGraphLoading(true);
        const g = await getFamilyGraph(selected.id);
        const adapted = backendGraphToCanvas(g, selected.self_id);
        setLiveGraphData(adapted);
      } else {
        setActiveFamily(null);
        setLiveGraphData(null);
      }
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
      } else if (err instanceof Error) {
        setLiveError(err.message);
      }
    } finally {
      setGraphLoading(false);
    }
  }, []);

  // Initial authentication check
  useEffect(() => {
    let isMounted = true;
    getMe()
      .then((currentUser) => {
        if (!isMounted) return;
        setUser(currentUser);
        if (currentUser) {
          loadFamiliesAndGraph();
        }
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setAuthLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [loadFamiliesAndGraph]);

  const handleSelectFamily = async (familyId: string) => {
    const fam = families.find((f) => f.id === familyId);
    if (!fam) return;
    setActiveFamily(fam);
    setSelectedPersonId(null);
    setGraphLoading(true);
    try {
      const g = await getFamilyGraph(fam.id);
      const adapted = backendGraphToCanvas(g, fam.self_id);
      setLiveGraphData(adapted);
    } catch (err: unknown) {
      if (err instanceof Error) setLiveError(err.message);
    } finally {
      setGraphLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Continue cleanup regardless
    }
    setUser(null);
    setFamilies([]);
    setActiveFamily(null);
    setLiveGraphData(null);
  };

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
              {mode === "demo" ? "Demo Family" : mode === "live" ? (activeFamily ? activeFamily.name : "Live Family") : "New album"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
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
            Demo
          </button>
          <button
            type="button"
            className={mode === "live" ? "kin-press" : "kin-press-ghost"}
            onClick={() => {
              setMode("live");
              setSelectedPersonId(null);
              setDiscoveryKey(null);
              if (!user && !authLoading) {
                setAuthModalOpen(true);
              }
            }}
            style={{ minHeight: 44, padding: "8px 12px", fontSize: "0.68rem" }}
          >
            Live Family
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

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
              {families.length > 1 && (
                <select
                  value={activeFamily?.id || ""}
                  onChange={(e) => handleSelectFamily(e.target.value)}
                  style={{
                    padding: "6px 8px",
                    minHeight: 38,
                    background: "var(--cream-hot)",
                    border: "var(--outline-thin) solid var(--ink)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {families.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                className="kin-press-ghost"
                onClick={() => setCreateFamilyModalOpen(true)}
                title="Create another family"
                style={{ minHeight: 38, padding: "6px 10px", fontSize: "0.68rem" }}
              >
                + Family
              </button>
              <button
                type="button"
                className="kin-press-ghost"
                onClick={handleLogout}
                style={{ minHeight: 38, padding: "6px 10px", fontSize: "0.68rem" }}
              >
                Sign out
              </button>
            </div>
          ) : (
            mode === "live" && (
              <button
                type="button"
                className="kin-press"
                onClick={() => setAuthModalOpen(true)}
                style={{ minHeight: 38, padding: "6px 12px", fontSize: "0.68rem", marginLeft: 4 }}
              >
                Sign in
              </button>
            )
          )}
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
        ) : mode === "live" ? (
          user ? (
            families.length === 0 ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <div
                  style={{
                    maxWidth: 420,
                    width: "100%",
                    background: "var(--cream-hot)",
                    border: "var(--outline-heavy) solid var(--ink)",
                    boxShadow: "var(--shadow-raised)",
                    padding: 24,
                    textAlign: "center",
                  }}
                >
                  <p className="kin-stamp" style={{ fontSize: "1rem", color: "var(--accent-warm)" }}>
                    No Family Connected Yet
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "0.95rem",
                      color: "var(--text-secondary)",
                      marginTop: 8,
                    }}
                  >
                    Create your family graph to start recording your lineage and kinship bonds.
                  </p>
                  <button
                    type="button"
                    className="kin-press"
                    onClick={() => setCreateFamilyModalOpen(true)}
                    style={{ minHeight: 44, padding: "10px 16px", marginTop: 18 }}
                  >
                    + Create Your Family
                  </button>
                </div>
              </div>
            ) : liveGraphData ? (
              <FamilyCanvas
                customMembers={liveGraphData.members}
                customEdges={liveGraphData.edges}
                customPositions={liveGraphData.positions}
                initialSelectedId={selectedPersonId}
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
                }}
              >
                <p className="kin-stamp" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {graphLoading ? "Loading family graph..." : "Preparing canvas..."}
                </p>
              </div>
            )
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
              }}
            >
              <div
                style={{
                  maxWidth: 420,
                  width: "100%",
                  background: "var(--cream-hot)",
                  border: "var(--outline-heavy) solid var(--ink)",
                  boxShadow: "var(--shadow-raised)",
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <p className="kin-stamp" style={{ fontSize: "1rem", color: "var(--ink)" }}>
                  Live Tharavadu Account
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.95rem",
                    color: "var(--text-secondary)",
                    marginTop: 8,
                  }}
                >
                  Sign in or register to connect to your live FastAPI backend and explore your family graph.
                </p>
                <button
                  type="button"
                  className="kin-press"
                  onClick={() => setAuthModalOpen(true)}
                  style={{ minHeight: 44, padding: "10px 16px", marginTop: 18 }}
                >
                  Sign in / Register →
                </button>
              </div>
            </div>
          )
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

        {authModalOpen && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 45,
              background: "rgba(22, 19, 16, 0.35)",
            }}
          >
            <LiveAuthDialog
              onSuccess={(authenticatedUser) => {
                setUser(authenticatedUser);
                setAuthModalOpen(false);
                loadFamiliesAndGraph();
              }}
              onDismiss={() => setAuthModalOpen(false)}
            />
          </div>
        )}

        {createFamilyModalOpen && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 45,
              background: "rgba(22, 19, 16, 0.35)",
            }}
          >
            <LiveFamilyDialog
              onCreated={(newFamily) => {
                setCreateFamilyModalOpen(false);
                loadFamiliesAndGraph(newFamily.id);
              }}
              onDismiss={() => setCreateFamilyModalOpen(false)}
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
