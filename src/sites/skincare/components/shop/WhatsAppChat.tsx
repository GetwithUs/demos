"use client";

import { BadgeCheck, CheckCheck, ExternalLink, Lock, Send, Smile, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { WA } from "@/sites/skincare/content/whatsapp";
import { useDemoStore, useProducts } from "@/sites/skincare/lib/store";
import { useChat, type ChatMessage } from "@/sites/skincare/shop/chat";

/** WhatsApp-style glyph: a speech bubble with a handset (not the real logo). */
function ChatGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M16 3.5A12.4 12.4 0 0 0 5.3 22.2L3.6 28.4l6.4-1.7A12.5 12.5 0 1 0 16 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M11.6 9.6c.4-.4 1-.4 1.3 0l1.6 2.3c.3.4.2.9-.1 1.2l-.9.9c.7 1.6 2 2.9 3.6 3.6l.9-.9c.3-.3.8-.4 1.2-.1l2.3 1.6c.4.3.5.9.1 1.3l-1 1.1c-.6.6-1.5.8-2.3.5-3.6-1.3-6.4-4.1-7.7-7.7-.3-.8-.1-1.7.5-2.3l.5-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Floating WhatsApp button and a mock WhatsApp Business chat with an automated assistant. */
export default function WhatsAppChat() {
  const pathname = usePathname();
  const open = useChat((s) => s.open);
  const unread = useChat((s) => s.unread);
  const openChat = useChat((s) => s.openChat);
  const fab = useRef<HTMLButtonElement>(null);

  // New order updates light up the badge on the button.
  useEffect(
    () =>
      useDemoStore.subscribe((s, prev) => {
        if (s.orders !== prev.orders) useChat.getState().refreshUnread();
      }),
    [],
  );

  if (pathname.startsWith("/skincare/checkout")) return null;

  return (
    <>
      {!open ? (
        <button
          ref={fab}
          type="button"
          onClick={openChat}
          className="skin-wa-fab group fixed right-4 z-40 flex items-center gap-2 rounded-full bg-skin-wa p-3.5 text-white shadow-[0_10px_30px_-8px_rgba(18,140,70,0.6)] transition hover:scale-105 sm:right-6"
          aria-label={`Chat with us on WhatsApp${unread ? `, ${unread} new ${unread === 1 ? "update" : "updates"}` : ""}`}
        >
          <ChatGlyph className="size-7" />
          <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-white px-3 py-1.5 text-xs font-medium whitespace-nowrap text-skin-ink shadow-md group-hover:block group-focus-visible:block">
            Chat with us
          </span>
          {unread ? (
            <span
              className="absolute -top-1 -right-1 grid size-5 animate-skin-pop place-items-center rounded-full bg-skin-rose text-[0.68rem] font-bold"
              aria-hidden
            >
              {unread}
            </span>
          ) : null}
        </button>
      ) : (
        <ChatPanel onClosed={() => requestAnimationFrame(() => fab.current?.focus())} />
      )}
    </>
  );
}

function ChatPanel({ onClosed }: { onClosed: () => void }) {
  const products = useProducts();
  const messages = useChat((s) => s.messages);
  const typing = useChat((s) => s.typing);
  const closeChat = useChat((s) => s.closeChat);
  const send = useChat((s) => s.send);
  const pick = useChat((s) => s.pick);
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const lastWithReplies = [...messages]
    .reverse()
    .find((m) => m.from === "bot" && m.replies?.length)?.id;
  const lastId = messages[messages.length - 1]?.id;

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, typing]);

  const close = () => {
    closeChat();
    onClosed();
  };

  return (
    <section
      role="dialog"
      aria-labelledby={titleId}
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
      className="fixed inset-x-0 bottom-0 z-50 flex h-[88dvh] animate-skin-fade-up flex-col overflow-hidden rounded-t-2xl bg-skin-wa-chat shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[620px] sm:max-h-[calc(100dvh-3rem)] sm:w-[390px] sm:rounded-2xl"
    >
      <header className="flex items-center gap-3 bg-skin-wa-head px-3 py-2.5 text-white">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#fbf8f3]">
          <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
            <circle cx="16" cy="16" r="15" fill="#2f5d50" />
            <path
              d="M16 7.5c3.6 4.3 6 7.6 6 10.6a6 6 0 0 1-12 0c0-3 2.4-6.3 6-10.6Z"
              fill="#fbf8f3"
            />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="flex items-center gap-1 text-[0.95rem] font-semibold">
            {WA.name}
            <BadgeCheck
              className="size-4 fill-[#25d366] text-skin-wa-head"
              aria-label="Verified business"
            />
          </h2>
          <p className="truncate text-xs text-white/80">{WA.status}</p>
        </div>
        <button
          type="button"
          onClick={close}
          className="grid size-9 place-items-center rounded-full hover:bg-white/10"
          aria-label="Close chat"
        >
          <X className="size-5" aria-hidden />
        </button>
      </header>

      <div
        ref={scroller}
        className="flex-1 space-y-2 overflow-y-auto px-3 py-3"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(0,0,0,0.035) 1.5px, transparent 1.6px), radial-gradient(circle at 70% 60%, rgba(0,0,0,0.03) 1.2px, transparent 1.3px)",
          backgroundSize: "26px 26px, 34px 34px",
        }}
        aria-live="polite"
      >
        <p className="mx-auto w-fit rounded-md bg-white/90 px-2.5 py-1 text-[0.7rem] font-medium text-[#54656f] shadow-sm">
          Today
        </p>
        <p className="mx-auto flex max-w-[90%] items-start gap-1.5 rounded-md bg-[#fdf4c5] px-3 py-1.5 text-center text-[0.72rem] leading-snug text-[#54656f]">
          <Lock className="mt-0.5 size-3 shrink-0" aria-hidden />
          {WA.notice}
        </p>
        {messages.map((m) => (
          <Bubble
            key={m.id}
            message={m}
            showReplies={m.id === lastWithReplies}
            isLast={m.id === lastId}
            onPick={(r) => pick(r, { products })}
            onNavigate={close}
          />
        ))}
        {typing ? (
          <div
            className="w-fit rounded-lg rounded-tl-none bg-white px-3.5 py-2.5 shadow-sm"
            aria-label="Oruvi Skin is typing"
          >
            <span className="flex gap-1" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-skin-typing rounded-full bg-[#8696a0]"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </span>
          </div>
        ) : null}
      </div>

      <form
        className="flex items-center gap-2 bg-[#f0f2f5] px-2.5 py-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(text, { products });
          setText("");
        }}
      >
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full bg-white px-3">
          <Smile className="size-5 shrink-0 text-[#8696a0]" aria-hidden />
          <label className="sr-only" htmlFor={`${titleId}-input`}>
            Message
          </label>
          <input
            id={`${titleId}-input`}
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-[0.92rem] text-[#111b21] outline-none placeholder:text-[#8696a0]"
          />
        </div>
        <button
          type="submit"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-[#00a884] text-white transition hover:bg-[#008f72] disabled:opacity-60"
          disabled={!text.trim()}
          aria-label="Send"
        >
          <Send className="size-5" aria-hidden />
        </button>
      </form>
    </section>
  );
}

