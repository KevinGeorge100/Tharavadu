"use client";

import React, { useState } from "react";
import { createFamily } from "@/lib/api/families";
import { ApiError, Family } from "@/lib/api/types";

interface LiveFamilyDialogProps {
  onCreated: (family: Family) => void;
  onDismiss?: () => void;
}

export function LiveFamilyDialog({ onCreated, onDismiss }: LiveFamilyDialogProps) {
  const [name, setName] = useState("My Family Tharavadu");
  const [personName, setPersonName] = useState("Kevin");
  const [demo, setDemo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !personName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const family = await createFamily({
        name: name.trim(),
        person_name: personName.trim(),
        demo,
      });
      onCreated(family);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create family. Please check inputs and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-labelledby="family-dialog-title"
      style={{
        width: "100%",
        maxWidth: "460px",
        background: "var(--cream-hot)",
        border: "var(--outline-heavy) solid var(--ink)",
        boxShadow: "var(--shadow-raised)",
        padding: "20px 20px 18px",
        transform: "rotate(-0.4deg)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <p id="family-dialog-title" className="kin-stamp" style={{ fontSize: "1.05rem", color: "var(--ink)" }}>
            Create a Family
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.85rem",
              marginTop: 4,
              color: "var(--text-secondary)",
            }}
          >
            Start an immutable, cycle-free kinship graph for your family lineage.
          </p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close"
            className="kin-press-ghost"
            style={{ width: 44, height: 44 }}
          >
            ×
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          style={{
            marginTop: 12,
            marginBottom: 12,
            padding: "8px 12px",
            background: "var(--branch-rose-soft)",
            border: "var(--outline-thin) solid var(--branch-rose-border)",
            color: "var(--branch-rose)",
            fontSize: "0.78rem",
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
        <div>
          <label
            htmlFor="family-name"
            className="kin-stamp"
            style={{ display: "block", fontSize: "0.68rem", marginBottom: 4 }}
          >
            Family / Tharavadu name
          </label>
          <input
            id="family-name"
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Davis Family"
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px 10px",
              minHeight: 44,
              background: "var(--paper)",
              border: "var(--outline-medium) solid var(--ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              color: "var(--ink)",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="self-name"
            className="kin-stamp"
            style={{ display: "block", fontSize: "0.68rem", marginBottom: 4 }}
          >
            Your name (root anchor)
          </label>
          <input
            id="self-name"
            type="text"
            required
            maxLength={120}
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="e.g. Kevin"
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px 10px",
              minHeight: 44,
              background: "var(--paper)",
              border: "var(--outline-medium) solid var(--ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.9rem",
              color: "var(--ink)",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
          <input
            id="seed-demo"
            type="checkbox"
            checked={demo}
            onChange={(e) => setDemo(e.target.checked)}
            disabled={loading}
            style={{ width: 18, height: 18, accentColor: "var(--accent-warm)" }}
          />
          <label
            htmlFor="seed-demo"
            style={{
              fontSize: "0.78rem",
              fontFamily: "var(--font-sans)",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            Seed with 8-member demo family graph (parents, uncles, cousins)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim() || !personName.trim()}
          className="kin-press"
          style={{ minHeight: 44, padding: "10px 14px", marginTop: 6 }}
        >
          {loading ? "Creating..." : "Create family →"}
        </button>
      </form>
    </div>
  );
}
