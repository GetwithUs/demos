"use client";

import { ArrowRight, PackageSearch } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusChip } from "@/sites/skincare/components/orders/OrderView";
import { buttonClass } from "@/sites/skincare/components/ui";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useDemoStore, useStoreHydrated } from "@/sites/skincare/lib/store";
import { formatDate, normaliseOrderId } from "@/sites/skincare/shop/orders";

/** Look up an order by ID and the phone number it was placed with. */
export default function TrackForm() {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const orders = useDemoStore((s) => s.orders);
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const mine = hydrated ? orders.filter((o) => o.source === "visitor").slice(0, 5) : [];
  const sample = hydrated
    ? (orders.find((o) => o.source === "seed" && o.status === "shipped") ??
      orders.find((o) => o.source === "seed"))
    : undefined;

  const submit = () => {
    const orderId = normaliseOrderId(id);
    if (!orderId) {
      setError("Enter your order ID. It looks like ORV-41207.");
      return;
    }
    const order = orders.find((o) => o.id === orderId);
    const digits = phone.replace(/\D/g, "");
    if (!order) {
      setError(`We could not find ${orderId}. Check the ID in your confirmation message.`);
      return;
    }
    if (digits.length < 10) {
      setError("Enter the 10-digit mobile number used for the order.");
      return;
    }
    // Sample orders store masked numbers, so the last two digits are what can be checked.
    if (digits.slice(-2) !== order.address.phone.replace(/\D/g, "").slice(-2)) {
      setError("That mobile number does not match this order.");
      return;
    }
    router.push(`/skincare/orders/${order.id}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] [&>*]:min-w-0">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="rounded-3xl bg-white p-6 ring-1 ring-skin-line sm:p-8"
      >
        <span className="grid size-12 place-items-center rounded-full bg-skin-accent-soft text-skin-accent">
          <PackageSearch className="size-6" aria-hidden />
        </span>
        <h2 className="mt-4 font-skin-display text-2xl text-skin-ink">Find your order</h2>
        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="track-id" className="text-sm font-medium text-skin-ink">
              Order ID
            </label>
            <input
              id="track-id"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setError("");
              }}
              placeholder="ORV-41207"
              autoComplete="off"
              className="mt-1.5 h-12 w-full rounded-xl border border-skin-line bg-skin-bg px-4 uppercase placeholder:normal-case focus:border-skin-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-accent/25"
            />
          </div>
          <div>
            <label htmlFor="track-phone" className="text-sm font-medium text-skin-ink">
              Mobile number used for the order
            </label>
            <input
              id="track-phone"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/[^\d ]/g, ""));
                setError("");
              }}
              placeholder="98765 43210"
              autoComplete="tel-national"
              className="mt-1.5 h-12 w-full rounded-xl border border-skin-line bg-skin-bg px-4 focus:border-skin-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-accent/25"
            />
          </div>
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-sm text-skin-danger">
            {error}
          </p>
        ) : null}
        <button type="submit" className={buttonClass("primary", "lg", "mt-6 w-full")}>
          Track order
        </button>
        {sample ? (
          <p className="mt-4 text-xs text-skin-subtle">
            Demo: try sample order <strong className="text-skin-ink">{sample.id}</strong> with any
            number ending in{" "}
            <strong className="text-skin-ink">{sample.address.phone.slice(-2)}</strong>.
          </p>
        ) : null}
      </form>

      <div>
        <h2 className="font-skin-display text-2xl text-skin-ink">Orders from this browser</h2>
        {mine.length ? (
          <ul className="mt-4 space-y-3">
            {mine.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/skincare/orders/${o.id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-skin-line transition hover:ring-skin-ink/40"
                >
                  <span>
                    <span className="block font-medium text-skin-ink">{o.id}</span>
                    <span className="text-xs text-skin-subtle">
                      {formatDate(o.createdAt)} · {formatINR(o.totals.total)}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <StatusChip status={o.status} />
                    <ArrowRight className="size-4 text-skin-subtle" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-skin-subtle">
            {hydrated ? "No orders yet. Orders you place on this demo show up here." : "Loading..."}
          </p>
        )}
        <div className="mt-8 rounded-3xl bg-skin-accent-soft p-6 text-sm text-skin-body">
          <p className="font-medium text-skin-ink">Updates on WhatsApp</p>
          <p className="mt-1">
            Every order gets a WhatsApp message when it is confirmed, shipped (with the AWB number)
            and out for delivery. Tap the green chat button to see them.
          </p>
        </div>
      </div>
    </div>
  );
}
