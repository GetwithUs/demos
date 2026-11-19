"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CheckCheck,
  Lock,
  SendHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LogoMark, WhatsAppIcon } from "@/sites/dental-clinic/components/icons";
import { CLINIC } from "@/sites/dental-clinic/content/clinic";
import type { ChatLink } from "@/sites/dental-clinic/content/whatsapp";
import { chipLabel, useDentalUI, type ChatMessage } from "@/sites/dental-clinic/lib/ui-store";

/** Renders WhatsApp-style *bold* and _italic_ text. */
function Formatted({ text }: { text: string }) {
  const parts = text.split(/(\*[^*\n]+\*|_[^_\n]+_)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(1, -1)}
            </strong>
          );
        }
        if (part.length > 2 && part.startsWith("_") && part.endsWith("_")) {
          return (
            <em key={i} className="text-[#54656f]">
              {part.slice(1, -1)}
            </em>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

function MessageLink({ link, onNavigate }: { link: ChatLink; onNavigate: () => void }) {
  const external = link.href.startsWith("http");
  const className =
    "flex items-center justify-center gap-1.5 border-t border-black/5 px-3 py-2.5 text-[0.875rem] font-medium text-dental-wa-teal transition-colors hover:bg-black/[0.03] focus-visible:outline-offset-[-2px]";
  if (external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        <ArrowUpRight aria-hidden="true" className="size-4" />
        {link.label}
        <span className="sr-only">(opens Google Maps in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={link.href} onClick={onNavigate} className={className}>
      <ArrowUpRight aria-hidden="true" className="size-4" />
      {link.label}
    </Link>
  );
}

function Bubble({
  message,
  showChips,
  onChip,
  onNavigate,
}: {
  message: ChatMessage;
  showChips: boolean;
  onChip: (intent: NonNullable<ChatMessage["chips"]>[number]) => void;
  onNavigate: () => void;
}) {
  const mine = message.from === "user";
  return (
    <li className={cn("flex animate-dental-pop flex-col", mine ? "items-end" : "items-start")}>
      <div
        className={cn(
          "relative max-w-[85%] rounded-lg text-[0.9375rem] leading-snug text-[#111b21] shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]",
          mine ? "rounded-tr-none bg-dental-wa-bubble" : "rounded-tl-none bg-white",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0 size-2.5",
            mine
              ? "-right-2 bg-dental-wa-bubble [clip-path:polygon(0_0,100%_0,0_100%)]"
              : "-left-2 bg-white [clip-path:polygon(0_0,100%_0,100%_100%)]",
          )}
        />
        <p className="px-2.5 pt-1.5 pb-0.5 whitespace-pre-line">
          <span className="sr-only">{mine ? "You: " : `${CLINIC.shortName}: `}</span>
          <Formatted text={message.text} />
        </p>
        <p className="flex items-center justify-end gap-1 px-2 pb-1 text-[0.6875rem] text-[#667781]">
          {message.time}
          {mine ? (
            <CheckCheck aria-label="Read" className="size-3.5 text-[#53bdeb]" strokeWidth={2} />
          ) : null}
        </p>
        {message.links?.length ? (
          <div className="flex flex-col">
            {message.links.map((link) => (
              <MessageLink key={link.href + link.label} link={link} onNavigate={onNavigate} />
            ))}
          </div>
        ) : null}
      </div>
      {showChips && message.chips?.length ? (
        <div className="mt-1.5 flex max-w-[85%] flex-wrap gap-1.5">
          {message.chips.map((intent) => (
            <button
              key={intent}
              type="button"
              onClick={() => onChip(intent)}
              className="rounded-full border border-dental-wa-teal/25 bg-white px-3.5 py-1.5 text-[0.8125rem] font-medium text-dental-wa-teal shadow-[0_1px_0.5px_rgb(11_20_26/0.1)] transition-colors hover:bg-[#f0faf7] focus-visible:outline-dental-wa-teal"
            >
              {chipLabel(intent)}
            </button>
          ))}
        </div>
      ) : null}
    </li>
  );
}

/**
 * A floating WhatsApp-style button and a realistic mock chat with the studio's automated
 * assistant. It shows clients what a WhatsApp bot can do; no message is sent anywhere.
 */
export default function WhatsAppWidget() {
  const chatOpen = useDentalUI((s) => s.chatOpen);
  const messages = useDentalUI((s) => s.messages);
  const typing = useDentalUI((s) => s.typing);
  const openChat = useDentalUI((s) => s.openChat);
  const closeChat = useDentalUI((s) => s.closeChat);
  const send = useDentalUI((s) => s.send);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLOListElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (chatOpen) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      inputRef.current?.focus({ preventScroll: true });
    } else if (restoreRef.current) {
      restoreRef.current.focus({ preventScroll: true });
      restoreRef.current = null;
    }
  }, [chatOpen]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing, chatOpen]);

  const lastBotId = [...messages].reverse().find((m) => m.from === "bot")?.id;
  const lastIsBot = messages.at(-1)?.from === "bot";
  const hasStarted = messages.length > 0;

  return (
    <>
      {/* Floating launcher, on tablets and desktops. Phones use the sticky action bar. */}
      <div
        className={cn(
          "fixed right-6 bottom-6 z-40 hidden items-center gap-3 md:flex",
          chatOpen && "md:hidden",
        )}
      >
        {!hasStarted ? (
          <p
            aria-hidden="true"
            className="animate-dental-rise rounded-2xl rounded-br-sm bg-dental-paper px-4 py-2.5 text-[0.875rem] text-dental-ink shadow-dental-lift [animation-delay:1.2s]"
          >
            Questions? <span className="font-semibold">Chat with us</span>
          </p>
        ) : null}
        <button
          type="button"
          onClick={openChat}
          aria-haspopup="dialog"
          className="group relative grid size-15 place-items-center rounded-full bg-dental-wa text-white shadow-[0_14px_30px_-10px_rgb(7_94_84/0.7)] transition-transform duration-300 ease-dental hover:scale-105 focus-visible:outline-dental-wa-deep"
        >
          <span className="sr-only">Chat with {CLINIC.name} on WhatsApp (demo)</span>
          <WhatsAppIcon className="size-8" />
          {!hasStarted ? (
            <span
              aria-hidden="true"
              className="absolute -top-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-dental-coral text-[0.6875rem] font-bold ring-2 ring-dental-ivory"
            >
              1
            </span>
          ) : null}
        </button>
      </div>

      {chatOpen ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby="dental-chat-title"
          onKeyDown={(event) => {
            if (event.key === "Escape") closeChat();
          }}
          className="fixed inset-0 z-[60] flex animate-dental-pop flex-col overflow-hidden bg-dental-wa-chat sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(640px,calc(100dvh-3rem))] sm:w-[380px] sm:rounded-[1.25rem] sm:shadow-dental-float"
        >
          <header className="flex items-center gap-3 bg-dental-wa-deep px-3 py-2.5 text-white">
            <button
              type="button"
              onClick={closeChat}
              className="grid size-9 place-items-center rounded-full hover:bg-white/10 focus-visible:outline-white sm:hidden"
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
              <span className="sr-only">Close chat</span>
            </button>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-dental-ivory">
              <LogoMark className="h-6 w-auto" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="dental-chat-title" className="flex items-center gap-1 font-semibold">
                <span className="truncate">{CLINIC.name}</span>
                <BadgeCheck
                  aria-label="Verified business"
                  className="size-4 shrink-0 fill-dental-wa text-dental-wa-deep"
                />
              </h2>
              <p className="text-[0.75rem] text-white/80">
                {typing ? "typing..." : "Business account, replies instantly"}
              </p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              className="hidden size-9 place-items-center rounded-full hover:bg-white/10 focus-visible:outline-white sm:grid"
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">Close chat</span>
            </button>
          </header>

          <ol
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
            className="dental-wa-wallpaper flex flex-1 flex-col gap-2 overflow-y-auto overscroll-contain px-4 py-3"
          >
            <li className="mx-auto rounded-md bg-white/90 px-2.5 py-1 text-[0.75rem] text-[#54656f] shadow-[0_1px_0.5px_rgb(11_20_26/0.1)]">
              Today
            </li>
            <li className="mx-auto max-w-[92%] rounded-md bg-[#ffeecd] px-3 py-1.5 text-center text-[0.75rem] leading-snug text-[#54656f]">
              <Lock aria-hidden="true" className="mr-1 inline size-3 align-[-1px]" />
              Demo chat with an automated assistant. Messages stay in your browser and nothing is
              sent to anyone.
            </li>
            {messages.map((message) => (
              <Bubble
                key={message.id}
                message={message}
                showChips={message.id === lastBotId && lastIsBot && !typing}
                onChip={(intent) => send(chipLabel(intent), intent)}
                onNavigate={closeChat}
              />
            ))}
            {typing ? (
              <li className="flex">
                <span className="flex gap-1 rounded-lg rounded-tl-none bg-white px-3.5 py-3 shadow-[0_1px_0.5px_rgb(11_20_26/0.13)]">
                  <span className="sr-only">The assistant is typing</span>
                  <span
                    aria-hidden="true"
                    className="dental-typing-dot size-1.5 rounded-full bg-[#8696a0]"
                  />
                  <span
                    aria-hidden="true"
                    className="dental-typing-dot size-1.5 rounded-full bg-[#8696a0]"
                  />
                  <span
                    aria-hidden="true"
                    className="dental-typing-dot size-1.5 rounded-full bg-[#8696a0]"
                  />
                </span>
              </li>
            ) : null}
          </ol>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
              setDraft("");
            }}
            className="flex items-center gap-2 bg-dental-wa-chat px-2.5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
          >
            <label htmlFor="dental-chat-input" className="sr-only">
              Type a message
            </label>
            <input
              ref={inputRef}
              id="dental-chat-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message"
              autoComplete="off"
              maxLength={300}
              className="h-11 min-w-0 flex-1 rounded-full bg-white px-4 text-[0.9375rem] text-[#111b21] shadow-[0_1px_0.5px_rgb(11_20_26/0.1)] placeholder:text-[#667781] focus-visible:outline-2 focus-visible:outline-dental-wa-teal"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-dental-wa-teal text-white transition-opacity focus-visible:outline-dental-wa-deep disabled:opacity-60"
            >
              <SendHorizontal aria-hidden="true" className="size-5" />
              <span className="sr-only">Send</span>
            </button>
          </form>
        </section>
      ) : null}
    </>
  );
}
