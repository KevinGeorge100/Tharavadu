"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Compass,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  MessageSquare,
  Users,
} from "lucide-react";
import { ConstellationPreview } from "@/components/constellation-preview";

type ActiveTab = "demo" | "start";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("demo");
  const [sampleStory, setSampleStory] = useState(
    "My grandmother Clara loved wildflowers and told stories about grandfather Arthur. They had a son named Julian."
  );
  const [hasPreviewed, setHasPreviewed] = useState(false);

  const samplePresets = [
    "My grandmother Clara loved wildflowers and told stories about grandfather Arthur. They had a son named Julian.",
    "Uncle Thomas has two children named Raj and Maya. Maya is learning photography from her mother Sara.",
    "Julian and Clara built their first cabin by the lake in 1968 with brother Leo helping every weekend.",
  ];

  return (
    <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
      {/* Hero Header Section */}
      <section style={{ textAlign: "center", marginBottom: "3rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Soft magical pill badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "var(--accent-amber-soft)",
            color: "var(--accent-amber)",
            border: "1px solid rgba(224, 136, 70, 0.3)",
            padding: "6px 14px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.85rem",
            fontWeight: 500,
            marginBottom: "1.25rem",
          }}
        >
          <Sparkles size={14} />
          <span>A warm, personal family constellation</span>
        </div>

        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            maxWidth: "780px",
            marginBottom: "1rem",
          }}
        >
          Family stories, <span style={{ color: "var(--accent-amber)" }}>connected.</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(1.05rem, 2vw, 1.22rem)",
            color: "var(--text-secondary)",
            maxWidth: "620px",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          Tell KIN what your family remembers in everyday words.
          Watch your roots emerge into an interactive, cycle-free universe.
        </p>

        {/* Primary Action Tabs: Switch between Constellation Demo and Start Experience */}
        <div
          style={{
            display: "inline-flex",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-full)",
            padding: "4px",
            gap: "4px",
            boxShadow: "var(--shadow-sm)",
          }}
          role="tablist"
          aria-label="First-run modes"
        >
          <button
            onClick={() => setActiveTab("demo")}
            role="tab"
            aria-selected={activeTab === "demo"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "8px 20px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.92rem",
              fontWeight: 600,
              color: activeTab === "demo" ? "var(--text-inverted)" : "var(--text-secondary)",
              backgroundColor: activeTab === "demo" ? "var(--accent-amber)" : "transparent",
              transition: "all var(--duration-fast)",
            }}
          >
            <Compass size={16} />
            <span>Explore Demo Constellation</span>
          </button>

          <button
            onClick={() => setActiveTab("start")}
            role="tab"
            aria-selected={activeTab === "start"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "8px 20px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.92rem",
              fontWeight: 600,
              color: activeTab === "start" ? "var(--text-inverted)" : "var(--text-secondary)",
              backgroundColor: activeTab === "start" ? "var(--accent-amber)" : "transparent",
              transition: "all var(--duration-fast)",
            }}
          >
            <BookOpen size={16} />
            <span>Tell Your First Story</span>
          </button>
        </div>
      </section>

      {/* Main Interactive Stage */}
      {activeTab === "demo" ? (
        <section aria-labelledby="constellation-demo-heading" style={{ marginBottom: "4rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h2
              id="constellation-demo-heading"
              style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-primary)" }}
            >
              Fictional Family Preview
            </h2>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Six relatives · Three generations · Zero cloud dependencies
            </span>
          </div>

          {/* Interactive Constellation Preview */}
          <ConstellationPreview />
        </section>
      ) : (
        /* Story Input / First-Run Experience */
        <section aria-labelledby="story-entry-heading" style={{ marginBottom: "4rem" }}>
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-lg)",
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div style={{ maxWidth: "680px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--accent-amber-soft)",
                    color: "var(--accent-amber)",
                  }}
                >
                  <MessageSquare size={16} />
                </span>
                <h2 id="story-entry-heading" style={{ fontSize: "1.4rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  Tell KIN what you know
                </h2>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Speak naturally. Mention relatives, parents, siblings, or shared memories.
                KIN translates your words into an open, reviewable proposal before anything touches your tree.
              </p>

              {/* Story Textarea */}
              <label htmlFor="story-input" style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-secondary)", marginBottom: "0.4rem" }}>
                Your Family Story:
              </label>
              <textarea
                id="story-input"
                value={sampleStory}
                onChange={(e) => {
                  setSampleStory(e.target.value);
                  setHasPreviewed(false);
                }}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem",
                  backgroundColor: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  resize: "vertical",
                  marginBottom: "0.75rem",
                }}
                placeholder="e.g. My mother Clara has a brother named Arthur. Arthur married Eleanor in 1960..."
              />

              {/* Sample Story Presets */}
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  Or try a sample story:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {samplePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSampleStory(preset);
                        setHasPreviewed(true);
                      }}
                      style={{
                        fontSize: "0.78rem",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: "var(--bg-surface-elevated)",
                        border: "1px solid var(--border-subtle)",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        transition: "all var(--duration-fast)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent-amber)";
                        e.currentTarget.style.color = "var(--text-primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      Sample {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button: Truthful Preview */}
              <button
                onClick={() => setHasPreviewed(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "var(--accent-amber)",
                  color: "var(--text-inverted)",
                  padding: "10px 22px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  transition: "all var(--duration-fast)",
                  boxShadow: "var(--shadow-sm)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-amber-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--accent-amber)")}
              >
                <span>Preview AI Extraction</span>
                <ArrowRight size={16} />
              </button>

              {/* Interactive Proposal Result Card */}
              {hasPreviewed && (
                <div
                  style={{
                    marginTop: "1.75rem",
                    padding: "1.25rem",
                    backgroundColor: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    animation: "fadeIn 200ms ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--branch-sage)" }}>
                    <CheckCircle2 size={16} />
                    <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>
                      Proposed Kinship Extraction (Client Preview)
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    In Project KIN, LLMs never write directly to your tree. They generate a typed proposal that you confirm with 100% human oversight:
                  </p>

                  <div
                    style={{
                      backgroundColor: "var(--bg-canvas)",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      fontFamily: "monospace",
                      fontSize: "0.82rem",
                      color: "var(--text-primary)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3rem",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div><span style={{ color: "var(--accent-amber)" }}>Entities Detected:</span> Clara (female), Arthur (male), Julian (male)</div>
                    <div><span style={{ color: "var(--branch-sage)" }}>Relationships:</span> Arthur SPOUSE_OF Clara; Arthur PARENT_OF Julian</div>
                    <div><span style={{ color: "var(--branch-teal)" }}>Invariants:</span> 0 cycles · 0 self-ancestry conflicts · Safe to commit</div>
                  </div>

                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    💡 <em>Truthful Milestone Note:</em> Live graph persistence and API session confirmation connect in milestone <strong>KIN-005</strong>. In the meantime, explore our interactive constellation demo above!
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Why KIN Feels Different Feature Grid */}
      <section aria-labelledby="why-kin-heading" style={{ marginTop: "3rem" }}>
        <h2
          id="why-kin-heading"
          style={{
            fontSize: "1.35rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Why KIN feels different
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.4rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--accent-amber-soft)",
                color: "var(--accent-amber)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare size={18} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
              Stories, Not Forms
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Share family memories the way people naturally talk. KIN parses conversations into clean genealogical candidates.
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.4rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--branch-sage-soft)",
                color: "var(--branch-sage)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={18} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
              Human in the Loop
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              If two relatives share the same name, KIN never guesses. It asks you to disambiguate so your family tree stays true.
            </p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.4rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--branch-teal-soft)",
                color: "var(--branch-teal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
              Mathematical Truth
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Exact cousin degrees, in-laws, and ancestors are calculated deterministically by pure graph algorithms—never guessed by an LLM.
            </p>
          </div>

          {/* Card 4 */}
          <div
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "1.4rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--branch-rose-soft)",
                color: "var(--branch-rose)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart size={18} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)" }}>
              100% Local & Private
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Your private family records live on your machine. No telemetry, no corporate lock-in, and full open-source sovereignty.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
