import dagre from "@dagrejs/dagre";
import { FamilyMember } from "@/data/demo-family";
import { BackendEdge, BackendGraph, BackendPerson } from "./types";

const BRANCH_PALETTES = [
  {
    color: "var(--branch-terracotta)",
    soft: "var(--branch-terracotta-soft)",
    border: "var(--branch-terracotta-border)",
  },
  {
    color: "var(--branch-sage)",
    soft: "var(--branch-sage-soft)",
    border: "var(--branch-sage-border)",
  },
  {
    color: "var(--branch-blue)",
    soft: "var(--branch-blue-soft)",
    border: "var(--branch-blue-border)",
  },
  {
    color: "var(--branch-mustard)",
    soft: "var(--branch-mustard-soft)",
    border: "var(--branch-mustard-border)",
  },
  {
    color: "var(--branch-rose)",
    soft: "var(--branch-rose-soft)",
    border: "var(--branch-rose-border)",
  },
  {
    color: "var(--branch-violet)",
    soft: "var(--branch-violet-soft)",
    border: "var(--branch-violet-border)",
  },
];

type CanvasEdgeType = "parent" | "spouse" | "sibling";

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  type: CanvasEdgeType;
}

export function computeGraphPositions(
  people: BackendPerson[],
  edges: BackendEdge[]
): Record<string, { x: number; y: number }> {
  if (people.length === 0) return {};
  if (people.length === 1) {
    return { [people[0].id]: { x: 80, y: 120 } };
  }

  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 120 });
  g.setDefaultEdgeLabel(() => ({}));

  people.forEach((p) => {
    g.setNode(p.id, { width: 220, height: 260 });
  });

  edges.forEach((e) => {
    if (e.type === "PARENT_OF") {
      g.setEdge(e.source, e.target);
    } else if (e.type === "SPOUSE_OF") {
      g.setEdge(e.source, e.target, { weight: 2 });
    } else if (e.type === "SIBLING_OF") {
      g.setEdge(e.source, e.target, { weight: 1 });
    }
  });

  dagre.layout(g);

  const positions: Record<string, { x: number; y: number }> = {};
  people.forEach((p) => {
    const node = g.node(p.id);
    if (node) {
      positions[p.id] = {
        x: Math.round(node.x - 110),
        y: Math.round(node.y - 130),
      };
    } else {
      positions[p.id] = { x: 0, y: 0 };
    }
  });

  return positions;
}

function computeGenerations(
  people: BackendPerson[],
  edges: BackendEdge[]
): Map<string, 1 | 2 | 3> {
  const parentMap = new Map<string, string[]>();
  people.forEach((p) => parentMap.set(p.id, []));

  edges.forEach((e) => {
    if (e.type === "PARENT_OF") {
      const current = parentMap.get(e.target) || [];
      current.push(e.source);
      parentMap.set(e.target, current);
    }
  });

  const genMap = new Map<string, number>();

  function getDepth(personId: string, visited = new Set<string>()): number {
    if (visited.has(personId)) return 1;
    visited.add(personId);
    if (genMap.has(personId)) return genMap.get(personId)!;
    const parents = parentMap.get(personId) || [];
    if (parents.length === 0) {
      genMap.set(personId, 1);
      return 1;
    }
    const maxParent = Math.max(...parents.map((p) => getDepth(p, new Set(visited))));
    const d = maxParent + 1;
    genMap.set(personId, d);
    return d;
  }

  people.forEach((p) => getDepth(p.id));

  const result = new Map<string, 1 | 2 | 3>();
  people.forEach((p) => {
    const d = genMap.get(p.id) || 1;
    const clamped = Math.min(Math.max(d, 1), 3) as 1 | 2 | 3;
    result.set(p.id, clamped);
  });

  return result;
}

