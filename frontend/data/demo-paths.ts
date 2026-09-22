export interface DiscoveryPath {
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  resultTitle: string;
  humanExplanation: string;
  steps: { fromId: string; toId: string; label: string }[];
  highlightNodeIds: string[];
  highlightEdgeIds: string[];
}

export const DEMO_DISCOVERY_PATHS: Record<string, DiscoveryPath> = {
  "nora-arthur": {
    sourceId: "nora",
    sourceName: "Nora Davis",
    targetId: "arthur",
    targetName: "Arthur Davis",
    resultTitle: "Grandfather",
    humanExplanation: "Arthur is Nora's grandfather.",
    steps: [
      { fromId: "nora", toId: "julian", label: "Nora is Julian's daughter" },
      { fromId: "julian", toId: "arthur", label: "Julian is Arthur's son" },
    ],
    highlightNodeIds: ["nora", "julian", "arthur"],
    highlightEdgeIds: ["julian-nora", "arthur-julian"],
  },
  "nora-eleanor": {
    sourceId: "nora",
    sourceName: "Nora Davis",
    targetId: "eleanor",
    targetName: "Eleanor Vance",
    resultTitle: "Grandmother",
    humanExplanation: "Eleanor is Nora's grandmother.",
    steps: [
      { fromId: "nora", toId: "julian", label: "Nora is Julian's daughter" },
      { fromId: "julian", toId: "eleanor", label: "Julian is Eleanor's son" },
    ],
    highlightNodeIds: ["nora", "julian", "eleanor"],
    highlightEdgeIds: ["julian-nora", "eleanor-julian"],
  },
  "maya-arthur": {
    sourceId: "maya",
    sourceName: "Maya Davis",
    targetId: "arthur",
    targetName: "Arthur Davis",
    resultTitle: "Grandfather",
    humanExplanation: "Arthur is Maya's grandfather.",
    steps: [
      { fromId: "maya", toId: "julian", label: "Maya is Julian's daughter" },
      { fromId: "julian", toId: "arthur", label: "Julian is Arthur's son" },
    ],
    highlightNodeIds: ["maya", "julian", "arthur"],
    highlightEdgeIds: ["julian-maya", "arthur-julian"],
  },
};

export function findDemoPath(fromId: string, toId: string): DiscoveryPath | null {
  const match = Object.values(DEMO_DISCOVERY_PATHS).find(
    (path) =>
      (path.sourceId === fromId && path.targetId === toId) ||
      (path.sourceId === toId && path.targetId === fromId)
  );
  return match ?? null;
}
