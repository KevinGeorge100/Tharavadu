export interface FamilyMember {
  id: string;
  name: string;
  relationLabel: string;
  isUserAnchor?: boolean;
  birthYear?: number;
  deathYear?: number;
  generation: 1 | 2 | 3;
  branchName: string;
  branchColor: string;
  branchSoft: string;
  branchBorder: string;
  rotationDeg: number; // Wabi-sabi subtle tilt (-1.5 to +1.5 deg)
  portraitType: "silhouette-grandpa" | "silhouette-grandma" | "silhouette-father" | "silhouette-mother" | "silhouette-nora" | "silhouette-brother" | "silhouette-sister" | "silhouette-uncle";
  quote?: string;
  memoriesCount: number;
  photosCount: number;
  archivalNotes: string[];
  directConnections: { id: string; name: string; relation: string }[];
}

export interface MemoryPin {
  id: string;
  targetPersonId: string;
  type: "photo" | "quote" | "artifact";
  title: string;
  snippet: string;
  dateStr: string;
  rotationDeg: number;
  xOffset: number;
  yOffset: number;
}

export const INITIAL_DEMO_MEMBERS: FamilyMember[] = [
  {
    id: "arthur",
    name: "Arthur Davis",
    relationLabel: "Grandfather",
    birthYear: 1942,
    deathYear: 2018,
    generation: 1,
    branchName: "Davis Branch",
    branchColor: "var(--branch-terracotta)",
    branchSoft: "var(--branch-terracotta-soft)",
    branchBorder: "var(--branch-terracotta-border)",
    rotationDeg: -1.2,
    portraitType: "silhouette-grandpa",
    quote: "A quiet botanist who pressed wild sea-lavender into every letter.",
    memoriesCount: 4,
    photosCount: 6,
    archivalNotes: [
      "Built the cedar porch bench where generations sat for evening tea.",
      "Kept a handwritten notebook of coastal bird sightings from 1965 to 2010.",
      "Served as an apprentice bookbinder in Edinburgh before emigrating.",
    ],
    directConnections: [
      { id: "eleanor", name: "Eleanor Vance", relation: "Wife" },
      { id: "julian", name: "Julian Davis", relation: "Son" },
    ],
  },
  {
    id: "eleanor",
    name: "Eleanor Vance",
    relationLabel: "Grandmother",
    birthYear: 1945,
    deathYear: 2021,
    generation: 1,
    branchName: "Vance Branch",
    branchColor: "var(--branch-rose)",
    branchSoft: "var(--branch-rose-soft)",
    branchBorder: "var(--branch-rose-border)",
    rotationDeg: 1.1,
    portraitType: "silhouette-grandma",
    quote: "She kept handwritten recipes from every place the family ever lived.",
    memoriesCount: 5,
    photosCount: 9,
    archivalNotes: [
      "Famous for her Sunday cardamom rolls and porcelain spice jars.",
      "Recorded cassette tape interviews with her aunts in 1984.",
      "Taught Nora how to press garden flowers between telephone directory pages.",
    ],
    directConnections: [
      { id: "arthur", name: "Arthur Davis", relation: "Husband" },
      { id: "julian", name: "Julian Davis", relation: "Son" },
    ],
  },
  {
    id: "julian",
    name: "Julian Davis",
    relationLabel: "Father",
    birthYear: 1968,
    generation: 2,
    branchName: "Davis Branch",
    branchColor: "var(--branch-sage)",
    branchSoft: "var(--branch-sage-soft)",
    branchBorder: "var(--branch-sage-border)",
    rotationDeg: -0.8,
    portraitType: "silhouette-father",
    quote: "Restores antique clocks and never throws away a brass screw.",
    memoriesCount: 3,
    photosCount: 8,
    archivalNotes: [
      "Met Clara at the university botanical library in autumn 1991.",
      "Restored grandfather Arthur's cedar worktable in 2014.",
    ],
    directConnections: [
      { id: "arthur", name: "Arthur Davis", relation: "Father" },
      { id: "eleanor", name: "Eleanor Vance", relation: "Mother" },
      { id: "clara", name: "Clara Vance", relation: "Wife" },
      { id: "nora", name: "Nora Davis", relation: "Daughter" },
      { id: "leo", name: "Leo Davis", relation: "Son" },
      { id: "maya", name: "Maya Davis", relation: "Daughter" },
    ],
  },
  {
    id: "clara",
    name: "Clara Vance",
    relationLabel: "Mother",
    birthYear: 1970,
    generation: 2,
    branchName: "Vance Branch",
    branchColor: "var(--branch-blue)",
    branchSoft: "var(--branch-blue-soft)",
    branchBorder: "var(--branch-blue-border)",
    rotationDeg: 0.9,
    portraitType: "silhouette-mother",
    quote: "Architect and archivist of our family photographs and correspondence.",
    memoriesCount: 4,
    photosCount: 14,
    archivalNotes: [
      "Organized 12 archival binders of family negatives and letters.",
      "Designed the home where Nora and her siblings grew up.",
    ],
    directConnections: [
      { id: "julian", name: "Julian Davis", relation: "Husband" },
      { id: "nora", name: "Nora Davis", relation: "Daughter" },
      { id: "leo", name: "Leo Davis", relation: "Son" },
      { id: "maya", name: "Maya Davis", relation: "Daughter" },
    ],
  },
  {
    id: "nora",
    name: "Nora Davis",
    relationLabel: "You · Storyteller",
    isUserAnchor: true,
    birthYear: 1996,
    generation: 3,
    branchName: "Next Generation",
    branchColor: "var(--accent-warm)",
    branchSoft: "var(--accent-warm-soft)",
    branchBorder: "var(--accent-warm-border)",
    rotationDeg: -0.5,
    portraitType: "silhouette-nora",
    quote: "Gathering spoken memories, tape recordings, and letters into Tharavadu's living album.",
    memoriesCount: 6,
    photosCount: 11,
    archivalNotes: [
      "Digitized Eleanor's cassette interviews in summer 2023.",
      "Initiated Tharavadu's local family memory vault.",
    ],
    directConnections: [
      { id: "julian", name: "Julian Davis", relation: "Father" },
      { id: "clara", name: "Clara Vance", relation: "Mother" },
      { id: "leo", name: "Leo Davis", relation: "Brother" },
      { id: "maya", name: "Maya Davis", relation: "Sister" },
    ],
  },
  {
    id: "leo",
    name: "Leo Davis",
    relationLabel: "Brother",
    birthYear: 1999,
    generation: 3,
    branchName: "Next Generation",
    branchColor: "var(--branch-violet)",
    branchSoft: "var(--branch-violet-soft)",
    branchBorder: "var(--branch-violet-border)",
    rotationDeg: 1.2,
    portraitType: "silhouette-brother",
    quote: "Landscape photographer who retraces ancestors' migration paths.",
    memoriesCount: 2,
    photosCount: 18,
    archivalNotes: [
      "Photographed Arthur's hometown in Scotland during his 2021 travels.",
    ],
    directConnections: [
      { id: "julian", name: "Julian Davis", relation: "Father" },
      { id: "clara", name: "Clara Vance", relation: "Mother" },
      { id: "nora", name: "Nora Davis", relation: "Sister" },
      { id: "maya", name: "Maya Davis", relation: "Sister" },
    ],
  },
  {
    id: "maya",
    name: "Maya Davis",
    relationLabel: "Sister",
    birthYear: 2003,
    generation: 3,
    branchName: "Next Generation",
    branchColor: "var(--branch-mustard)",
    branchSoft: "var(--branch-mustard-soft)",
    branchBorder: "var(--branch-mustard-border)",
    rotationDeg: -1.0,
    portraitType: "silhouette-sister",
    quote: "Botanical illustrator continuing Arthur's tradition of pressed flowers.",
    memoriesCount: 3,
    photosCount: 7,
    archivalNotes: [
      "Illustrated the cover of the family recipe collection for Eleanor's 75th.",
    ],
    directConnections: [
      { id: "julian", name: "Julian Davis", relation: "Father" },
      { id: "clara", name: "Clara Vance", relation: "Mother" },
      { id: "nora", name: "Nora Davis", relation: "Sister" },
      { id: "leo", name: "Leo Davis", relation: "Brother" },
    ],
  },
];

