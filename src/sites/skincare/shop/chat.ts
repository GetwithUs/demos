"use client";

import { create } from "zustand";
import type { ConcernId, Order, Product } from "@/sites/skincare/data/types";
import { WA, WA_CONCERNS, WA_MENU, WA_STATUS } from "@/sites/skincare/content/whatsapp";
import { checkPincode } from "@/sites/skincare/lib/pincode";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useDemoStore } from "@/sites/skincare/lib/store";
import { defaultVariant } from "@/sites/skincare/shop/catalog";
import {
  expectedDelivery,
  latestVisitorOrder,
  normaliseOrderId,
  STATUS_LABEL,
  formatTime,
} from "@/sites/skincare/shop/orders";
import { useShopUI } from "@/sites/skincare/shop/ui";

export type ChatAction =
  | { type: "menu" | "track" | "track-other" | "choose" | "offers" | "delivery" | "expert" }
  | { type: "concern"; id: ConcernId }
  | { type: "cod-confirm" | "cod-cancel"; orderId: string };

export type ChatReply = { label: string; action: ChatAction };

export type ChatMessage = {
  id: number;
  from: "bot" | "user";
  text: string;
  time: string;
  /** Order update template (shown with a small header, as WhatsApp business templates are). */
  template?: string;
  links?: { label: string; href: string }[];
  replies?: ChatReply[];
};

type Mode = "idle" | "order-id" | "pincode" | "expert";

/** Live context the bot needs from React (the catalogue with the owner's edits). */
export type ChatContext = { products: Product[] };

type ChatState = {
  open: boolean;
  messages: ChatMessage[];
  typing: boolean;
  mode: Mode;
  /** "ORV-12345:shipped" keys already sent as order updates. */
  announced: string[];
  /** Order updates the shopper has not opened the chat to see yet. */
  unread: number;
  openChat: () => void;
  closeChat: () => void;
  send: (text: string, ctx: ChatContext) => void;
  pick: (reply: ChatReply, ctx: ChatContext) => void;
  /** Counts new order updates for the button badge, without opening the chat. */
  refreshUnread: () => void;
};

let nextId = 1;
const menuReplies: ChatReply[] = WA_MENU.map((m) => ({
  label: m.label,
  action: { type: m.action },
}));
const now = () => formatTime(new Date());

function bot(text: string, extra: Partial<ChatMessage> = {}): ChatMessage {
  return { id: nextId++, from: "bot", text, time: now(), ...extra };
}

function orderSummary(order: Order): ChatMessage {
  const lines = [
    `Order ${order.id}: ${STATUS_LABEL[order.status]}`,
    `${order.items.reduce((n, i) => n + i.qty, 0)} items, ${formatINR(order.totals.total)}`,
  ];
  if (order.courier && order.awb) lines.push(`${order.courier}, AWB ${order.awb}`);
  const eta = expectedDelivery(order);
  if (eta && !["delivered", "cancelled", "returned"].includes(order.status))
    lines.push(`Expected by ${eta}`);
  return bot(lines.join("\n"), {
    links: [{ label: "View order and tracking", href: `/skincare/orders/${order.id}` }],
  });
}

/** Order update templates for the latest order that have not been shown yet. */
function pendingUpdates(announced: string[]): { messages: ChatMessage[]; keys: string[] } {
  const order = latestVisitorOrder(useDemoStore.getState().orders);
  if (!order) return { messages: [], keys: [] };
  const first = order.address.name.split(" ")[0] || "there";
  const messages: ChatMessage[] = [];
  const keys: string[] = [];
  for (const event of order.history) {
    const key = `${order.id}:${event.status}`;
    const template = WA_STATUS[event.status];
    if (announced.includes(key) || !template) continue;
    keys.push(key);
    let text = template(first, order.id);
    if (event.status === "shipped" && order.courier)
      text += ` Courier: ${order.courier}, AWB ${order.awb}.`;
    const isCodPrompt =
      event.status === "placed" && order.payment.method === "cod" && order.status === "placed";
    messages.push(
      bot(text, {
        template: "Order update",
        links: [{ label: "Track order", href: `/skincare/orders/${order.id}` }],
      }),
    );
    if (isCodPrompt) {
      messages.push(
        bot(WA.codConfirmAsk(order.id, formatINR(order.totals.total)), {
          template: "Confirm COD order",
          replies: [
            { label: "Confirm order", action: { type: "cod-confirm", orderId: order.id } },
            { label: "Cancel order", action: { type: "cod-cancel", orderId: order.id } },
          ],
        }),
      );
    }
  }
  return { messages, keys };
}

const timers = new Set<ReturnType<typeof setTimeout>>();

