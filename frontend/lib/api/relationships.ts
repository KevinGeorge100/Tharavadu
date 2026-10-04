import { apiFetch } from "./client";
import { RelationshipResult } from "./types";

export function getRelationship(familyId: string, sourceId: string, targetId: string): Promise<RelationshipResult> {
  const params = new URLSearchParams({ source: sourceId, target: targetId });
  return apiFetch<RelationshipResult>(
    `/api/families/${encodeURIComponent(familyId)}/relationship?${params.toString()}`
  );
}
