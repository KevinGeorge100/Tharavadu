import { apiFetch } from "./client";

export interface FamilyMemory {
  id: string;
  family_id: string;
  author: string;
  text: string;
  people: string[];
  created: number;
}

const path = (familyId: string) => `/api/families/${encodeURIComponent(familyId)}/memories`;
export const listMemories = (familyId: string) => apiFetch<FamilyMemory[]>(path(familyId));
export const createMemory = (familyId: string, text: string, people: string[]) =>
  apiFetch<FamilyMemory>(path(familyId), { method: "POST", body: JSON.stringify({ text, people }) });
export const deleteMemory = (familyId: string, memoryId: string) =>
  apiFetch<{ ok: boolean }>(`${path(familyId)}/${encodeURIComponent(memoryId)}`, { method: "DELETE" });
