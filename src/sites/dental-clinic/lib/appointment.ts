"use client";

import { useMemo, useSyncExternalStore } from "react";

/** A demo appointment, kept only in this browser's localStorage. Nothing is sent anywhere. */
export type StoredAppointment = {
  ref: string;
  reasonId: string;
  reasonLabel: string;
  doctorName: string | null;
  dateISO: string;
  time: string;
  minutes: number;
  name: string;
  phone: string;
  email: string;
  firstVisit: boolean;
  reminders: boolean;
  notes: string;
  createdAt: string;
};

const KEY = "ivorine-dental:appointment";
const CHANGE_EVENT = "ivorine-dental:appointment-change";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): StoredAppointment | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<StoredAppointment>;
    if (typeof value.ref !== "string" || typeof value.dateISO !== "string") return null;
    return value as StoredAppointment;
  } catch {
    return null;
  }
}

/** The last appointment booked in this browser, or null. Always null during server rendering. */
export function useStoredAppointment(): StoredAppointment | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  return useMemo(() => parse(raw), [raw]);
}

export function saveAppointment(appointment: StoredAppointment): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(appointment));
  } catch {
    // Storage blocked (private mode): the confirmation still shows, it just is not remembered.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function clearAppointment(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** A short, readable booking reference such as "IVD-7K3M9P". */
export function makeReference(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return `IVD-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`;
}