// Candidates that materialize when the demo story "Joseph had two brothers..." is accepted
export const DEMO_EXTRACTION_BRANCH: FamilyMember[] = [
  {
    id: "joseph",
    name: "Joseph Davis",
    relationLabel: "Great Uncle",
    birthYear: 1940,
    deathYear: 2009,
    generation: 1,
    branchName: "Davis Branch",
    branchColor: "var(--branch-terracotta)",
    branchSoft: "var(--branch-terracotta-soft)",
    branchBorder: "var(--branch-terracotta-border)",
    rotationDeg: 1.3,
    portraitType: "silhouette-uncle",
    quote: "Older brother to Arthur. Ran a coastal boatyard for thirty years.",
    memoriesCount: 2,
    photosCount: 4,
    archivalNotes: [
      "Grew up near the coast and sent postcards every Christmas.",
    ],
    directConnections: [
      { id: "mathew", name: "Mathew Davis", relation: "Brother" },
      { id: "thomas", name: "Thomas Davis", relation: "Brother" },
      { id: "arthur", name: "Arthur Davis", relation: "Brother" },
    ],
  },
  {
    id: "mathew",
    name: "Mathew Davis",
    relationLabel: "Great Uncle",
    birthYear: 1944,
    deathYear: 2015,
    generation: 1,
    branchName: "Davis Branch",
    branchColor: "var(--branch-terracotta)",
    branchSoft: "var(--branch-terracotta-soft)",
    branchBorder: "var(--branch-terracotta-border)",
    rotationDeg: -0.9,
    portraitType: "silhouette-uncle",
    quote: "Middle brother who emigrated to Melbourne in 1969.",
    memoriesCount: 1,
    photosCount: 3,
    archivalNotes: [
      "Amateur radio operator who talked to Arthur across the oceans every Sunday.",
    ],
    directConnections: [
      { id: "joseph", name: "Joseph Davis", relation: "Brother" },
      { id: "thomas", name: "Thomas Davis", relation: "Brother" },
      { id: "arthur", name: "Arthur Davis", relation: "Brother" },
    ],
  },
  {
    id: "thomas",
    name: "Thomas Davis",
    relationLabel: "Great Uncle",
    birthYear: 1947,
    generation: 1,
    branchName: "Davis Branch",
    branchColor: "var(--branch-terracotta)",
    branchSoft: "var(--branch-terracotta-soft)",
    branchBorder: "var(--branch-terracotta-border)",
    rotationDeg: 0.7,
    portraitType: "silhouette-uncle",
    quote: "Youngest brother, master watchmaker still living in Inverness.",
    memoriesCount: 2,
    photosCount: 5,
    archivalNotes: [
      "Crafted Nora's pocket watch for her graduation.",
    ],
    directConnections: [
      { id: "joseph", name: "Joseph Davis", relation: "Brother" },
      { id: "mathew", name: "Mathew Davis", relation: "Brother" },
      { id: "arthur", name: "Arthur Davis", relation: "Brother" },
    ],
  },
];

