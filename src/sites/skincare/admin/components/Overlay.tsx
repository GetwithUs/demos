"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/sites/skincare/admin/components/ui";

type OverlayKind = "dialog" | "drawer-right" | "drawer-left";

/**
 * A modal dialog or side drawer on the native <dialog> element: focus moves inside and is
 * trapped, Escape and the backdrop close it, and focus returns to the opener afterwards.
 * Put data-autofocus on the element that should take focus first.
 */
export function Overlay({
  open,
  onClose,
  title,
  description,
  kind = "dialog",
  footer,
  className,
  bodyClassName,
  hideTitle = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  kind?: OverlayKind;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  hideTitle?: boolean;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      const opener = document.activeElement as HTMLElement | null;
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      const root = document.documentElement;
      const previousOverflow = root.style.overflow;
      root.style.overflow = "hidden";
      return () => {
        root.style.overflow = previousOverflow;
        if (dialog.open) dialog.close();
        if (opener && document.contains(opener)) opener.focus();
      };
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        "fixed bg-white p-0 text-stone-900 shadow-2xl backdrop:bg-stone-950/45 open:flex open:flex-col",
        kind === "dialog" &&
          "inset-0 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg rounded-2xl",
        kind === "drawer-right" &&
          "inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-md",
        kind === "drawer-left" &&
          "inset-y-0 right-auto left-0 m-0 h-dvh max-h-dvh w-[min(20rem,88vw)] max-w-none",
        className,
      )}
    >
      {open ? (
        <>
          <div
            className={cn(
              "flex shrink-0 items-start justify-between gap-4 px-5 pt-4 pb-3",
              kind !== "dialog" && "border-b border-stone-200",
              hideTitle && "sr-only",
            )}
          >
            <div className="min-w-0">
              <h2 id={titleId} className="text-base font-semibold text-stone-900">
                {title}
              </h2>
              {description ? (
                <p id={descId} className="mt-1 text-sm text-stone-600">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mt-1 -mr-2 grid size-9 shrink-0 place-items-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-skin-accent"
            >
              <X aria-hidden className="size-4.5" />
            </button>
          </div>
          <div className={cn("min-h-0 flex-1 overflow-y-auto px-5 pb-5", bodyClassName)}>
            {children}
          </div>
          {footer ? (
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-stone-200 bg-stone-50 px-5 py-3">
              {footer}
            </div>
          ) : null}
        </>
      ) : null}
    </dialog>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  danger = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  children?: ReactNode;
}) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <Button onClick={onClose} data-autofocus>
            Keep as is
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Overlay>
  );
}

/**
 * Open state for a dropdown panel: closes on Escape (returning focus to the trigger) and on a
 * click outside; arrow keys move between [role=menuitem] or [data-menu-item] entries.
 */
export function usePopover<T extends HTMLElement = HTMLButtonElement>(): {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  triggerRef: RefObject<T | null>;
  panelRef: RefObject<HTMLDivElement | null>;
  onPanelKeyDown: (e: ReactKeyboardEvent) => void;
} {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<T>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onPanelKeyDown = (e: ReactKeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const items = [
      ...(panelRef.current?.querySelectorAll<HTMLElement>("[role=menuitem],[data-menu-item]") ??
        []),
    ];
    if (!items.length) return;
    e.preventDefault();
    const index = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? items.length - 1
          : e.key === "ArrowDown"
            ? (index + 1) % items.length
            : (index - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return { open, setOpen, toggle: () => setOpen(!open), triggerRef, panelRef, onPanelKeyDown };
}
