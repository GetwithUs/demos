"use client";

import { CircleCheck, Info, X } from "lucide-react";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type ToastInput = {
  title: string;
  description?: string;
  tone?: "success" | "info";
  action?: { label: string; href: string; external?: boolean };
};

type ToastItem = ToastInput & { id: number };

const ToastContext = createContext<(t: ToastInput) => void>(() => {});

/** Shows a short confirmation at the bottom of the screen; screen readers hear it politely. */
export function useToast(): (t: ToastInput) => void {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback(
    (id: number) => setItems((list) => list.filter((t) => t.id !== id)),
    [],
  );

  const push = useCallback(
    (t: ToastInput) => {
      const id = nextId.current++;
      setItems((list) => [...list.slice(-2), { ...t, id }]);
      setTimeout(() => dismiss(id), t.action ? 7000 : 4500);
    },
    [dismiss],
  );

  const value = useMemo(() => push, [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:px-6 print:hidden"
      >
        {items.map((t) => {
          const Icon = t.tone === "info" ? Info : CircleCheck;
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl bg-stone-900 px-4 py-3 text-sm text-white shadow-xl"
            >
              <Icon
                aria-hidden
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  t.tone === "info" ? "text-sky-300" : "text-emerald-300",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{t.title}</p>
                {t.description ? <p className="mt-0.5 text-stone-300">{t.description}</p> : null}
                {t.action ? (
                  <Link
                    href={t.action.href}
                    target={t.action.external ? "_blank" : undefined}
                    className="mt-1.5 inline-block font-medium text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
                  >
                    {t.action.label}
                  </Link>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="-mt-1 -mr-2 grid size-7 shrink-0 place-items-center rounded-md text-stone-400 hover:bg-white/10 hover:text-white"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