// Fictional Memory Artifacts pinned across the family
export const DEMO_MEMORIES: MemoryPin[] = [
  {
    id: "mem-eleanor-tea",
    targetPersonId: "eleanor",
    type: "quote",
    title: "Memory note",
    snippet: "Tea at four. Every single day.",
    dateStr: "2011",
    rotationDeg: -2.2,
    xOffset: 178,
    yOffset: 18,
  },
  {
    id: "mem-eleanor-place",
    targetPersonId: "eleanor",
    type: "artifact",
    title: "Place",
    snippet: "Kochi · 1984",
    dateStr: "1984",
    rotationDeg: 1.6,
    xOffset: 40,
    yOffset: -78,
  },
  {
    id: "mem-arthur-photo",
    targetPersonId: "arthur",
    type: "photo",
    title: "Photo · 1972",
    snippet: "Sea-lavender pressed into a pocket notebook.",
    dateStr: "1972",
    rotationDeg: 1.8,
    xOffset: -148,
    yOffset: 22,
  },
  {
    id: "mem-arthur-story",
    targetPersonId: "arthur",
    type: "quote",
    title: "Story",
    snippet: "He never mailed a letter without a pressed flower.",
    dateStr: "1998",
    rotationDeg: -1.4,
    xOffset: 40,
    yOffset: -78,
  },
  {
    id: "mem-nora-tapes",
    targetPersonId: "nora",
    type: "artifact",
    title: "Cassette #3",
    snippet: "Eleanor on the living-room sofa, talking about tea.",
    dateStr: "2019",
    rotationDeg: -1.5,
    xOffset: 178,
    yOffset: 40,
  },
  {
    id: "mem-nora-photo",
    targetPersonId: "nora",
    type: "photo",
    title: "Photo · 2004",
    snippet: "Porch bench. Three cousins. One sticky summer.",
    dateStr: "2004",
    rotationDeg: 2.1,
    xOffset: -40,
    yOffset: -78,
  },
  {
    id: "mem-julian-note",
    targetPersonId: "julian",
    type: "quote",
    title: "Memory note",
    snippet: "Never throws away a brass screw.",
    dateStr: "2014",
    rotationDeg: -1.8,
    xOffset: -148,
    yOffset: 28,
  },
  {
    id: "mem-clara-place",
    targetPersonId: "clara",
    type: "artifact",
    title: "Place",
    snippet: "Botanical library · autumn 1991",
    dateStr: "1991",
    rotationDeg: 1.2,
    xOffset: 178,
    yOffset: 20,
  },
];
