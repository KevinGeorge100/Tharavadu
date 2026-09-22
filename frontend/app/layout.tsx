import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KIN — Family stories, connected",
  description: "An open-source, AI-assisted family discovery and memory graph.",
  keywords: ["genealogy", "kinship", "family history", "open source", "local-first", "graph reasoning"],
  authors: [{ name: "KIN contributors" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3e6cf",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {children}
      </body>
    </html>
  );
}