function Bubble({
  message,
  showReplies,
  isLast,
  onPick,
  onNavigate,
}: {
  message: ChatMessage;
  showReplies: boolean;
  isLast: boolean;
  onPick: (r: NonNullable<ChatMessage["replies"]>[number]) => void;
  onNavigate: () => void;
}) {
  const mine = message.from === "user";
  return (
    <div
      className={cn(
        "flex flex-col",
        mine ? "items-end" : "items-start",
        isLast && "animate-skin-fade-in",
      )}
    >
      <div
        className={cn(
          "relative max-w-[85%] rounded-lg px-2.5 pt-1.5 pb-1 text-[0.9rem] leading-snug text-[#111b21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]",
          mine ? "rounded-tr-none bg-skin-wa-out" : "rounded-tl-none bg-white",
        )}
      >
        {message.template ? (
          <p className="mb-0.5 text-[0.72rem] font-semibold text-skin-wa-ink">{message.template}</p>
        ) : null}
        <p className={cn("whitespace-pre-line", mine ? "pr-[4.6rem]" : "pr-14")}>{message.text}</p>
        <p className="absolute right-2 bottom-1 flex items-center gap-0.5 text-[0.65rem] text-[#667781]">
          {message.time}
          {mine ? <CheckCheck className="size-3.5 text-[#53bdeb]" aria-label="Read" /> : null}
        </p>
        {message.links?.length ? (
          <div className="-mx-2.5 mt-1.5 border-t border-[#e9edef]">
            {message.links.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={onNavigate}
                className="flex items-center justify-center gap-1.5 border-b border-[#e9edef] py-2 text-[0.85rem] font-medium text-[#008069] last:border-b-0 hover:bg-[#f5f6f6]"
              >
                <ExternalLink className="size-3.5" aria-hidden />
                {l.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      {showReplies && message.replies ? (
        <div className="mt-1.5 flex w-[85%] flex-col gap-1.5">
          {message.replies.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => onPick(r)}
              className="rounded-lg bg-white py-2 text-[0.85rem] font-medium text-[#008069] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] transition hover:bg-[#f5f6f6]"
            >
              {r.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
