export interface ExtractionCandidate {
  primaryName: string;
  primaryRole: string;
  relatives: { name: string; relation: string }[];
  peopleCount: number;
  connectionCount: number;
  explanation: string;
}

export interface DemoPromptStory {
  id: string;
  label: string;
  storyText: string;
  candidate: ExtractionCandidate;
}

export const DEMO_PROMPT_STORIES: DemoPromptStory[] = [
  {
    id: "joseph-brothers",
    label: "Grandpa Joseph's brothers",
    storyText: "My grandfather Joseph had two brothers, Mathew and Thomas.",
    candidate: {
      primaryName: "Joseph Davis",
      primaryRole: "Grandpa / Great Uncle",
      relatives: [
        { name: "Mathew Davis", relation: "Brother" },
        { name: "Thomas Davis", relation: "Brother" },
      ],
      peopleCount: 3,
      connectionCount: 2,
      explanation: "Extracted 3 people and 2 sibling relationships from story.",
    },
  },
  {
    id: "clara-julian-meeting",
    label: "Clara & Julian meeting",
    storyText: "Clara and Julian met in the botanical library in autumn 1991.",
    candidate: {
      primaryName: "Julian Davis & Clara Vance",
      primaryRole: "Parents",
      relatives: [
        { name: "Clara Vance", relation: "Spouse (since 1991)" },
      ],
      peopleCount: 2,
      connectionCount: 1,
      explanation: "Identified existing couple and staged memory annotation.",
    },
  },
  {
    id: "uncle-lighthouse",
    label: "Uncle Thomas in Inverness",
    storyText: "Uncle Thomas lives near the coast and makes pocket watches.",
    candidate: {
      primaryName: "Thomas Davis",
      primaryRole: "Great Uncle",
      relatives: [
        { name: "Arthur Davis", relation: "Brother" },
      ],
      peopleCount: 1,
      connectionCount: 1,
      explanation: "Identified biographical memory for watchmaker Uncle Thomas.",
    },
  },
];
