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
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import {
  INITIAL_DEMO_MEMBERS,
  DEMO_EXTRACTION_BRANCH,
  DEMO_MEMORIES,
} from "@/data/demo-family";
import { DEMO_DISCOVERY_PATHS, DiscoveryPath } from "@/data/demo-paths";
import { PersonNode, PersonNodeData } from "@/components/family/person-node";
import { MemoryArtifactNode, MemoryNodeData } from "@/components/family/memory-artifact-node";
import { KinshipRelationshipEdge } from "@/components/family/relationship-edge";
import { PersonFocusDrawer } from "@/components/family/person-focus-drawer";
import { RelationshipPathModal } from "@/components/family/relationship-path-modal";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface FamilyCanvasProps {
  initialSelectedId?: string | null;
  initialDiscoveryPathKey?: string | null;
  isNewBranchAdded?: boolean;
  onSelectPerson?: (id: string | null) => void;
}

const nodeTypes = {
  personNode: PersonNode,
  memoryNode: MemoryArtifactNode,
};

const edgeTypes = {
  kinshipEdge: KinshipRelationshipEdge,
};

function FamilyCanvasInner({
  initialSelectedId = null,
  initialDiscoveryPathKey = null,
  isNewBranchAdded = false,
  onSelectPerson: propOnSelectPerson,
}: FamilyCanvasProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

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
  const [toastMessage] = useState<string | null>(
    isNewBranchAdded ? "New branch added 🌿" : null
  );

  const setSelectedPersonId = useCallback(
    (id: string | null) => {
      if (propOnSelectPerson) propOnSelectPerson(id);
      else setInternalSelectedPersonId(id);
    },
    [propOnSelectPerson]
  );

  const setActiveDiscoveryPath = useCallback((path: DiscoveryPath | null) => {
    setInternalDiscoveryPath(path);
  }, []);

  const allMembers = useMemo(() => {
    return branchAdded
      ? [...INITIAL_DEMO_MEMBERS, ...DEMO_EXTRACTION_BRANCH]
      : INITIAL_DEMO_MEMBERS;
  }, [branchAdded]);

  const memberMap = useMemo(() => {
    return new Map(allMembers.map((m) => [m.id, m]));
  }, [allMembers]);

  const selectedMember = selectedPersonId ? memberMap.get(selectedPersonId) || null : null;

  // Set of connected relatives for the selected person
  const directRelativeIds = useMemo(() => {
    if (!selectedMember) return new Set<string>();
    return new Set(selectedMember.directConnections.map((c) => c.id));
  }, [selectedMember]);

  const handleSelectPerson = useCallback((id: string | null) => {
    setSelectedPersonId(id);
    if (propOnSelectPerson) propOnSelectPerson(id);
    if (activeDiscoveryPath) setActiveDiscoveryPath(null);
  }, [propOnSelectPerson, activeDiscoveryPath, setSelectedPersonId, setActiveDiscoveryPath]);

  // Build initial React Flow Nodes
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];

    // Base Family Members
    const positions: Record<string, { x: number; y: number }> = {
      arthur: { x: 120, y: 40 },
      eleanor: { x: 450, y: 40 },
      julian: { x: 170, y: 240 },
      clara: { x: 500, y: 240 },
      nora: { x: 60, y: 440 },
      leo: { x: 330, y: 440 },
      maya: { x: 600, y: 440 },
      // Extraction branch
      joseph: { x: -220, y: 40 },
      mathew: { x: -480, y: 40 },
      thomas: { x: -740, y: 40 },
    };

    allMembers.forEach((member) => {
      const pos = positions[member.id] || { x: 0, y: 0 };
      const isSelected = selectedPersonId === member.id;
      const isDirectRel = directRelativeIds.has(member.id);
      const isPathHighlight = activeDiscoveryPath?.highlightNodeIds.includes(member.id);

      const isDimmed =
        activeDiscoveryPath
          ? !isPathHighlight
          : selectedPersonId
          ? !isSelected && !isDirectRel
          : false;

      nodes.push({
        id: member.id,
        type: "personNode",
        position: pos,
        data: {
          member,
          isSelected,
          isDimmed,
          isPathHighlighted: isPathHighlight,
          onSelectPerson: handleSelectPerson,
        } as PersonNodeData,
      });
    });

    // Pinned Memory Artifacts
    DEMO_MEMORIES.forEach((memory) => {
      const parentPos = positions[memory.targetPersonId];
      if (parentPos) {
        const isDimmed = selectedPersonId && selectedPersonId !== memory.targetPersonId;
        nodes.push({
          id: memory.id,
          type: "memoryNode",
          position: {
            x: parentPos.x + memory.xOffset,
            y: parentPos.y + memory.yOffset,
          },
          data: {
            memory,
            isDimmed,
          } as MemoryNodeData,
        });
      }
    });

    return nodes;
  }, [allMembers, selectedPersonId, directRelativeIds, activeDiscoveryPath, handleSelectPerson]);

  // Build initial React Flow Edges
  const initialEdges: Edge[] = useMemo(() => {
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
      const isPath = activeDiscoveryPath?.highlightEdgeIds.includes(edge.id);
      const isConnected =
        selectedPersonId && (edge.source === selectedPersonId || edge.target === selectedPersonId);

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "kinshipEdge",
        data: {
          relationshipType: edge.type,
          isPathHighlighted: isPath,
          isSelectedConnected: isConnected,
        },
      };
    });
  }, [branchAdded, activeDiscoveryPath, selectedPersonId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync internal nodes/edges when dependencies change
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Initial fit view on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.25, duration: 400 });
    }, 150);
    return () => clearTimeout(timer);
  }, [fitView]);

  const handleStartDiscovery = (sourceId: string) => {
    // If Nora, trigger path to grandfather Arthur
    if (sourceId === "nora") {
      setActiveDiscoveryPath(DEMO_DISCOVERY_PATHS["nora-arthur"]);
    } else if (sourceId === "maya") {
      setActiveDiscoveryPath(DEMO_DISCOVERY_PATHS["maya-arthur"]);
    } else {
      setActiveDiscoveryPath(DEMO_DISCOVERY_PATHS["nora-eleanor"]);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* React Flow Spatial Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onPaneClick={() => handleSelectPerson(null)}
        fitView
        minZoom={0.35}
        maxZoom={1.6}
        defaultViewport={{ x: 0, y: 0, zoom: 0.95 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color="rgba(31, 28, 24, 0.08)"
        />
      </ReactFlow>

      {/* Floating Canvas Controls (Top Right) */}
      <div className="kin-controls-bar">
        <button
          onClick={() => zoomIn({ duration: 250 })}
          className="kin-control-btn"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => zoomOut({ duration: 250 })}
          className="kin-control-btn"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          onClick={() => fitView({ padding: 0.2, duration: 350 })}
          className="kin-control-btn"
          aria-label="Fit tree to view"
          title="Fit view"
        >
          <Maximize2 size={15} />
        </button>
      </div>

      {/* Toast Notification (e.g. New branch added 🌿) */}
      {toastMessage && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "var(--bg-surface-elevated)",
            border: "1.5px solid var(--branch-sage)",
            color: "var(--branch-sage)",
            padding: "8px 16px",
            borderRadius: "var(--radius-full)",
            boxShadow: "var(--shadow-md)",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 40,
            animation: "fadeIn 200ms ease",
          }}
        >
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Floating Scrapbook Inspector (Docked at Right) */}
      {selectedMember && !activeDiscoveryPath && (
        <div
          className="kin-desktop-inspector"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 30,
          }}
        >
          <PersonFocusDrawer
            member={selectedMember}
            onClose={() => handleSelectPerson(null)}
            onSelectRelative={handleSelectPerson}
            onStartDiscovery={handleStartDiscovery}
          />
        </div>
      )}

      {/* Mobile Bottom-Sheet Inspector */}
      {selectedMember && !activeDiscoveryPath && (
        <div
          className="kin-mobile-sheet"
          style={{
            position: "absolute",
            bottom: "85px",
            left: "12px",
            right: "12px",
            zIndex: 30,
            maxHeight: "65vh",
            overflowY: "auto",
          }}
        >
          <PersonFocusDrawer
            member={selectedMember}
            onClose={() => handleSelectPerson(null)}
            onSelectRelative={handleSelectPerson}
            onStartDiscovery={handleStartDiscovery}
          />
        </div>
      )}

      {/* Relationship Path Discovery Card */}
      {activeDiscoveryPath && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 35,
          }}
        >
          <RelationshipPathModal
            path={activeDiscoveryPath}
            onClose={() => setActiveDiscoveryPath(null)}
            onStepClick={handleSelectPerson}
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
