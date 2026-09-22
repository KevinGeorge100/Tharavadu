export interface DiscoveryPath {
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
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
    humanExplanation: "Arthur Davis is Nora's grandfather (via her father Julian Davis).",
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
    humanExplanation: "Eleanor Vance is Nora's grandmother (via her father Julian Davis).",
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
    humanExplanation: "Arthur Davis is Maya's grandfather (via her father Julian Davis).",
    steps: [
      { fromId: "maya", toId: "julian", label: "Maya is Julian's daughter" },
      { fromId: "julian", toId: "arthur", label: "Julian is Arthur's son" },
    ],
    highlightNodeIds: ["maya", "julian", "arthur"],
    highlightEdgeIds: ["julian-maya", "arthur-julian"],
  },
};
