"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Node,
  Edge,
  Viewport,
} from "@xyflow/react";
import { INITIAL_DEMO_MEMBERS, DEMO_EXTRACTION_BRANCH, DEMO_MEMORIES, FamilyMember } from "@/data/demo-family";
import { CanvasEdge } from "@/lib/api/adapter";
import { DEMO_DISCOVERY_PATHS, DiscoveryPath, findDemoPath } from "@/data/demo-paths";
import { PersonNode, PersonNodeData, ZoomBand } from "@/components/family/person-node";
import { MemoryArtifactNode, MemoryNodeData } from "@/components/family/memory-artifact-node";
import { KinshipRelationshipEdge } from "@/components/family/relationship-edge";
import { PersonFocusDrawer } from "@/components/family/person-focus-drawer";
import { RelationshipPathModal } from "@/components/family/relationship-path-modal";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export interface FamilyCanvasProps {
  initialSelectedId?: string | null;
  initialDiscoveryPathKey?: string | null;
  isNewBranchAdded?: boolean;
  onSelectPerson?: (id: string | null) => void;
  customMembers?: FamilyMember[];
  customEdges?: CanvasEdge[];
  customPositions?: Record<string, { x: number; y: number }>;
  bloomPersonIds?: string[];
  bloomToken?: number;
}

const nodeTypes = {
  personNode: PersonNode,
  memoryNode: MemoryArtifactNode,
};

const edgeTypes = {
  kinshipEdge: KinshipRelationshipEdge,
};

const EMPTY_BLOOM_IDS: string[] = [];

const POSITIONS: Record<string, { x: number; y: number }> = {
  arthur: { x: 40, y: 16 },
  eleanor: { x: 360, y: 8 },
  julian: { x: 80, y: 268 },
  clara: { x: 340, y: 276 },
  nora: { x: 0, y: 520 },
  leo: { x: 220, y: 508 },
  maya: { x: 440, y: 528 },
  joseph: { x: -280, y: 16 },
  mathew: { x: -500, y: 36 },
  thomas: { x: -720, y: 16 },
};

function zoomToBand(zoom: number): ZoomBand {
  if (zoom < 0.68) return "far";
  if (zoom > 1.12) return "close";
  return "medium";
}

