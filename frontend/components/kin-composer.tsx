"use client";

import React, { useState } from "react";
import { Sparkles, ArrowUp, CheckCircle2, X } from "lucide-react";
import { COMPOSER_SUGGESTIONS } from "@/data/demo-family";

interface KinComposerProps {
  onStorySubmitted?: (storyText: string) => void;
  initialStory?: string | null;
}

export function KinComposer({ onStorySubmitted, initialStory }: KinComposerProps) {
  const [input, setInput] = useState(initialStory || "");
  const [feedback, setFeedback] = useState<string | null>(
    initialStory
      ? `KIN extracted candidate relationships from: "${initialStory.slice(0, 45)}..." (Local Demo Simulation)`
      : null
  );

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setFeedback(`KIN extracted candidate relationships from: "${trimmed.slice(0, 45)}..." (Local Demo Simulation)`);
    if (onStorySubmitted) {
      onStorySubmitted(trimmed);
    }
    setInput("");
  };

  const handlePresetClick = (preset: string) => {
    // Strip surrounding quotes
    const cleaned = preset.replace(/^[“”"]|[“”"]$/g, "");
    setInput(cleaned);
    setFeedback(`KIN extracted candidate relationships from: "${cleaned.slice(0, 45)}..." (Local Demo Simulation)`);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "620px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        zIndex: 20,
      }}
    >
      {/* Local Simulation Feedback Pill */}
      {feedback && (
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--accent-warm-border)",
            borderRadius: "var(--radius-md)",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
            boxShadow: "var(--shadow-md)",
            fontSize: "0.82rem",
            color: "var(--text-secondary)",
            animation: "fadeIn 180ms ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <CheckCircle2 size={15} color="var(--branch-sage)" />
            <span>
              <strong style={{ color: "var(--text-primary)" }}>Proposal staged:</strong> {feedback}
            </span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            aria-label="Dismiss feedback"
            style={{ color: "var(--text-muted)", padding: "2px" }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating Prompt Suggestions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          overflowX: "auto",
          paddingBottom: "2px",
          scrollbarWidth: "none",
        }}
      >
        <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", whiteSpace: "nowrap", paddingLeft: "4px" }}>
          Try:
        </span>
        {COMPOSER_SUGGESTIONS.slice(0, 3).map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handlePresetClick(suggestion)}
            style={{
              fontSize: "0.76rem",
              padding: "3px 10px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              whiteSpace: "nowrap",
              backdropFilter: "blur(6px)",
              transition: "all var(--duration-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-warm)";
              e.currentTarget.style.backgroundColor = "var(--bg-surface)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-subtle)";
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.75)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Floating Conversational Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--bg-surface)",
          border: "1.5px solid var(--border-default)",
          borderRadius: "var(--radius-full)",
          padding: "5px 6px 5px 16px",
          boxShadow: "var(--shadow-floating)",
          transition: "border-color var(--duration-fast)",
        }}
        onFocus={() => {}}
      >
        <Sparkles size={16} color="var(--accent-warm)" style={{ flexShrink: 0, marginRight: "0.6rem" }} />
        <input
          id="kin-story-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell KIN something about your family…"
          aria-label="Tell KIN something about your family"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontSize: "0.92rem",
            color: "var(--text-primary)",
          }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send family story"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "var(--radius-full)",
            backgroundColor: input.trim() ? "var(--accent-warm)" : "var(--bg-canvas-subtle)",
            color: input.trim() ? "var(--text-inverted)" : "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all var(--duration-fast)",
            cursor: input.trim() ? "pointer" : "default",
          }}
        >
          <ArrowUp size={16} />
        </button>
      </form>
    </div>
  );
}
