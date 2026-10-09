"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, createMemory, deleteMemory, FamilyMemory, listMemories } from "@/lib/api";
import { FamilyCanvas, FamilyCanvasProps } from "./family-canvas";
import { HeirloomDialog } from "./heirloom-dialog";

export function LiveFamilyWorkspace(props: FamilyCanvasProps & { liveFamilyId: string }) {
  const { liveFamilyId, onLiveAuthExpired } = props;
  const [memories, setMemories] = useState<FamilyMemory[]>([]);
  const [personId, setPersonId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<FamilyMemory | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const reportError = useCallback((error: unknown) => {
    if (error instanceof ApiError && error.status === 401) onLiveAuthExpired?.();
    setError(error instanceof ApiError && error.status > 0 && error.status < 500
      ? error.detail : "The family service could not be reached. Please try again.");
  }, [onLiveAuthExpired]);
  useEffect(() => {
    let active = true;
    listMemories(liveFamilyId).then((items) => { if (active) setMemories(items); })
      .catch((error) => { if (active) reportError(error); });
    return () => { active = false; };
  }, [liveFamilyId, reportError]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const members = useMemo(() => props.customMembers?.map((member) => ({
    ...member, memoriesCount: memories.filter((memory) => memory.people.includes(member.id)).length,
  })), [props.customMembers, memories]);
  const person = members?.find((member) => member.id === personId);
  const openJournal = (id: string) => { setPersonId(id); setText(""); setError(null); setRemoving(null); };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!personId || !text.trim() || busy) return;
    setBusy(true); setError(null);
    try {
      await createMemory(liveFamilyId, text.trim(), [personId]);
      setMemories(await listMemories(liveFamilyId));
      setText(""); setPersonId(null); setNotice("MEMORY KEPT ✦");
    } catch (error) { reportError(error); }
    finally { setBusy(false); }
  };
  const remove = async () => {
    if (!removing || busy) return;
    setBusy(true); setError(null);
    try {
      await deleteMemory(liveFamilyId, removing.id);
      setMemories(await listMemories(liveFamilyId));
      setRemoving(null);
    } catch (error) { reportError(error); }
    finally { setBusy(false); }
  };
  return <>
    <FamilyCanvas {...props} customMembers={members} liveMemories={memories} onOpenMemories={openJournal} />
    {notice && <div className="kin-bloom-label" role="status">{notice}</div>}
    {error && !person && <div className="kin-bloom-label" role="alert">{error}</div>}
    {person && <HeirloomDialog title={`Memories of ${person.name}`} busy={busy} onClose={() => setPersonId(null)}>
      {error && <p role="alert">{error}</p>}
      {removing ? <>
        <h3 className="kin-stamp">REMOVE THIS MEMORY?</h3>
        <p>This removes the memory from Tharavadu. It does not change family relationships.</p>
        <blockquote>{removing.text}</blockquote>
        <div className="kin-dialog-actions">
          <button className="kin-press-ghost" disabled={busy} onClick={() => setRemoving(null)}>Keep it</button>
          <button className="kin-press" disabled={busy} onClick={remove}>{busy ? "Removing…" : "Remove memory"}</button>
        </div>
      </> : <>
        <form onSubmit={save}>
          <label className="kin-field">A memory to keep<textarea aria-label="Memory text" rows={4} maxLength={10000} required value={text} onChange={(event) => setText(event.target.value)} disabled={busy} /></label>
          <button className="kin-press" disabled={busy || !text.trim()}>{busy ? "Keeping…" : "Keep memory ✦"}</button>
        </form>
        <div className="kin-memory-list">
          {memories.filter((memory) => memory.people.includes(person.id)).map((memory) => <article key={memory.id}>
            <p>{memory.text}</p>
            <button className="kin-press-ghost" onClick={() => setRemoving(memory)}>Remove this memory</button>
          </article>)}
          {!memories.some((memory) => memory.people.includes(person.id)) && <p>No memories kept yet. Start with a moment you remember.</p>}
        </div>
      </>}
    </HeirloomDialog>}
  </>;
}
