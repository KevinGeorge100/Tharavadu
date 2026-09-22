import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { BrandMark } from "@/components/brand-mark";

export const metadata: Metadata = {
  title: "KIN — Family stories, connected",
  description: "An open-source, AI-assisted family discovery and memory graph.",
  keywords: ["genealogy", "kinship", "family history", "open source", "local-first", "graph reasoning"],
  authors: [{ name: "KIN contributors" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0f12",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Ambient Constellation Stars Background */}
        <div className="constellation-stars" aria-hidden="true" />

        {/* Global Navigation Header */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            backgroundColor: "rgba(14, 15, 18, 0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border-subtle)",
            width: "100%",
          }}
        >
          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              padding: "0.85rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo & Product Identity */}
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                textDecoration: "none",
              }}
              aria-label="KIN home"
            >
              <BrandMark size={28} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "var(--text-primary)",
                  }}
                >
                  KIN
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  family stories, connected
                </span>
              </div>
            </Link>

            {/* Open Source & Local-First Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.78rem",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-surface)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "var(--radius-full)",
                    backgroundColor: "var(--branch-sage)",
                  }}
                  aria-hidden="true"
                />
                <span>Open Source · Local-First</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Landmark */}
        <main style={{ flex: "1 0 auto", position: "relative", zIndex: 1 }}>
          {children}
        </main>

        {/* Global Footer */}
        <footer
          style={{
            position: "relative",
            zIndex: 1,
            borderTop: "1px solid var(--border-subtle)",
            backgroundColor: "rgba(14, 15, 18, 0.9)",
            padding: "2rem 1.5rem",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
          }}
        >
          <div
            style={{
              maxWidth: "1120px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                KIN — Personal Family Discovery
              </p>
              <p style={{ fontSize: "0.78rem" }}>
                AI may interpret family stories. Deterministic Python code owns kinship truth.
              </p>
            </div>

            <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.8rem" }}>
              <span>MIT Licensed</span>
              <span>·</span>
              <span>No Cloud Tracking</span>
              <span>·</span>
              <span>Private Graph Truth</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
