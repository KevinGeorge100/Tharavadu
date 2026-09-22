"use client";

import React, { memo } from "react";
import { BaseEdge, EdgeProps, getBezierPath, getStraightPath } from "@xyflow/react";

export interface KinshipEdgeData {
  relationshipType?: "parent" | "spouse" | "sibling";
  isPathHighlighted?: boolean;
  isSelectedConnected?: boolean;
  isGrowing?: boolean;
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
  const isSibling = edgeData?.relationshipType === "sibling";
  const isGrowing = edgeData?.isGrowing;

  const [edgePath] = isSpouse
    ? getStraightPath({ sourceX, sourceY, targetX, targetY })
    : getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: isSibling ? 0.55 : 0.38,
      });

  const strokeColor = isPath
    ? "var(--accent-warm)"
    : isConnected
      ? "var(--ink)"
      : isSpouse
        ? "var(--branch-rose)"
        : isSibling
          ? "var(--branch-blue)"
          : "var(--ink-soft)";

  const strokeWidth = isPath ? 4.4 : isConnected ? 3.2 : isSpouse ? 2.8 : 2.4;
  const strokeDash = isSibling ? "7 5" : undefined;

  return (
    <>
      {isPath && (
        <path d={edgePath} fill="none" stroke="var(--accent-warm)" strokeWidth={10} opacity={0.22} />
      )}
      {isSpouse && (
        <path
          d={edgePath}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={strokeWidth + 3}
          opacity={0.18}
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
          strokeDasharray: isGrowing ? "8 6" : strokeDash,
          strokeLinecap: "round",
          opacity: 1,
          animation: isGrowing ? "kin-grow-line 700ms var(--ease-natural) both" : undefined,
          transition: "stroke var(--duration-fast), stroke-width var(--duration-fast)",
        }}
      />
    </>
  );
});
