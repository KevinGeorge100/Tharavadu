"use client";

import { FamilyMemory } from "@/lib/api/memories";

export function LiveMemoryNode({ data }: { data: { memory: FamilyMemory; onOpen: () => void } }) {
  return <button type="button" className="kin-live-memory kin-memory-bloom nodrag" onClick={data.onOpen} aria-label={`Read memory: ${data.memory.text.slice(0, 60)}`}>
    <span className="kin-stamp">A memory kept ✦</span>
    <span>{data.memory.text.length > 130 ? `${data.memory.text.slice(0, 130)}…` : data.memory.text}</span>
  </button>;
}