export function backendGraphToCanvas(
  graph: BackendGraph,
  selfId?: string
): {
  members: FamilyMember[];
  edges: CanvasEdge[];
  positions: Record<string, { x: number; y: number }>;
} {
  const peopleById = new Map(graph.people.map((p) => [p.id, p]));
  const generations = computeGenerations(graph.people, graph.edges);
  const positions = computeGraphPositions(graph.people, graph.edges);

  const canvasEdges: CanvasEdge[] = graph.edges.map((e) => ({
    id: `${e.source}-${e.target}-${e.type}`,
    source: e.source,
    target: e.target,
    type: e.type === "PARENT_OF" ? "parent" : e.type === "SPOUSE_OF" ? "spouse" : "sibling",
  }));

  const members: FamilyMember[] = graph.people.map((person, index) => {
    const isAnchor = person.id === selfId;
    const gen = generations.get(person.id) || 1;
    const palette = BRANCH_PALETTES[index % BRANCH_PALETTES.length];

    // Determine relation label
    let relationLabel = "Family member";
    if (isAnchor) {
      relationLabel = "You";
    } else if (selfId) {
      const direct = graph.edges.find(
        (e) =>
          (e.source === selfId && e.target === person.id) ||
          (e.target === selfId && e.source === person.id)
      );
      if (direct) {
        if (direct.type === "PARENT_OF") {
          if (direct.source === person.id) {
            relationLabel =
              person.gender === "female" ? "Mother" : person.gender === "male" ? "Father" : "Parent";
          } else {
            relationLabel =
              person.gender === "female" ? "Daughter" : person.gender === "male" ? "Son" : "Child";
          }
        } else if (direct.type === "SPOUSE_OF") {
          relationLabel =
            person.gender === "female" ? "Wife" : person.gender === "male" ? "Husband" : "Spouse";
        } else if (direct.type === "SIBLING_OF") {
          relationLabel =
            person.gender === "female" ? "Sister" : person.gender === "male" ? "Brother" : "Sibling";
        }
      }
    }

    // Direct connections
    const directConnections: { id: string; name: string; relation: string }[] = [];
    graph.edges.forEach((e) => {
      if (e.source === person.id) {
        const other = peopleById.get(e.target);
        if (other) {
          const rel = e.type === "PARENT_OF" ? "Child" : e.type === "SPOUSE_OF" ? "Spouse" : "Sibling";
          directConnections.push({ id: other.id, name: other.name, relation: rel });
        }
      } else if (e.target === person.id) {
        const other = peopleById.get(e.source);
        if (other) {
          const rel = e.type === "PARENT_OF" ? "Parent" : e.type === "SPOUSE_OF" ? "Spouse" : "Sibling";
          directConnections.push({ id: other.id, name: other.name, relation: rel });
        }
      }
    });

    const birthYear = person.birth_date ? parseInt(person.birth_date.slice(0, 4), 10) : undefined;
    const deathYear = person.death_date ? parseInt(person.death_date.slice(0, 4), 10) : undefined;

    // Portrait
    let portraitType: FamilyMember["portraitType"] = "silhouette-father";
    if (gen === 1) {
      portraitType = person.gender === "female" ? "silhouette-grandma" : "silhouette-grandpa";
    } else if (gen === 2) {
      portraitType = person.gender === "female" ? "silhouette-mother" : "silhouette-father";
    } else {
      portraitType =
        person.gender === "female"
          ? "silhouette-sister"
          : person.gender === "male"
            ? "silhouette-brother"
            : "silhouette-nora";
    }

    const tilts = [-1.2, -0.6, 0.4, 0.9, -0.8, 1.1];
    const rotationDeg = tilts[index % tilts.length];

    return {
      id: person.id,
      name: person.name,
      relationLabel,
      isUserAnchor: isAnchor,
      birthYear: birthYear !== undefined && Number.isFinite(birthYear) ? birthYear : undefined,
      deathYear: deathYear && !isNaN(deathYear) ? deathYear : undefined,
      generation: gen,
      branchName: `${person.name}'s Branch`,
      branchColor: palette.color,
      branchSoft: palette.soft,
      branchBorder: palette.border,
      rotationDeg,
      portraitType,
      quote: person.notes ? person.notes.split("\n")[0] : undefined,
      memoriesCount: 0,
      photosCount: 0,
      archivalNotes: person.notes ? [person.notes] : [],
      directConnections,
    };
  });

  return {
    members,
    edges: canvasEdges,
    positions,
  };
}