function FamilyCanvasInner({
  initialSelectedId = null,
  initialDiscoveryPathKey = null,
  isNewBranchAdded = false,
  onSelectPerson: propOnSelectPerson,
  customMembers,
  customEdges,
  customPositions,
  bloomPersonIds = EMPTY_BLOOM_IDS,
  bloomToken = 0,
}: FamilyCanvasProps) {
  const { fitView, zoomIn, zoomOut, setCenter, getNode } = useReactFlow();

  const [internalSelectedPersonId, setInternalSelectedPersonId] = useState<string | null>(initialSelectedId);
  const selectedPersonId = initialSelectedId !== undefined ? initialSelectedId : internalSelectedPersonId;

  const [internalDiscoveryPath, setInternalDiscoveryPath] = useState<DiscoveryPath | null>(() =>
    initialDiscoveryPathKey ? DEMO_DISCOVERY_PATHS[initialDiscoveryPathKey] || null : null
  );
  const activeDiscoveryPath = initialDiscoveryPathKey
    ? DEMO_DISCOVERY_PATHS[initialDiscoveryPathKey] || null
    : internalDiscoveryPath;

  const [internalBranchAdded] = useState(isNewBranchAdded);
  const branchAdded = isNewBranchAdded || internalBranchAdded;
  const [bloomLabel, setBloomLabel] = useState<string | null>(isNewBranchAdded ? "New branch 🌿" : null);
  const [isGrowing, setIsGrowing] = useState(isNewBranchAdded);
  const [zoomBand, setZoomBand] = useState<ZoomBand>("medium");
  const [trailPickerFrom, setTrailPickerFrom] = useState<string | null>(null);
  const [branchExploreId, setBranchExploreId] = useState<string | null>(null);
  const [revealedTrailNodes, setRevealedTrailNodes] = useState<string[] | null>(null);
  const [replayToken, setReplayToken] = useState(0);
  const [memoryToast, setMemoryToast] = useState<string | null>(null);

  const setSelectedPersonId = useCallback(
    (id: string | null) => {
      propOnSelectPerson?.(id);
      setInternalSelectedPersonId(id);
    },
    [propOnSelectPerson]
  );

  const setActiveDiscoveryPath = useCallback((path: DiscoveryPath | null) => {
    setInternalDiscoveryPath(path);
  }, []);

  const allMembers = useMemo(() => {
    if (customMembers) return customMembers;
    return branchAdded ? [...INITIAL_DEMO_MEMBERS, ...DEMO_EXTRACTION_BRANCH] : INITIAL_DEMO_MEMBERS;
  }, [branchAdded, customMembers]);

  const memberMap = useMemo(() => new Map(allMembers.map((m) => [m.id, m])), [allMembers]);
  const selectedMember = selectedPersonId ? memberMap.get(selectedPersonId) || null : null;

  const directRelativeIds = useMemo(() => {
    if (!selectedMember) return new Set<string>();
    return new Set(selectedMember.directConnections.map((c) => c.id));
  }, [selectedMember]);

  const handleSelectPerson = useCallback(
    (id: string | null) => {
      if (trailPickerFrom && id && id !== trailPickerFrom) {
        const path = findDemoPath(trailPickerFrom, id);
        setTrailPickerFrom(null);
        if (path) {
          setActiveDiscoveryPath(path);
          setSelectedPersonId(null);
          return;
        }
        setMemoryToast("This demo traces Nora → Arthur, Maya → Arthur, and Nora → Eleanor.");
        window.setTimeout(() => setMemoryToast(null), 2800);
      }
      setSelectedPersonId(id);
      setBranchExploreId(null);
      if (activeDiscoveryPath) setActiveDiscoveryPath(null);
    },
    [trailPickerFrom, activeDiscoveryPath, setSelectedPersonId, setActiveDiscoveryPath]
  );

  useEffect(() => {
    if (!activeDiscoveryPath) {
      const clearTimer = window.setTimeout(() => setRevealedTrailNodes(null), 0);
      return () => window.clearTimeout(clearTimer);
    }
    const sequence = activeDiscoveryPath.highlightNodeIds;
    const timers = sequence.map((nodeId, index) =>
      window.setTimeout(() => {
        setRevealedTrailNodes((current) => (index === 0 ? [nodeId] : [...(current ?? []), nodeId]));
      }, 420 * index)
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeDiscoveryPath, replayToken]);

  useEffect(() => {
    if (!isNewBranchAdded) return;
    const start = window.setTimeout(() => {
      setBloomLabel("New branch 🌿");
      setIsGrowing(true);
    }, 0);
    const hide = window.setTimeout(() => setBloomLabel(null), 2400);
    const grow = window.setTimeout(() => setIsGrowing(false), 900);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(hide);
      window.clearTimeout(grow);
    };
  }, [isNewBranchAdded]);

  useEffect(() => {
    if (!bloomToken || bloomPersonIds.length === 0) return;
    const start = window.setTimeout(() => {
      setBloomLabel("NEW BRANCH 🌿");
      setIsGrowing(true);
    }, 0);
    const frame = window.setTimeout(() => {
      const branchNodes = bloomPersonIds.map((id) => getNode(id)).filter((node): node is Node => Boolean(node));
      if (branchNodes.length) {
        fitView({ nodes: branchNodes, padding: 0.65, duration: 550, minZoom: 0.55, maxZoom: 1.1 });
      }
    }, 220);
    const finish = window.setTimeout(() => setIsGrowing(false), 950);
    const hide = window.setTimeout(() => setBloomLabel(null), 2600);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(frame);
      window.clearTimeout(finish);
      window.clearTimeout(hide);
    };
  }, [bloomToken, bloomPersonIds, fitView, getNode]);

  const handleMove = useCallback((_: unknown, viewport: Viewport) => {
    const next = zoomToBand(viewport.zoom);
    setZoomBand((current) => (current === next ? current : next));
  }, []);

  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];

    allMembers.forEach((member) => {
      const pos = (customPositions && customPositions[member.id]) || POSITIONS[member.id] || { x: 0, y: 0 };
      const isSelected = selectedPersonId === member.id;
      const isDirectRel = directRelativeIds.has(member.id);
      const isPathHighlight = Boolean(activeDiscoveryPath?.highlightNodeIds.includes(member.id));
      const trailReady = !activeDiscoveryPath || Boolean(revealedTrailNodes?.includes(member.id));

      const exploreMember = branchExploreId ? memberMap.get(branchExploreId) : null;
      const inExploredBranch = exploreMember
        ? member.branchName === exploreMember.branchName ||
          member.id === exploreMember.id ||
          exploreMember.directConnections.some((rel) => rel.id === member.id)
        : true;

      const isDimmed = activeDiscoveryPath
        ? !isPathHighlight || !trailReady
        : branchExploreId
          ? !inExploredBranch
          : selectedPersonId
            ? !isSelected && !isDirectRel
            : false;

      nodes.push({
        id: member.id,
        type: "personNode",
        draggable: false,
        position: pos,
        data: {
          member,
          isSelected,
          isDimmed,
          isPathHighlighted: isPathHighlight && trailReady,
          isBlooming: isGrowing && (customMembers ? bloomPersonIds.includes(member.id) : ["joseph", "mathew", "thomas"].includes(member.id)),
          zoomBand,
          onSelectPerson: handleSelectPerson,
        } as PersonNodeData,
      });
    });

    if (selectedPersonId) {
      DEMO_MEMORIES.filter((memory) => memory.targetPersonId === selectedPersonId)
        .slice(0, 3)
        .forEach((memory) => {
          const parentPos = POSITIONS[memory.targetPersonId];
          if (!parentPos) return;
          nodes.push({
            id: memory.id,
            type: "memoryNode",
            draggable: false,
            selectable: false,
            position: {
              x: parentPos.x + memory.xOffset,
              y: parentPos.y + memory.yOffset,
            },
            data: { memory, isDimmed: false } as MemoryNodeData,
          });
        });
    }

    return nodes;
  }, [
    allMembers,
    selectedPersonId,
    directRelativeIds,
    activeDiscoveryPath,
    handleSelectPerson,
    zoomBand,
    isGrowing,
    branchExploreId,
    memberMap,
    revealedTrailNodes,
    customPositions,
    customMembers,
    bloomPersonIds,
  ]);

  const initialEdges: Edge[] = useMemo(() => {
    if (customEdges) {
      return customEdges.map((edge) => {
        const isConnected =
          selectedPersonId && (edge.source === selectedPersonId || edge.target === selectedPersonId);

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: "kinshipEdge",
          data: {
            relationshipType: edge.type,
            isPathHighlighted: false,
            isSelectedConnected: Boolean(isConnected),
            isGrowing: isGrowing && (bloomPersonIds.includes(edge.source) || bloomPersonIds.includes(edge.target)),
          },
        };
      });
    }

    const baseEdges: { id: string; source: string; target: string; type: "parent" | "spouse" | "sibling" }[] = [
      { id: "arthur-eleanor", source: "arthur", target: "eleanor", type: "spouse" },
      { id: "arthur-julian", source: "arthur", target: "julian", type: "parent" },
      { id: "eleanor-julian", source: "eleanor", target: "julian", type: "parent" },
      { id: "julian-clara", source: "julian", target: "clara", type: "spouse" },
      { id: "julian-nora", source: "julian", target: "nora", type: "parent" },
      { id: "julian-leo", source: "julian", target: "leo", type: "parent" },
      { id: "julian-maya", source: "julian", target: "maya", type: "parent" },
      { id: "clara-nora", source: "clara", target: "nora", type: "parent" },
      { id: "clara-leo", source: "clara", target: "leo", type: "parent" },
      { id: "clara-maya", source: "clara", target: "maya", type: "parent" },
    ];

    if (branchAdded) {
      baseEdges.push(
        { id: "joseph-arthur", source: "joseph", target: "arthur", type: "sibling" },
        { id: "mathew-joseph", source: "mathew", target: "joseph", type: "sibling" },
        { id: "thomas-mathew", source: "thomas", target: "mathew", type: "sibling" }
      );
    }

    return baseEdges.map((edge) => {
      const isPath = Boolean(activeDiscoveryPath?.highlightEdgeIds.includes(edge.id));
      const trailReady =
        !activeDiscoveryPath ||
        Boolean(
          revealedTrailNodes &&
            revealedTrailNodes.includes(edge.source) &&
            revealedTrailNodes.includes(edge.target)
        );
      const isConnected =
        selectedPersonId && (edge.source === selectedPersonId || edge.target === selectedPersonId);

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "kinshipEdge",
        data: {
          relationshipType: edge.type,
          isPathHighlighted: isPath && trailReady,
          isSelectedConnected: Boolean(isConnected),
          isGrowing: isGrowing && ["joseph-arthur", "mathew-joseph", "thomas-mathew"].includes(edge.id),
        },
      };
    });
  }, [branchAdded, activeDiscoveryPath, selectedPersonId, isGrowing, revealedTrailNodes, customEdges, bloomPersonIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fitView({ padding: 0.12, duration: 280, minZoom: 0.55, maxZoom: 1.15 });
    }, 180);
    return () => window.clearTimeout(timer);
  }, [fitView, branchAdded]);

  useEffect(() => {
    if (!selectedPersonId) return;
    const node = getNode(selectedPersonId);
    if (!node) return;
    const timer = window.setTimeout(() => {
      setCenter(node.position.x + 84, node.position.y + 110, { zoom: 1.05, duration: 380 });
    }, 40);
    return () => window.clearTimeout(timer);
  }, [selectedPersonId, getNode, setCenter]);

  const handleStartDiscovery = (sourceId: string) => {
    setTrailPickerFrom(sourceId);
    setActiveDiscoveryPath(null);
  };

  const handleExploreBranch = (sourceId: string) => {
    setBranchExploreId(sourceId);
  };

  const handleReplayTrail = () => {
    setReplayToken((token) => token + 1);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", inset: "0 0 168px 0" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onPaneClick={() => {
          handleSelectPerson(null);
          setTrailPickerFrom(null);
          setBranchExploreId(null);
        }}
        onMove={handleMove}
        onInit={(instance) => {
          instance.fitView({ padding: 0.12, duration: 0 });
        }}
        fitView
        fitViewOptions={{ padding: 0.12, minZoom: 0.55, maxZoom: 1.15 }}
        minZoom={0.42}
        maxZoom={1.7}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        defaultViewport={{ x: 0, y: 0, zoom: 0.92 }}
        proOptions={{ hideAttribution: false }}
      />
      </div>

      <div className="kin-controls-bar">
        <button onClick={() => zoomIn({ duration: 250 })} className="kin-control-btn" aria-label="Zoom in" title="Zoom in">
          <ZoomIn size={18} />
        </button>
        <button onClick={() => zoomOut({ duration: 250 })} className="kin-control-btn" aria-label="Zoom out" title="Zoom out">
          <ZoomOut size={18} />
        </button>
        <button
          onClick={() => fitView({ padding: 0.16, duration: 350 })}
          className="kin-control-btn"
          aria-label="Fit family to view"
          title="Fit view"
        >
          <Maximize2 size={17} />
        </button>
      </div>

      {bloomLabel && <div className="kin-bloom-label">{bloomLabel}</div>}

      {memoryToast && (
        <div className="kin-bloom-label" style={{ top: 64, background: "var(--cream-hot)" }}>
          {memoryToast}
        </div>
      )}

      {trailPickerFrom && (
        <div
          className="kin-stamp"
          style={{
            position: "absolute",
            top: 18,
            left: 16,
            zIndex: 30,
            background: "var(--cream-hot)",
            border: "var(--outline-heavy) solid var(--ink)",
            boxShadow: "var(--shadow-rest)",
            padding: "10px 14px",
            maxWidth: 280,
            fontSize: "0.72rem",
          }}
        >
          Choose a second person to see the connection.
        </div>
      )}

      {selectedMember && !activeDiscoveryPath && !trailPickerFrom && (
        <div
          className="kin-desktop-inspector"
          style={{
            position: "absolute",
            bottom: 176,
            right: 16,
            zIndex: 30,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxWidth: 280,
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button type="button" className="kin-press-ghost" style={{ padding: "10px 12px", minHeight: 44 }} onClick={() => handleExploreBranch(selectedMember.id)}>
              Explore branch
            </button>
            <button type="button" className="kin-press" style={{ padding: "10px 12px", minHeight: 44 }} onClick={() => handleStartDiscovery(selectedMember.id)}>
              Find connection
            </button>
            <button
              type="button"
              className="kin-press-ghost"
              style={{ padding: "10px 12px", minHeight: 44 }}
              onClick={() => {
                setMemoryToast(`A memory slot opened beside ${selectedMember.name.split(" ")[0]}.`);
                window.setTimeout(() => setMemoryToast(null), 2200);
              }}
            >
              Add memory
            </button>
          </div>
          <PersonFocusDrawer
            member={selectedMember}
            onClose={() => handleSelectPerson(null)}
            onSelectRelative={handleSelectPerson}
            onStartDiscovery={handleStartDiscovery}
            onExploreBranch={handleExploreBranch}
          />
        </div>
      )}

      {selectedMember && !activeDiscoveryPath && !trailPickerFrom && (
        <div
          className="kin-mobile-sheet"
          style={{
            position: "absolute",
            bottom: 176,
            left: 10,
            right: 10,
            zIndex: 30,
            maxHeight: "58vh",
            overflowY: "auto",
          }}
        >
          <PersonFocusDrawer
            member={selectedMember}
            compact
            onClose={() => handleSelectPerson(null)}
            onSelectRelative={handleSelectPerson}
            onStartDiscovery={handleStartDiscovery}
            onExploreBranch={handleExploreBranch}
          />
        </div>
      )}

      {activeDiscoveryPath && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 35,
          }}
        >
          <RelationshipPathModal
            path={activeDiscoveryPath}
            onClose={() => setActiveDiscoveryPath(null)}
            onStepClick={handleSelectPerson}
            onSeeWhy={handleReplayTrail}
          />
        </div>
      )}
    </div>
  );
}

export function FamilyCanvas(props: FamilyCanvasProps) {
  return (
    <ReactFlowProvider>
      <FamilyCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
