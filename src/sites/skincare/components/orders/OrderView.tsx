"use client";

import {
  ArrowRight,
  Ban,
  Check,
  CheckCheck,
  CircleDashed,
  FastForward,
  MessageCircle,
  Package,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { TotalsList } from "@/sites/skincare/components/cart/CartParts";
import CopyCode from "@/sites/skincare/components/CopyCode";
import Dialog from "@/sites/skincare/components/Dialog";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { Container, buttonClass } from "@/sites/skincare/components/ui";
import { SHIPPING } from "@/sites/skincare/data/catalog";
import { productBySlug } from "@/sites/skincare/data/products";
import type { Order, OrderStatus } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useDemoStore, useProducts, useStoreHydrated } from "@/sites/skincare/lib/store";
import { useAddToCart } from "@/sites/skincare/shop/actions";
import { useChat } from "@/sites/skincare/shop/chat";
import {
  canCancel,
  expectedDelivery,
  formatDateTime,
  PAYMENT_LABEL,
  STATUS_FLOW,
  STATUS_HINT,
  STATUS_LABEL,
} from "@/sites/skincare/shop/orders";
import { useShopPrefs } from "@/sites/skincare/shop/prefs";
import { useShopUI } from "@/sites/skincare/shop/ui";

const STEP_ICON: Record<OrderStatus, typeof Check> = {
  placed: ShoppingBag,
  confirmed: CheckCheck,
  packed: Package,
  shipped: Truck,
  "out-for-delivery": Truck,
  delivered: PackageCheck,
  cancelled: Ban,
  returned: RotateCcw,
};

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Want to change the address or items",
  "Delivery date is too late",
  "Found it cheaper elsewhere",
  "Other",
];

/** Order confirmation and tracking for an order saved in this browser (or a sample order). */
export default function OrderView({ id, placed }: { id: string; placed: boolean }) {
  const hydrated = useStoreHydrated();
  const order = useDemoStore((s) => s.orders.find((o) => o.id === id));

  if (!hydrated) {
    return (
      <Container className="py-10" aria-busy="true">
        <div className="h-40 skin-skeleton rounded-3xl" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] [&>*]:min-w-0">
          <div className="h-96 skin-skeleton rounded-3xl" />
          <div className="h-72 skin-skeleton rounded-3xl" />
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-skin-display text-3xl text-skin-ink">We could not find order {id}</h1>
        <p className="mx-auto mt-2 max-w-md text-skin-subtle">
          Orders are saved in the browser they were placed from. Check the ID, or track it with your
          phone number.
        </p>
        <Link href="/skincare/track" className={buttonClass("primary", "md", "mt-6")}>
          Track an order
        </Link>
      </Container>
    );
  }
  return <OrderDetail order={order} placed={placed} />;
}

