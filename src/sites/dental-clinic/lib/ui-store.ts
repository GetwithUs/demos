"use client";

import { create } from "zustand";
import {
  CHIP_LABELS,
  FALLBACK,
  GREETING,
  detectIntent,
  replyFor,
  type BotReply,
  type IntentId,
} from "@/sites/dental-clinic/content/whatsapp";

export type ChatMessage = BotReply & {
  id: number;
  from: "bot" | "user";
  time: string;
};

type DentalUIState = {
  /** Whether the "in the real website this button calls the clinic" notice is open. */
  callNoticeOpen: boolean;
  /** Whether the mock WhatsApp chat panel is open. */
  chatOpen: boolean;
  messages: ChatMessage[];
  typing: boolean;
  openCallNotice: () => void;
  closeCallNotice: () => void;
  openChat: () => void;
  closeChat: () => void;
  /** The visitor sends a message, either typed or by tapping a quick reply. */
  send: (text: string, intent?: IntentId) => void;
};

const clock = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});
let nextId = 1;

function stamp(): string {
  return clock.format(new Date()).toLowerCase();
}

/**
 * Shared client state so any "Call" or "WhatsApp" button on any page opens the same panel, and
 * the chat survives page navigation. The assistant is scripted; nothing leaves the browser.
 */
export const useDentalUI = create<DentalUIState>((set, get) => {
  /** Shows the typing dots, then the bot's replies one after another. */
  function reply(replies: BotReply[]) {
    set({ typing: true });
    let delay = 650;
    replies.forEach((r, index) => {
      window.setTimeout(() => {
        set((s) => ({
          messages: [...s.messages, { ...r, id: nextId++, from: "bot", time: stamp() }],
          typing: index < replies.length - 1,
        }));
      }, delay);
      delay += 900 + Math.min(r.text.length * 4, 900);
    });
  }

  return {
    callNoticeOpen: false,
    chatOpen: false,
    messages: [],
    typing: false,
    openCallNotice: () => set({ callNoticeOpen: true, chatOpen: false }),
    closeCallNotice: () => set({ callNoticeOpen: false }),
    openChat: () => {
      const first = get().messages.length === 0 && !get().typing;
      set({ chatOpen: true, callNoticeOpen: false });
      if (first) reply(GREETING);
    },
    closeChat: () => set({ chatOpen: false }),
    send: (text, intent) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      set((s) => ({
        messages: [...s.messages, { id: nextId++, from: "user", text: trimmed, time: stamp() }],
      }));
      const matched = intent ?? detectIntent(trimmed);
      reply(matched ? replyFor(matched) : FALLBACK);
    },
  };
});

export function chipLabel(intent: IntentId): string {
  return CHIP_LABELS[intent];
}