export const useChat = create<ChatState>((set, get) => {
  /** Shows "typing..." then the bot's reply, as a real chat would. */
  const reply = (messages: ChatMessage[], delay = 750) => {
    set({ typing: true });
    const t = setTimeout(() => {
      timers.delete(t);
      set((s) => ({
        typing: false,
        messages: [...s.messages, ...messages.map((m) => ({ ...m, time: now() }))],
      }));
    }, delay);
    timers.add(t);
  };

  const recommend = (id: ConcernId, ctx: ChatContext) => {
    const pick = WA_CONCERNS.find((c) => c.id === id);
    const product = ctx.products.find((p) => p.slug === pick?.slug);
    if (!pick || !product) {
      reply([
        bot(WA.chooseOutro, {
          links: [{ label: "Take the skin quiz", href: "/skincare/skin-quiz" }],
          replies: menuReplies,
        }),
      ]);
      return;
    }
    const v = defaultVariant(product);
    reply([
      bot(
        `For ${pick.label.toLowerCase()}, most people start with our ${product.name} (${v.size}, ${formatINR(v.price)}). ${product.tagline}.`,
        {
          links: [
            { label: "View product", href: `/skincare/products/${product.slug}` },
            {
              label: `Shop for ${pick.label.toLowerCase()}`,
              href: `/skincare/concerns/${pick.id}`,
            },
          ],
        },
      ),
      bot(WA.chooseOutro, {
        links: [{ label: "Take the skin quiz", href: "/skincare/skin-quiz" }],
        replies: menuReplies,
      }),
    ]);
  };

  const handle = (action: ChatAction, ctx: ChatContext) => {
    const store = useDemoStore.getState();
    switch (action.type) {
      case "menu":
        reply([bot(WA.menuPrompt, { replies: menuReplies })]);
        break;
      case "track": {
        const order = latestVisitorOrder(store.orders);
        if (order) {
          reply([
            orderSummary(order),
            bot("Want to check a different order?", {
              replies: [
                { label: "Track another order", action: { type: "track-other" } },
                { label: "Main menu", action: { type: "menu" } },
              ],
            }),
          ]);
        } else {
          set({ mode: "order-id" });
          reply([bot(`${WA.noOrders} ${WA.askOrderId}`)]);
        }
        break;
      }
      case "track-other":
        set({ mode: "order-id" });
        reply([bot(WA.askOrderId)]);
        break;
      case "choose":
        reply([
          bot(WA.chooseIntro, {
            replies: WA_CONCERNS.map((c) => ({
              label: c.label,
              action: { type: "concern", id: c.id },
            })),
          }),
        ]);
        break;
      case "concern":
        recommend(action.id, ctx);
        break;
      case "offers":
        reply([
          bot(WA.offers, {
            links: [{ label: "Shop bestsellers", href: "/skincare/shop?collection=bestsellers" }],
            replies: menuReplies,
          }),
        ]);
        break;
      case "delivery":
        set({ mode: "pincode" });
        reply([bot(`${WA.codInfo}\n\n${WA.askPincode}`)]);
        break;
      case "expert":
        set({ mode: "expert" });
        reply([bot(WA.expertConnecting)], 600);
        {
          const t = setTimeout(() => {
            timers.delete(t);
            reply([bot(WA.expertHello, { template: "Neha, skin expert" })], 1200);
          }, 700);
          timers.add(t);
        }
        break;
      case "cod-confirm":
      case "cod-cancel": {
        const order = store.orders.find((o) => o.id === action.orderId);
        if (!order || order.status !== "placed") {
          reply([
            bot(
              order
                ? `${order.id} is already ${STATUS_LABEL[order.status].toLowerCase()}.`
                : "I could not find that order.",
              { replies: menuReplies },
            ),
          ]);
          break;
        }
        const confirm = action.type === "cod-confirm";
        store.setOrderStatus(
          order.id,
          confirm ? "confirmed" : "cancelled",
          confirm ? "Confirmed on WhatsApp" : "Cancelled on WhatsApp",
        );
        set((s) => ({
          announced: [...s.announced, `${order.id}:${confirm ? "confirmed" : "cancelled"}`],
        }));
        reply([
          bot(confirm ? WA.codConfirmed(order.id) : WA.codCancelled(order.id), {
            links: [{ label: "View order", href: `/skincare/orders/${order.id}` }],
            replies: menuReplies,
          }),
        ]);
        break;
      }
    }
  };

  const understand = (text: string, ctx: ChatContext) => {
    const t = text.toLowerCase();
    const { mode } = get();
    const store = useDemoStore.getState();

    const idMatch =
      t.match(/orv[\s-]*(\d{5})/) ?? (mode === "order-id" ? t.match(/(\d{5})/) : null);
    if (idMatch) {
      set({ mode: "idle" });
      const id = normaliseOrderId(idMatch[1]);
      const order = store.orders.find((o) => o.id === id);
      reply(
        order
          ? [orderSummary(order), bot(WA.menuPrompt, { replies: menuReplies })]
          : [
              bot(`I could not find ${id}. Please check the ID in your order confirmation.`, {
                replies: menuReplies,
              }),
            ],
      );
      return;
    }
    const pin = t.match(/\b(\d{6})\b/);
    if (pin) {
      set({ mode: "idle" });
      const r = checkPincode(pin[1]);
      reply([
        bot(
          r.ok
            ? `${r.city ? `${r.city}, ${r.state}` : `Pincode ${pin[1]}`}: ${r.message}.${r.cod ? " Cash on delivery is available." : ""}`
            : r.message,
          { replies: menuReplies },
        ),
      ]);
      return;
    }
    if (mode === "order-id") {
      reply([bot("That does not look like an order ID. It looks like ORV-41207.")]);
      return;
    }
    if (mode === "pincode") {
      reply([bot("Please send a 6 digit pincode, for example 248001.")]);
      return;
    }
    if (mode === "expert") {
      set({ mode: "idle" });
      reply(
        [
          bot(WA.expertFollow, {
            template: "Neha, skin expert",
            links: [{ label: "Take the skin quiz", href: "/skincare/skin-quiz" }],
            replies: menuReplies,
          }),
        ],
        1400,
      );
      return;
    }

    // Short words must match a whole word ("ok" should not match "look"); longer ones a word start.
    const tokens = t.split(/[^a-z0-9]+/).filter(Boolean);
    const has = (...words: string[]) =>
      words.some((w) =>
        w.includes(" ")
          ? t.includes(w)
          : tokens.some((tok) => (w.length <= 3 ? tok === w : tok.startsWith(w))),
      );
    if (has("track", "where is", "status", "my order", "order"))
      return handle({ type: "track" }, ctx);
    if (has("offer", "coupon", "code", "discount", "sale")) return handle({ type: "offers" }, ctx);
    if (has("return", "refund", "exchange", "damaged", "broken")) {
      reply([
        bot(WA.returns, {
          links: [{ label: "Returns policy", href: "/skincare/returns" }],
          replies: menuReplies,
        }),
      ]);
      return;
    }
    if (has("cod", "cash", "deliver", "shipping", "pincode"))
      return handle({ type: "delivery" }, ctx);
    if (has("expert", "doctor", "derma", "human", "agent", "person", "call"))
      return handle({ type: "expert" }, ctx);
    if (has("acne", "pimple", "breakout")) return recommend("acne", ctx);
    if (has("spot", "tan", "pigment", "dark", "marks")) return recommend("pigmentation", ctx);
    if (has("dull", "glow", "bright")) return recommend("dullness", ctx);
    if (has("dry", "flaky", "tight")) return recommend("dryness", ctx);
    if (has("oily", "oil", "pore")) return recommend("oiliness", ctx);
    if (has("wrinkle", "line", "ageing", "aging", "retinol")) return recommend("ageing", ctx);
    if (has("quiz", "routine", "choose", "suggest", "recommend"))
      return handle({ type: "choose" }, ctx);
    if (has("thank", "thanks", "ok", "great")) {
      reply([bot(WA.thanks, { replies: menuReplies })]);
      return;
    }
    if (has("hi", "hello", "hey", "namaste")) {
      reply([bot(WA.greeting, { replies: menuReplies })]);
      return;
    }
    reply([bot(WA.fallback, { replies: menuReplies })]);
  };

  return {
    open: false,
    messages: [],
    typing: false,
    mode: "idle",
    announced: [],
    unread: 0,

    openChat: () => {
      useShopUI.getState().close();
      const s = get();
      const updates = pendingUpdates(s.announced);
      const greeting = s.messages.length ? [] : [bot(WA.greeting, { replies: menuReplies })];
      set({
        open: true,
        unread: 0,
        messages: [...s.messages, ...greeting, ...updates.messages],
        announced: [...s.announced, ...updates.keys],
      });
    },
    closeChat: () => set({ open: false }),
    send: (text, ctx) => {
      const clean = text.trim().slice(0, 300);
      if (!clean) return;
      set((s) => ({
        messages: [...s.messages, { id: nextId++, from: "user", text: clean, time: now() }],
      }));
      understand(clean, ctx);
    },
    pick: (r, ctx) => {
      set((s) => ({
        messages: [...s.messages, { id: nextId++, from: "user", text: r.label, time: now() }],
      }));
      handle(r.action, ctx);
    },
    refreshUnread: () => {
      if (get().open) return;
      set({ unread: pendingUpdates(get().announced).keys.length });
    },
  };
});
