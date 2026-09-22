"use client";

import React, { memo } from "react";
import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";

export interface KinshipEdgeData {
  relationshipType?: "parent" | "spouse" | "sibling";
  isPathHighlighted?: boolean;
  isSelectedConnected?: boolean;
  branchColor?: string;
}

export const KinshipRelationshipEdge = memo(function KinshipRelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const edgeData = data as KinshipEdgeData | undefined;
  const isPath = edgeData?.isPathHighlighted;
  const isConnected = edgeData?.isSelectedConnected;
  const isSpouse = edgeData?.relationshipType === "spouse";

  // Art Nouveau flowing Bezier curve with gentle organic curvature
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.28,
  });

  const strokeColor = isPath
    ? "var(--accent-warm)"
    : isConnected
    ? "var(--accent-warm)"
    : "rgba(31, 28, 24, 0.22)";

  const strokeWidth = isPath ? 3.2 : isConnected ? 2.4 : 1.6;
  const strokeDash = isSpouse ? "5 4" : isPath ? "6 3" : undefined;
  const opacity = isPath ? 1 : isConnected ? 0.95 : 0.65;

  return (
    <>
      {/* Background glow when path illuminated */}
      {isPath && (
        <path
          d={edgePath}
          fill="none"
          stroke="var(--accent-warm-soft)"
          strokeWidth={8}
          opacity={0.8}
        />
      )}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray: strokeDash,
          opacity,
          transition: "stroke var(--duration-fast), stroke-width var(--duration-fast), opacity var(--duration-fast)",
        }}
      />
    </>
  );
});
