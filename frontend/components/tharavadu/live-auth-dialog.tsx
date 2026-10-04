"use client";

import React, { useState } from "react";
import { login, register } from "@/lib/api/auth";
import { ApiError, User } from "@/lib/api/types";

interface LiveAuthDialogProps {
  onSuccess: (user: User) => void;
  onDismiss?: () => void;
}

export function LiveAuthDialog({ onSuccess, onDismiss }: LiveAuthDialogProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    if (password.length < 10) {
      setError("Password must be at least 10 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user =
        tab === "login"
          ? await login({ email: email.trim(), password })
          : await register({ email: email.trim(), password });
      onSuccess(user);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-labelledby="auth-dialog-title"
      style={{
        width: "100%",
        maxWidth: "440px",
        background: "var(--cream-hot)",
        border: "var(--outline-heavy) solid var(--ink)",
        boxShadow: "var(--shadow-raised)",
        padding: "20px 20px 18px",
        transform: "rotate(-0.4deg)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <p id="auth-dialog-title" className="kin-stamp" style={{ fontSize: "1.05rem", color: "var(--ink)" }}>
            {tab === "login" ? "Sign in to Tharavadu" : "Create your account"}
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.85rem",
              marginTop: 4,
              color: "var(--text-secondary)",
            }}
          >
            {tab === "login"
              ? "Connect to your live family records and graph."
              : "Start your personal family discovery workspace."}
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

      <div style={{ display: "flex", gap: 6, marginTop: 14, marginBottom: 14 }}>
        <button
          type="button"
          className={tab === "login" ? "kin-press" : "kin-press-ghost"}
          onClick={() => {
            setTab("login");
            setError(null);
          }}
          style={{ flex: 1, minHeight: 38, fontSize: "0.72rem", padding: "6px 10px" }}
        >
          Sign in
        </button>
        <button
          type="button"
          className={tab === "register" ? "kin-press" : "kin-press-ghost"}
          onClick={() => {
            setTab("register");
            setError(null);
          }}
          style={{ flex: 1, minHeight: 38, fontSize: "0.72rem", padding: "6px 10px" }}
        >
          Create account
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
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

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label
            htmlFor="auth-email"
            className="kin-stamp"
            style={{ display: "block", fontSize: "0.68rem", marginBottom: 4 }}
          >
            Email address
          </label>
          <input
            id="auth-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
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
            htmlFor="auth-password"
            className="kin-stamp"
            style={{ display: "block", fontSize: "0.68rem", marginBottom: 4 }}
          >
            Password (min 10 characters)
          </label>
          <input
            id="auth-password"
            type="password"
            required
            minLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
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

        <button
          type="submit"
          disabled={loading || !email.trim() || password.length < 10}
          className="kin-press"
          style={{ minHeight: 44, padding: "10px 14px", marginTop: 4 }}
        >
          {loading ? "Processing..." : tab === "login" ? "Sign in →" : "Create account →"}
        </button>
      </form>
    </div>
  );
}
