import { apiFetch } from "./client";
import { BackendGraph, ConfirmProposalInput, Proposal } from "./types";

function proposalPath(familyId: string, proposalId?: string): string {
  const base = `/api/families/${encodeURIComponent(familyId)}/proposals`;
  return proposalId ? `${base}/${encodeURIComponent(proposalId)}` : base;
}

export function createProposal(familyId: string, text: string): Promise<Proposal> {
  return apiFetch<Proposal>(proposalPath(familyId), {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export function confirmProposal(
  familyId: string,
  proposalId: string,
  input: ConfirmProposalInput
): Promise<BackendGraph> {
  return apiFetch<BackendGraph>(`${proposalPath(familyId, proposalId)}/confirm`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteProposal(familyId: string, proposalId: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(proposalPath(familyId, proposalId), {
    method: "DELETE",
  });
}
