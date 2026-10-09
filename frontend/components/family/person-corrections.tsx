"use client";

import { useState } from "react";
import { ApiError, BackendEdge, BackendGraph, BackendPerson, editPerson, removePerson, removeRelationship } from "@/lib/api";
import { HeirloomDialog } from "./heirloom-dialog";

export function PersonCorrections({ person, graph, familyId, selfId, onClose, onChanged, onAuthExpired }: {
  person: BackendPerson; graph: BackendGraph; familyId: string; selfId: string;
  onClose: () => void; onChanged: () => Promise<void>; onAuthExpired?: () => void;
}) {
  const [draft, setDraft] = useState({ name: person.name, gender: person.gender, birth_date: person.birth_date || "", death_date: person.death_date || "", notes: person.notes });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stale, setStale] = useState(false);
  const [confirmation, setConfirmation] = useState<BackendEdge | "person" | null>(null);
  const names = new Map(graph.people.map((member) => [member.id, member.name]));
  const label = (edge: BackendEdge) => `${names.get(edge.source)} → ${names.get(edge.target)} (${edge.type === "PARENT_OF" ? "parent → child" : edge.type === "SPOUSE_OF" ? "spouses" : "siblings"})`;
  const mutate = async (action: () => Promise<unknown>) => {
    if (busy) return;
    setBusy(true); setError(null);
    try { await action(); await onChanged(); onClose(); }
    catch (error) {
      if (error instanceof ApiError && error.status === 401) onAuthExpired?.();
      setStale(error instanceof ApiError && error.status === 409);
      setError(error instanceof ApiError && error.status > 0 ? error.detail : "Could not reach the family service. Please try again.");
    } finally { setBusy(false); }
  };
  return <HeirloomDialog title={`Details of ${person.name}`} onClose={onClose} busy={busy}>
    {error && <p role="alert">{error}</p>}
    {stale ? <button className="kin-press" disabled={busy} onClick={() => mutate(async () => { await onChanged(); })}>Refresh family</button> : confirmation ? <>
      <h3 className="kin-stamp">{confirmation === "person" ? "REMOVE THIS PERSON?" : "REMOVE THIS RELATIONSHIP?"}</h3>
      <p>{confirmation === "person"
        ? `Remove only ${person.name} and their relationship links. Relatives remain. All memories stay in the family journal; only this person's memory links are removed. The family anchor cannot be removed.`
        : `Remove ${label(confirmation)}. Both people and their memories remain.`}</p>
      <p>This cannot be undone here.</p>
      <div className="kin-dialog-actions">
        <button className="kin-press-ghost" disabled={busy} onClick={() => setConfirmation(null)}>Keep it</button>
        <button className="kin-press" disabled={busy} onClick={() => mutate(() => confirmation === "person"
          ? removePerson(familyId, person.id, graph.revision)
          : removeRelationship(familyId, confirmation, graph.revision))}>{busy ? "Removing…" : confirmation === "person" ? "Remove person" : "Remove relationship"}</button>
      </div>
    </> : <>
      <form onSubmit={(event) => { event.preventDefault(); mutate(() => editPerson(familyId, person.id, graph.revision, { ...draft, birth_date: draft.birth_date || null, death_date: draft.death_date || null })); }}>
        <label className="kin-field">Name<input required maxLength={120} value={draft.name} disabled={busy} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
        <label className="kin-field">Gender<select value={draft.gender} disabled={busy} onChange={(event) => setDraft({ ...draft, gender: event.target.value as BackendPerson["gender"] })}><option value="unspecified">Unspecified</option><option value="male">Male</option><option value="female">Female</option></select></label>
        <label className="kin-field">Birth date<input type="date" value={draft.birth_date} disabled={busy} onChange={(event) => setDraft({ ...draft, birth_date: event.target.value })} /></label>
        <label className="kin-field">Death date<input type="date" min={draft.birth_date || undefined} value={draft.death_date} disabled={busy} onChange={(event) => setDraft({ ...draft, death_date: event.target.value })} /></label>
        <label className="kin-field">Notes<textarea maxLength={5000} rows={3} value={draft.notes} disabled={busy} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></label>
        <button className="kin-press" disabled={busy || !draft.name.trim()}>{busy ? "Saving…" : "Save details"}</button>
      </form>
      <h3 className="kin-stamp" style={{marginTop:24}}>Relationship corrections</h3>
      {graph.edges.filter((edge) => edge.source === person.id || edge.target === person.id).map((edge) => <div key={`${edge.source}-${edge.target}-${edge.type}`} className="kin-memory-list">
        <p>{label(edge)}</p><button className="kin-press-ghost" onClick={() => setConfirmation(edge)}>Remove link: {label(edge)}</button>
      </div>)}
      {person.id !== selfId ? <button className="kin-press-ghost" style={{marginTop:24}} onClick={() => setConfirmation("person")}>Remove this person</button>
        : <p>The family anchor can be edited, but cannot be removed.</p>}
    </>}
  </HeirloomDialog>;
}
