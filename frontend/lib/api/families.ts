import { apiFetch } from "./client";
import { BackendGraph, Family, FamilyCreateInput } from "./types";

export async function listFamilies(): Promise<Family[]> {
  return apiFetch<Family[]>("/api/families", {
    method: "GET",
  });
}

export async function createFamily(input: FamilyCreateInput): Promise<Family> {
  return apiFetch<Family>("/api/families", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getFamilyGraph(familyId: string): Promise<BackendGraph> {
  return apiFetch<BackendGraph>(`/api/families/${encodeURIComponent(familyId)}/graph`, {
    method: "GET",
  });
}
