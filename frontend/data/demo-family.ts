export interface DemoConnection {
  id: string;
  name: string;
  relation: string;
  type: "parent" | "child" | "spouse" | "sibling";
}

export interface DemoPerson {
  id: string;
  name: string;
  relation: string;
  generation: string;
  initials: string;
  branchColor: string;
  branchSoft: string;
  branchBorder: string;
  story: string;
  connections: DemoConnection[];
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
}

export interface DemoEdge {
  from: string;
  to: string;
  type: "parent" | "spouse" | "sibling";
  label?: string;
}

export const DEMO_PEOPLE: DemoPerson[] = [
  {
    id: "arthur",
    name: "Arthur",
    relation: "Grandfather",
    generation: "b. 1934",
    initials: "A",
    branchColor: "var(--branch-peach)",
    branchSoft: "var(--branch-peach-soft)",
    branchBorder: "var(--branch-peach-border)",
    story: "Taught the grandchildren to press wild apple cider every October and kept four decades of harvest notes in his pocket journals.",
    connections: [
      { id: "eleanor", name: "Eleanor", relation: "Spouse", type: "spouse" },
      { id: "julian", name: "Julian", relation: "Son", type: "child" },
    ],
    x: 28,
    y: 18,
  },
  {
    id: "eleanor",
    name: "Eleanor",
    relation: "Grandmother",
    generation: "b. 1938",
    initials: "E",
    branchColor: "var(--branch-rose)",
    branchSoft: "var(--branch-rose-soft)",
    branchBorder: "var(--branch-rose-border)",
    story: "Field botanist who pressed wildflowers between encyclopedia pages and sent hand-written postcards to relatives across three continents.",
    connections: [
      { id: "arthur", name: "Arthur", relation: "Spouse", type: "spouse" },
      { id: "julian", name: "Julian", relation: "Son", type: "child" },
    ],
    x: 72,
    y: 18,
  },
  {
    id: "julian",
    name: "Julian",
    relation: "Father",
    generation: "b. 1963",
    initials: "J",
    branchColor: "var(--branch-sage)",
    branchSoft: "var(--branch-sage-soft)",
    branchBorder: "var(--branch-sage-border)",
    story: "Woodworker who built custom reading desks for his kids and spent Saturday mornings tuning his antique cello by the hearth.",
    connections: [
      { id: "arthur", name: "Arthur", relation: "Father", type: "parent" },
      { id: "eleanor", name: "Eleanor", relation: "Mother", type: "parent" },
      { id: "clara", name: "Clara", relation: "Spouse", type: "spouse" },
      { id: "nora", name: "Nora", relation: "Daughter", type: "child" },
      { id: "leo", name: "Leo", relation: "Son", type: "child" },
      { id: "maya", name: "Maya", relation: "Daughter", type: "child" },
    ],
    x: 32,
    y: 50,
  },
  {
    id: "clara",
    name: "Clara",
    relation: "Mother",
    generation: "b. 1966",
    initials: "C",
    branchColor: "var(--branch-blue)",
    branchSoft: "var(--branch-blue-soft)",
    branchBorder: "var(--branch-blue-border)",
    story: "Community archivist and choir singer who knew hundred-year-old regional folk melodies by heart and baked cardamom rolls every Sunday.",
    connections: [
      { id: "julian", name: "Julian", relation: "Spouse", type: "spouse" },
      { id: "nora", name: "Nora", relation: "Daughter", type: "child" },
      { id: "leo", name: "Leo", relation: "Son", type: "child" },
      { id: "maya", name: "Maya", relation: "Daughter", type: "child" },
    ],
    x: 68,
    y: 50,
  },
  {
    id: "nora",
    name: "Nora",
    relation: "You",
    generation: "b. 1996",
    initials: "N",
    branchColor: "var(--accent-warm)",
    branchSoft: "var(--accent-warm-soft)",
    branchBorder: "var(--accent-warm-border)",
    story: "The family storyteller. Gathering spoken memories, tape recordings, and handwritten letters into KIN's living constellation.",
    connections: [
      { id: "julian", name: "Julian", relation: "Father", type: "parent" },
      { id: "clara", name: "Clara", relation: "Mother", type: "parent" },
      { id: "leo", name: "Leo", relation: "Brother", type: "sibling" },
      { id: "maya", name: "Maya", relation: "Sister", type: "sibling" },
    ],
    x: 24,
    y: 82,
  },
  {
    id: "leo",
    name: "Leo",
    relation: "Brother",
    generation: "b. 1999",
    initials: "L",
    branchColor: "var(--branch-violet)",
    branchSoft: "var(--branch-violet-soft)",
    branchBorder: "var(--branch-violet-border)",
    story: "Sound designer digitizing the cassette tapes of grandfather Arthur's weather observations and recording ambient morning birdsong.",
    connections: [
      { id: "julian", name: "Julian", relation: "Father", type: "parent" },
      { id: "clara", name: "Clara", relation: "Mother", type: "parent" },
      { id: "nora", name: "Nora", relation: "Sister", type: "sibling" },
      { id: "maya", name: "Maya", relation: "Sister", type: "sibling" },
    ],
    x: 50,
    y: 82,
  },
  {
    id: "maya",
    name: "Maya",
    relation: "Sister",
    generation: "b. 2003",
    initials: "M",
    branchColor: "var(--branch-yellow)",
    branchSoft: "var(--branch-yellow-soft)",
    branchBorder: "var(--branch-yellow-border)",
    story: "Illustrator painting botanical storybooks inspired by grandmother Eleanor's herbarium folios and family camping journeys.",
    connections: [
      { id: "julian", name: "Julian", relation: "Father", type: "parent" },
      { id: "clara", name: "Clara", relation: "Mother", type: "parent" },
      { id: "nora", name: "Nora", relation: "Sister", type: "sibling" },
      { id: "leo", name: "Leo", relation: "Brother", type: "sibling" },
    ],
    x: 76,
    y: 82,
  },
];

export const DEMO_EDGES: DemoEdge[] = [
  { from: "arthur", to: "eleanor", type: "spouse" },
  { from: "arthur", to: "julian", type: "parent" },
  { from: "eleanor", to: "julian", type: "parent" },
  { from: "julian", to: "clara", type: "spouse" },
  { from: "julian", to: "nora", type: "parent" },
  { from: "julian", to: "leo", type: "parent" },
  { from: "julian", to: "maya", type: "parent" },
  { from: "clara", to: "nora", type: "parent" },
  { from: "clara", to: "leo", type: "parent" },
  { from: "clara", to: "maya", type: "parent" },
  { from: "nora", to: "leo", type: "sibling" },
  { from: "leo", to: "maya", type: "sibling" },
];

export const COMPOSER_SUGGESTIONS = [
  "“My mother has two brothers.”",
  "“Alex is my second cousin.”",
  "“Grandpa Joseph grew up near the coast.”",
  "“Thomas and Sara married in June 1974.”",
];
