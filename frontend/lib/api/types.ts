/**
 * Tharavadu Typed API Contracts
 * Aligned with backend/app/schemas.py
 */

export interface User {
  id: string;
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Family {
  id: string;
  name: string;
  owner: string;
  self_id: string;
}

export interface FamilyCreateInput {
  name: string;
  person_name: string;
  demo?: boolean;
}

export interface BackendPerson {
  id: string;
  name: string;
  gender: "male" | "female" | "unspecified";
  birth_date?: string | null;
  death_date?: string | null;
  notes: string;
}

export interface BackendEdge {
  source: string;
  target: string;
  type: "PARENT_OF" | "SPOUSE_OF" | "SIBLING_OF";
}

export interface BackendGraph {
  people: BackendPerson[];
  edges: BackendEdge[];
  revision: number;
  applied: string[];
}

export interface RelationshipResult {
  relationship: string;
  path: string[];
  names: string[];
  steps: ("U" | "D" | "S" | "W")[];
  explanation: string;
}

export interface ExtractionEntity {
  ref: string;
  name: string;
  gender: "male" | "female" | "unspecified";
  existing_id: string | null;
}

export interface Extraction {
  entities: ExtractionEntity[];
  relationships: BackendEdge[];
  warnings: string[];
}

export interface Proposal {
  id: string;
  family_id: string;
  revision: number;
  extraction: Extraction;
  status: "pending" | "confirmed" | "rejected";
  created: number;
  candidates: Record<string, string[]>;
}

export interface ConfirmProposalInput {
  extraction: Extraction;
  resolutions: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}
