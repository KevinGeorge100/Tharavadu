"use client";

import React, { useState } from "react";
import { DEMO_PROMPT_STORIES, DemoPromptStory } from "@/data/demo-stories";

interface TharavaduComposerProps {
  initialStory?: string | null;
  onSubmitStory: (storyText: string) => void | Promise<void>;
  onSelectPromptStory?: (story: DemoPromptStory) => void;
  busy?: boolean;
  showDemoPrompts?: boolean;
  error?: string | null;
  onFocusStory?: () => void;
}

export function TharavaduComposer({
  initialStory = "",
  onSubmitStory,
  onSelectPromptStory,
  busy = false,
  showDemoPrompts = true,
  error,
  onFocusStory,
}: TharavaduComposerProps) {
  const [input, setInput] = useState(initialStory || "");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || busy) return;
    onSubmitStory(trimmed);
  };

  const handleChipClick = (promptStory: DemoPromptStory) => {
    setInput(promptStory.storyText);
    if (onSelectPromptStory) onSelectPromptStory(promptStory);
    else onSubmitStory(promptStory.storyText);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "640px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {showDemoPrompts && !input.trim() && <div role="group" aria-label="Suggested stories" style={{ display: "flex", gap: 6, overflowX: "auto", paddingInline: 2 }}>
        {DEMO_PROMPT_STORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleChipClick(item)}
            className="kin-press-ghost"
            style={{
              flexShrink: 0,
              padding: "8px 10px",
              minHeight: 44,
              fontSize: "0.65rem",
              maxWidth: 220,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>}

      <form
        onSubmit={handleSubmit}
        style={{
          position: "relative",
          background: "var(--bg-archival-note)",
          border: "var(--outline-heavy) solid var(--ink)",
          boxShadow: "var(--shadow-rest)",
          padding: "12px 12px 12px",
          transform: "rotate(-0.4deg)",
        }}
      >
        <div className="tape-strip" style={{ width: 40, height: 12, top: -7 }} />
        <p className="kin-stamp" style={{ fontSize: "0.72rem", marginBottom: 8 }}>
          Tell Tharavadu a story
        </p>
        <div className="kin-composer-entry" style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
          <label htmlFor="tharavadu-story-input" className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
            Family story
          </label>
          <textarea
            id="tharavadu-story-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => { setFocused(true); onFocusStory?.(); }}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={busy}
            maxLength={6000}
            placeholder={showDemoPrompts ? "My grandfather Joseph had two brothers called Mathew and Thomas." : "My father is Joseph."}
            rows={focused ? 3 : 1}
            style={{
              flex: 1,
              minWidth: 0,
              border: "var(--outline-thin) solid var(--ink)",
              background: "var(--cream-hot)",
              fontFamily: "var(--font-serif)",
              fontSize: "0.9rem",
              padding: "10px 10px",
              resize: "none",
              minHeight: 44,
              maxHeight: 180,
              color: "var(--ink)",
            }}
          />
          <button type="submit" disabled={!input.trim() || busy} className="kin-press" style={{ padding: "10px 14px", minWidth: 92, minHeight: 44, whiteSpace: "nowrap" }}>
            {busy ? "Listening…" : "Tell Tharavadu →"}
          </button>
        </div>
        {error && <p role="alert" style={{ marginTop: 8, color: "var(--accent-warm)", fontSize: "0.78rem", fontWeight: 700 }}>{error}</p>}
      </form>
    </div>
  );
}
