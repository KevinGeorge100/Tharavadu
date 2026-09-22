"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { DEMO_PROMPT_STORIES, DemoPromptStory } from "@/data/demo-stories";

interface KinComposerProps {
  initialStory?: string | null;
  onSubmitStory: (storyText: string) => void;
  onSelectPromptStory?: (story: DemoPromptStory) => void;
}

export function KinComposer({
  initialStory = "",
  onSubmitStory,
  onSelectPromptStory,
}: KinComposerProps) {
  const [input, setInput] = useState(initialStory || "");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSubmitStory(trimmed);
  };

  const handleChipClick = (promptStory: DemoPromptStory) => {
    setInput(promptStory.storyText);
    if (onSelectPromptStory) {
      onSelectPromptStory(promptStory);
    } else {
      onSubmitStory(promptStory.storyText);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        zIndex: 25,
      }}
    >
      {/* Story Suggestion Strips (Unobtrusive) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingInline: "4px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
          }}
        >
          Spoken memories:
        </span>
        {DEMO_PROMPT_STORIES.map((item) => (
          <button
            key={item.id}
            onClick={() => handleChipClick(item)}
            style={{
              fontSize: "0.76rem",
              padding: "3px 10px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "rgba(255, 253, 249, 0.88)",
              border: "1px solid var(--border-warm)",
              color: "var(--text-secondary)",
              whiteSpace: "nowrap",
              boxShadow: "0 1px 3px rgba(31, 28, 24, 0.04)",
              transition: "all var(--duration-fast)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-warm)";
              e.currentTarget.style.backgroundColor = "var(--bg-surface)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-warm)";
              e.currentTarget.style.backgroundColor = "rgba(255, 253, 249, 0.88)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            “{item.storyText}”
          </button>
        ))}
      </div>

      {/* Archival Paper Story Strip */}
      <div
        className="photo-card-frame"
        style={{
          borderRadius: "var(--radius-lg)",
          backgroundColor: "var(--bg-archival-note)",
          border: "1.5px solid var(--border-warm)",
          boxShadow: "var(--shadow-lg)",
          padding: "10px 14px 10px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {/* Wabi-Sabi Tape Strip */}
        <div className="tape-strip" style={{ width: "36px", height: "12px", top: "-6px" }} />

        {/* Note Prompt Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} color="var(--accent-warm)" />
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.78rem",
              fontWeight: 600,
              fontStyle: "italic",
              color: "var(--accent-warm)",
              letterSpacing: "0.02em",
            }}
          >
            Tell KIN something you remember about your family...
          </span>
        </div>

        {/* Input & Action */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <input
            id="kin-story-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. My grandfather Joseph had two brothers, Mathew and Thomas..."
            aria-label="Family memory or story"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontFamily: "var(--font-serif)",
              fontSize: "0.96rem",
              color: "var(--text-primary)",
            }}
          />

          <button
            type="submit"
            disabled={!input.trim()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: input.trim() ? "var(--accent-warm)" : "var(--bg-canvas-subtle)",
              color: input.trim() ? "var(--text-inverted)" : "var(--text-muted)",
              fontSize: "0.82rem",
              fontWeight: 600,
              boxShadow: input.trim() ? "var(--shadow-sm)" : "none",
              transition: "all var(--duration-fast)",
              cursor: input.trim() ? "pointer" : "default",
            }}
          >
            <span>Tell KIN</span>
            <ArrowRight size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}
