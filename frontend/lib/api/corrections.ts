import { apiFetch } from "./client";
import { BackendEdge, BackendGraph, BackendPerson } from "./types";
export type PersonEdit = Omit<BackendPerson, "id">;
const root = (familyId: string) => `/api/families/${encodeURIComponent(familyId)}`;
export const editPerson = (familyId: string, personId: string, revision: number, person: PersonEdit) =>
  apiFetch<BackendGraph>(`${root(familyId)}/people/${encodeURIComponent(personId)}?revision=${revision}`, { method: "PUT", body: JSON.stringify(person) });
export const removePerson = (familyId: string, personId: string, revision: number) =>
  apiFetch<BackendGraph>(`${root(familyId)}/people/${encodeURIComponent(personId)}?revision=${revision}`, { method: "DELETE" });
export const removeRelationship = (familyId: string, edge: BackendEdge, revision: number) => {
  const query = new URLSearchParams({ source: edge.source, target: edge.target, kind: edge.type, revision: String(revision) });
  return apiFetch<BackendGraph>(`${root(familyId)}/edges?${query}`, { method: "DELETE" });
};