function OrderDetail({ order, placed }: { order: Order; placed: boolean }) {
  const advance = useDemoStore((s) => s.advanceOrder);
  const setStatus = useDemoStore((s) => s.setOrderStatus);
  const openChat = useChat((s) => s.openChat);
  const whatsapp = useShopPrefs((s) => s.whatsappUpdates);
  const products = useProducts({ includeInactive: true });
  const addToCart = useAddToCart();
  const openPanel = useShopUI((s) => s.open);
  const [cancelling, setCancelling] = useState(false);
  const eta = expectedDelivery(order);
  const first = order.address.name.split(" ")[0];
  const stopped = order.status === "cancelled" || order.status === "returned";
  const currentIndex = STATUS_FLOW.indexOf(order.status);
  const lastFlowIndex = stopped
    ? Math.max(...order.history.map((h) => STATUS_FLOW.indexOf(h.status)))
    : currentIndex;

  const buyAgain = () => {
    let added = false;
    for (const item of order.items) {
      const p = products.find((x) => x.slug === item.slug && x.active);
      if (p && addToCart(p, item.variantId, item.qty, { openCart: false })) added = true;
    }
    // Open the drawer once, after everything is in.
    if (added) openPanel("cart");
  };

  return (
    <Container className="pt-6 pb-16">
      {placed && !stopped ? (
        <section className="relative overflow-hidden rounded-[2rem] bg-skin-forest px-6 py-10 text-white sm:px-10">
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-white/5"
            aria-hidden
          />
          <span className="grid size-14 animate-skin-pop place-items-center rounded-full bg-[#b9d3c4] text-skin-forest">
            <Check className="size-8" strokeWidth={3} aria-hidden />
          </span>
          <h1 className="mt-5 font-skin-display text-3xl leading-tight sm:text-5xl">
            Thank you, {first}! Your order is{" "}
            {order.payment.method === "cod" ? "placed" : "confirmed"}.
          </h1>
          <p className="mt-3 max-w-2xl text-white/80">
            {order.payment.method === "cod"
              ? `Please keep ${formatINR(order.totals.total)} ready for the delivery partner. `
              : `We have received your payment of ${formatINR(order.totals.total)}. `}
            {whatsapp
              ? `Updates are on their way to +91 ${order.address.phone} on WhatsApp.`
              : `A confirmation has been sent to ${order.address.email ?? `+91 ${order.address.phone}`} (demo, nothing is actually sent).`}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pr-1 pl-4 text-sm">
              Order ID
              <CopyCode
                code={order.id}
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              />
            </span>
            {eta ? (
              <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                Arriving by <strong>{eta}</strong>
              </span>
            ) : null}
          </div>
        </section>
      ) : (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-skin-subtle">Placed on {formatDateTime(order.createdAt)}</p>
            <h1 className="mt-1 font-skin-display text-4xl tracking-tight text-skin-ink">
              Order {order.id}
            </h1>
          </div>
          <StatusChip status={order.status} />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8 [&>*]:min-w-0">
        <div className="space-y-6">
          <section
            className="rounded-3xl bg-white p-6 ring-1 ring-skin-line sm:p-8"
            aria-labelledby="track-title"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="track-title" className="font-skin-display text-2xl text-skin-ink">
                Tracking
              </h2>
              {!stopped && eta && order.status !== "delivered" ? (
                <p className="text-sm text-skin-body">
                  Expected by <strong className="text-skin-ink">{eta}</strong>
                </p>
              ) : null}
            </div>
            {order.courier && order.awb ? (
              <p className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-xl bg-skin-sand/70 px-3 py-2 text-sm text-skin-body">
                <Truck className="size-4 text-skin-accent" aria-hidden />
                {order.courier} · AWB <span className="font-mono text-skin-ink">{order.awb}</span>
              </p>
            ) : null}

            <ol className="mt-6">
              {STATUS_FLOW.map((status, i) => {
                const event = order.history.find((h) => h.status === status);
                const done = i <= lastFlowIndex && Boolean(event);
                const current = !stopped && i === currentIndex;
                const Icon = STEP_ICON[status];
                const last = i === STATUS_FLOW.length - 1;
                return (
                  <li key={status} className="relative flex gap-4 pb-7 last:pb-0">
                    {!last ? (
                      <span
                        className={cn(
                          "absolute top-10 bottom-0 left-5 w-0.5 -translate-x-1/2",
                          done && i < lastFlowIndex ? "bg-skin-accent" : "bg-skin-line",
                        )}
                        aria-hidden
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative grid size-10 shrink-0 place-items-center rounded-full transition",
                        current
                          ? "animate-skin-pop bg-skin-accent text-white ring-4 ring-skin-accent-soft"
                          : done
                            ? "bg-skin-accent text-white"
                            : "bg-skin-sand text-skin-subtle",
                      )}
                    >
                      {done || current ? (
                        <Icon className="size-5" aria-hidden />
                      ) : (
                        <CircleDashed className="size-5" aria-hidden />
                      )}
                    </span>
                    <div className="pt-1.5">
                      <p className={cn("font-medium", done ? "text-skin-ink" : "text-skin-subtle")}>
                        {STATUS_LABEL[status]}
                        {current ? <span className="sr-only"> (current step)</span> : null}
                      </p>
                      {event ? (
                        <p className="text-xs text-skin-subtle">{formatDateTime(event.at)}</p>
                      ) : null}
                      {current ? (
                        <p className="mt-1 text-sm text-skin-body">{STATUS_HINT[status]}</p>
                      ) : null}
                      {status === "shipped" && done && order.courier ? (
                        <p className="mt-1 text-sm text-skin-body">
                          With {order.courier}, AWB {order.awb}
                        </p>
                      ) : null}
                      {event?.note ? (
                        <p className="mt-1 text-xs text-skin-subtle">{event.note}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
              {stopped ? (
                <li className="relative mt-7 flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-skin-rose-soft text-skin-rose-ink">
                    <Ban className="size-5" aria-hidden />
                  </span>
                  <div className="pt-1.5">
                    <p className="font-medium text-skin-rose-ink">{STATUS_LABEL[order.status]}</p>
                    {order.history.at(-1)?.note ? (
                      <p className="text-sm text-skin-body">{order.history.at(-1)?.note}</p>
                    ) : null}
                    <p className="text-xs text-skin-subtle">
                      {formatDateTime(order.history.at(-1)!.at)}
                    </p>
                    {order.payment.method !== "cod" ? (
                      <p className="mt-1 text-sm text-skin-body">
                        Refund of {formatINR(order.totals.total)} started to your original payment
                        method. It usually arrives in 5 to 7 working days.
                      </p>
                    ) : null}
                  </div>
                </li>
              ) : null}
            </ol>

            {!stopped && order.status !== "delivered" ? (
              <div className="mt-8 rounded-2xl border-2 border-dashed border-skin-saffron/50 bg-skin-saffron-soft/50 p-5">
                <p className="text-xs font-bold tracking-[0.16em] text-skin-saffron-ink uppercase">
                  Demo control
                </p>
                <p className="mt-1 text-sm text-skin-body">
                  In a live store the courier moves this along automatically. Click to see what your
                  customer sees at each step. The owner dashboard updates too.
                </p>
                <button
                  type="button"
                  onClick={() => advance(order.id)}
                  className={buttonClass("dark", "md", "mt-4")}
                >
                  <FastForward className="size-4" aria-hidden />
                  Move to the next step (demo)
                </button>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {canCancel(order) ? (
                <button
                  type="button"
                  onClick={() => setCancelling(true)}
                  className={buttonClass(
                    "outline",
                    "md",
                    "border-skin-rose/60 text-skin-rose-ink hover:bg-skin-rose hover:text-white",
                  )}
                >
                  Cancel order
                </button>
              ) : null}
              <button type="button" onClick={openChat} className={buttonClass("soft", "md")}>
                <MessageCircle className="size-4" aria-hidden />
                Get help on WhatsApp
              </button>
              {order.status === "delivered" ? (
                <Link href="/skincare/returns" className={buttonClass("ghost", "md")}>
                  Return an item
                </Link>
              ) : null}
            </div>
          </section>

          <section
            className="rounded-3xl bg-white p-6 ring-1 ring-skin-line sm:p-8"
            aria-labelledby="items-title"
          >
            <div className="flex items-center justify-between">
              <h2 id="items-title" className="font-skin-display text-2xl text-skin-ink">
                Items
              </h2>
              <button
                type="button"
                onClick={buyAgain}
                className="text-sm font-medium text-skin-accent hover:underline"
              >
                Buy again
              </button>
            </div>
            <ul className="mt-4 divide-y divide-skin-line">
              {order.items.map((item) => {
                const p = products.find((x) => x.slug === item.slug) ?? productBySlug(item.slug);
                return (
                  <li
                    key={`${item.slug}-${item.variantId}`}
                    className="flex items-center gap-4 py-4"
                  >
                    <span
                      className="w-14 shrink-0 rounded-xl px-1 pt-1"
                      style={{ background: p?.visual.tint ?? "#f1ebe1" }}
                    >
                      {p ? <ProductVisual spec={p.visual} name={p.name} /> : null}
                    </span>
                    <div className="min-w-0 flex-1">
                      {p?.active ? (
                        <Link
                          href={`/skincare/products/${item.slug}`}
                          className="text-sm font-medium text-skin-ink hover:underline"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-skin-ink">{item.name}</p>
                      )}
                      <p className="text-xs text-skin-subtle">
                        {item.size} · Qty {item.qty}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-skin-ink tabular-nums">
                      {formatINR(item.price * item.qty)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <section
            className="rounded-3xl bg-white p-6 ring-1 ring-skin-line"
            aria-labelledby="pay-title"
          >
            <h2 id="pay-title" className="font-skin-display text-2xl text-skin-ink">
              Payment
            </h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-skin-subtle">Method</dt>
                <dd className="text-skin-ink">{PAYMENT_LABEL[order.payment.method]}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-skin-subtle">Status</dt>
                <dd
                  className={cn(
                    "font-medium",
                    order.payment.status === "paid"
                      ? "text-skin-success"
                      : order.payment.status === "refunded"
                        ? "text-skin-rose-ink"
                        : "text-skin-saffron-ink",
                  )}
                >
                  {order.payment.status === "paid"
                    ? "Paid"
                    : order.payment.status === "refunded"
                      ? "Refunded"
                      : "Pay on delivery"}
                </dd>
              </div>
              {order.payment.ref ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-skin-subtle">Reference</dt>
                  <dd className="font-mono text-xs text-skin-ink">{order.payment.ref}</dd>
                </div>
              ) : null}
            </dl>
            <TotalsList totals={order.totals} className="mt-5 border-t border-skin-line pt-5" />
          </section>

          <section
            className="rounded-3xl bg-white p-6 ring-1 ring-skin-line"
            aria-labelledby="addr-title"
          >
            <h2 id="addr-title" className="font-skin-display text-2xl text-skin-ink">
              Delivery address
            </h2>
            <address className="mt-3 text-sm leading-relaxed text-skin-body not-italic">
              <span className="font-medium text-skin-ink">{order.address.name}</span>
              <br />
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""}
              {order.address.landmark ? (
                <>
                  <br />
                  Near {order.address.landmark}
                </>
              ) : null}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
              <br />
              +91 {order.address.phone}
            </address>
          </section>

          <section className="rounded-3xl bg-skin-accent-soft p-6">
            <p className="font-medium text-skin-ink">Easy returns</p>
            <p className="mt-1 text-sm text-skin-body">
              Unopened products can be returned within {SHIPPING.returnDays} days of delivery.{" "}
              <Link href="/skincare/returns" className="font-medium text-skin-ink underline">
                Read the policy
              </Link>
            </p>
          </section>

          <Link href="/skincare/shop" className={buttonClass("primary", "lg", "w-full")}>
            Continue shopping
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </aside>
      </div>

      <CancelDialog
        open={cancelling}
        order={order}
        onClose={() => setCancelling(false)}
        onConfirm={(reason) => {
          setStatus(order.id, "cancelled", `Cancelled by customer: ${reason}`);
          setCancelling(false);
        }}
      />
    </Container>
  );
}

export function StatusChip({ status }: { status: OrderStatus }) {
  const tone =
    status === "delivered"
      ? "bg-skin-success/10 text-skin-success"
      : status === "cancelled" || status === "returned"
        ? "bg-skin-rose-soft text-skin-rose-ink"
        : "bg-skin-accent-soft text-skin-accent";
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", tone)}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function CancelDialog({
  open,
  order,
  onClose,
  onConfirm,
}: {
  open: boolean;
  order: Order;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const titleId = useId();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      side="center"
      labelledBy={titleId}
      className="w-[min(94vw,480px)] rounded-3xl"
    >
      <form
        className="bg-white p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm(reason);
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-skin-display text-2xl text-skin-ink">
            Cancel order {order.id}?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-skin-sand"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <fieldset className="mt-5 space-y-2">
          <legend className="mb-2 text-sm font-medium text-skin-ink">Tell us why</legend>
          {CANCEL_REASONS.map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-skin-line px-4 py-2.5 text-sm text-skin-body has-[:checked]:border-skin-ink has-[:checked]:text-skin-ink"
            >
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
                className="accent-skin-accent"
              />
              {r}
            </label>
          ))}
        </fieldset>
        <p className="mt-4 text-sm text-skin-subtle">
          {order.payment.method === "cod"
            ? "Nothing to refund, as this is a cash on delivery order."
            : `Your ${formatINR(order.totals.total)} will be refunded to your original payment method in 5 to 7 working days.`}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className={buttonClass("ghost", "md")}>
            Keep order
          </button>
          <button
            type="submit"
            className={buttonClass("dark", "md", "bg-skin-rose hover:bg-skin-rose-ink")}
          >
            Cancel order
          </button>
        </div>
      </form>
    </Dialog>
  );
}
