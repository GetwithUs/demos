"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A drawer or modal on the native <dialog> element: the browser traps focus, closes on
 * Escape and returns focus to the button that opened it. Slides in with CSS (theme.css).
 */
export default function Dialog({
  open,
  onClose,
  side = "right",
  label,
  labelledBy,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  side?: "right" | "left" | "top" | "center" | "bottom";
  /** Accessible name when there is no visible heading to point at. */
  label?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      data-side={side}
      aria-label={label}
      aria-labelledby={labelledBy}
      className={cn("skin-dialog", className)}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
}
