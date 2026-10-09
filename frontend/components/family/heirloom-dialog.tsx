"use client";

import { useEffect, useRef, useId } from "react";

export function HeirloomDialog({ title, children, onClose, busy = false }: {
  title: string; children: React.ReactNode; onClose: () => void; busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} className="kin-dialog" aria-labelledby={titleId} onCancel={(event) => {
    event.preventDefault();
    if (!busy) onClose();
  }}>
    <div className="kin-dialog-heading">
      <h2 id={titleId} className="kin-stamp">{title}</h2>
      <button type="button" className="kin-press-ghost" aria-label="Close dialog" disabled={busy} onClick={onClose}>×</button>
    </div>
    {children}
  </dialog>;
}
