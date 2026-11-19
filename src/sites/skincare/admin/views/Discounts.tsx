"use client";

import { Info, Plus, TicketPercent, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { COUPONS, SHIPPING } from "@/sites/skincare/data/catalog";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { Overlay } from "@/sites/skincare/admin/components/Overlay";
import { useToast } from "@/sites/skincare/admin/components/Toast";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  describedBy,
  Field,
  inputClass,
  PageHeader,
  PageSkeleton,
  Segmented,
} from "@/sites/skincare/admin/components/ui";
import { formatDate, formatNumber } from "@/sites/skincare/admin/lib/format";
import { useAdminReady, useOrders } from "@/sites/skincare/admin/lib/hooks";
import { couponStats, prepaidDiscountStats } from "@/sites/skincare/admin/lib/metrics";

type Draft = {
  code: string;
  kind: "percent" | "flat";
  value: string;
  minSubtotal: string;
  maxDiscount: string;
  firstOrderOnly: boolean;
  endsOn: string;
};

type Created = { code: string; description: string; endsOn?: string };

const EMPTY: Draft = {
  code: "",
  kind: "percent",
  value: "",
  minSubtotal: "0",
  maxDiscount: "",
  firstOrderOnly: false,
  endsOn: "",
};

function describe(d: Draft): string {
  const value = Number(d.value);
  const min = Number(d.minSubtotal);
  const parts = [d.kind === "percent" ? `${value}% off` : `${formatINR(value)} off`];
  if (d.firstOrderOnly) parts.push("your first order");
  if (min > 0) parts.push(`above ${formatINR(min)}`);
  let text = parts.join(" ");
  if (d.kind === "percent" && Number(d.maxDiscount) > 0)
    text += `, up to ${formatINR(Number(d.maxDiscount))}`;
  return text;
}

export default function Discounts() {
  const ready = useAdminReady();
  const orders = useOrders();
  const toast = useToast();
  const [created, setCreated] = useState<Created[]>([]);
  const [open, setOpen] = useState(false);

  if (!ready) return <PageSkeleton rows={1} />;

  const stats = couponStats(orders);
  const prepaid = prepaidDiscountStats(orders);
  const couponUses = stats.reduce((s, c) => s + c.uses, 0);
  const couponGiven = stats.reduce((s, c) => s + c.discount, 0);
  const couponRevenue = stats.reduce((s, c) => s + c.revenue, 0);

  return (
    <div>
      <PageHeader
        title="Discounts"
        description="Coupon codes customers type at checkout, and the automatic prepaid discount."
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Plus aria-hidden className="size-4" />
            Create discount
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: "Orders with a coupon",
            value: formatNumber(couponUses),
            note: `${orders.length ? Math.round((couponUses / orders.length) * 100) : 0}% of all orders`,
          },
          {
            label: "Given through coupons",
            value: formatINR(couponGiven),
            note: "On orders that were not cancelled",
          },
          {
            label: "Revenue with coupons",
            value: formatINR(couponRevenue),
            note: "Order totals after discount",
          },
          {
            label: "Prepaid discount given",
            value: formatINR(prepaid.discount),
            note: `${formatNumber(prepaid.uses)} prepaid orders`,
          },
        ].map((k) => (
          <Card key={k.label} className="px-4 py-4 sm:px-5">
            <h2 className="text-[0.8125rem] font-medium text-stone-600">{k.label}</h2>
            <p className="mt-1 text-xl font-semibold text-stone-900 tabular-nums sm:text-2xl">
              {k.value}
            </p>
            <p className="mt-0.5 text-xs text-stone-500">{k.note}</p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="Coupon codes"
          description="Usage and revenue come from the orders in this store."
        />
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Coupon codes</caption>
            <thead>
              <tr className="border-y border-stone-200 bg-stone-50/70 text-[0.75rem] text-stone-600">
                <th scope="col" className="px-5 py-2.5 font-medium">
                  Code
                </th>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Uses
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Discount given
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">
                  Revenue
                </th>
                <th scope="col" className="px-5 py-2.5 font-medium">
                  Last used
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {stats.map((c) => (
                <tr key={c.code}>
                  <td className="px-5 py-3">
                    <span className="inline-block rounded-md border border-dashed border-stone-400 bg-stone-50 px-2 py-0.5 font-mono text-[0.8125rem] font-semibold text-stone-900">
                      {c.code}
                    </span>
                    <p className="mt-1 text-xs text-stone-600">{c.description}</p>
                  </td>
                  <td className="px-3 py-3">
                    {c.active ? (
                      <Badge tone="green" dot>
                        Active
                      </Badge>
                    ) : (
                      <Badge>Paused</Badge>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatNumber(c.uses)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatINR(c.discount)}</td>
                  <td className="px-3 py-3 text-right font-medium text-stone-900 tabular-nums">
                    {formatINR(c.revenue)}
                  </td>
                  <td className="px-5 py-3 text-stone-600">
                    {c.lastUsed ? formatDate(c.lastUsed) : "Not used yet"}
                  </td>
                </tr>
              ))}
              {created.map((c) => (
                <tr key={c.code} className="bg-sky-50/40">
                  <td className="px-5 py-3">
                    <span className="inline-block rounded-md border border-dashed border-stone-400 bg-white px-2 py-0.5 font-mono text-[0.8125rem] font-semibold text-stone-900">
                      {c.code}
                    </span>
                    <p className="mt-1 text-xs text-stone-600">{c.description}</p>
                  </td>
                  <td className="px-3 py-3">
                    <Badge tone="blue">Demo, this page only</Badge>
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">0</td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatINR(0)}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{formatINR(0)}</td>
                  <td className="px-5 py-3 text-stone-600">
                    {c.endsOn ? `Ends ${formatDate(c.endsOn)}` : "No end date"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul
          className="divide-y divide-stone-100 border-t border-stone-100 md:hidden"
          aria-label="Coupon codes"
        >
          {stats.map((c) => (
            <li key={c.code} className="px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md border border-dashed border-stone-400 bg-stone-50 px-2 py-0.5 font-mono text-[0.8125rem] font-semibold">
                  {c.code}
                </span>
                {c.active ? (
                  <Badge tone="green" dot>
                    Active
                  </Badge>
                ) : (
                  <Badge>Paused</Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-stone-600">{c.description}</p>
              <p className="mt-1.5 text-[0.8125rem] text-stone-700 tabular-nums">
                {formatNumber(c.uses)} uses · {formatINR(c.discount)} given · {formatINR(c.revenue)}{" "}
                revenue
              </p>
            </li>
          ))}
          {created.map((c) => (
            <li key={c.code} className="bg-sky-50/40 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md border border-dashed border-stone-400 bg-white px-2 py-0.5 font-mono text-[0.8125rem] font-semibold">
                  {c.code}
                </span>
                <Badge tone="blue">Demo only</Badge>
              </div>
              <p className="mt-1 text-xs text-stone-600">{c.description}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-4 sm:mt-6">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-skin-accent-soft text-skin-accent"
          >
            <Zap className="size-5" />
          </span>
          <div className="flex-1">
            <h2 className="flex flex-wrap items-center gap-2 font-semibold text-stone-900">
              Prepaid discount{" "}
              <Badge tone="green" dot>
                Automatic
              </Badge>
            </h2>
            <p className="mt-0.5 text-sm text-stone-600">
              {SHIPPING.prepaidPercent}% off, up to {formatINR(SHIPPING.prepaidMax)}, when customers
              pay by UPI, card or net banking. It moves buyers away from cash on delivery, which
              cuts returns to origin.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-sm sm:w-auto sm:text-right">
            <div>
              <dt className="text-xs text-stone-500">Uses</dt>
              <dd className="font-semibold text-stone-900 tabular-nums">
                {formatNumber(prepaid.uses)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-500">Given</dt>
              <dd className="font-semibold text-stone-900 tabular-nums">
                {formatINR(prepaid.discount)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-500">Revenue</dt>
              <dd className="font-semibold text-stone-900 tabular-nums">
                {formatINR(prepaid.revenue)}
              </dd>
            </div>
          </dl>
        </div>
      </Card>

      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        title="Create discount"
        description="Set up a new coupon code for the shop."
      >
        {open ? (
          <CreateForm
            taken={[...COUPONS.map((c) => c.code), ...created.map((c) => c.code)]}
            onCancel={() => setOpen(false)}
            onCreate={(c) => {
              setCreated((list) => [...list, c]);
              setOpen(false);
              toast({
                title: `${c.code} created`,
                description: "Demo only: it is listed on this page but does not apply at checkout.",
              });
            }}
          />
        ) : null}
      </Overlay>
    </div>
  );
}

function CreateForm({
  taken,
  onCancel,
  onCreate,
}: {
  taken: string[];
  onCancel: () => void;
  onCreate: (c: Created) => void;
}) {
  const [d, setD] = useState<Draft>(EMPTY);
  const [show, setShow] = useState(false);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const code = d.code.trim().toUpperCase();
  const value = Number(d.value);
  const errors = {
    code: !/^[A-Z0-9]{4,15}$/.test(code)
      ? "Use 4 to 15 letters or numbers, no spaces."
      : taken.includes(code)
        ? "This code already exists."
        : undefined,
    value:
      !/^\d+$/.test(d.value.trim()) || value < 1
        ? "Enter a whole number."
        : d.kind === "percent" && value > 80
          ? "Keep percentage discounts at 80% or less."
          : undefined,
    minSubtotal: !/^\d*$/.test(d.minSubtotal.trim())
      ? "Enter a whole number of rupees."
      : undefined,
    maxDiscount:
      d.maxDiscount && !/^\d+$/.test(d.maxDiscount.trim())
        ? "Enter a whole number of rupees."
        : undefined,
  };
  const shown = show ? errors : ({} as Partial<typeof errors>);
  const invalid = Object.values(errors).some(Boolean);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (invalid) {
          setShow(true);
          return;
        }
        onCreate({ code, description: describe(d), endsOn: d.endsOn || undefined });
      }}
      className="space-y-4"
    >
      <Field
        label="Code"
        htmlFor="code"
        required
        error={shown.code}
        hint="Customers type this at checkout, e.g. DIWALI20"
      >
        <input
          id="code"
          data-autofocus
          value={d.code}
          onChange={(e) => set("code", e.target.value.toUpperCase())}
          className={cn(inputClass, "font-mono uppercase")}
          {...describedBy("code", { error: shown.code, hint: true })}
        />
      </Field>
      <div>
        <p className="mb-1.5 text-[0.8125rem] font-medium text-stone-800" id="kind-label">
          Type
        </p>
        <Segmented
          label="Discount type"
          value={d.kind}
          onChange={(v) => set("kind", v)}
          options={[
            { value: "percent", label: "Percentage" },
            { value: "flat", label: "Flat amount" },
          ]}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={d.kind === "percent" ? "Discount (%)" : "Discount (₹)"}
          htmlFor="value"
          required
          error={shown.value}
        >
          <input
            id="value"
            inputMode="numeric"
            value={d.value}
            onChange={(e) => set("value", e.target.value)}
            className={cn(inputClass, "tabular-nums")}
            {...describedBy("value", { error: shown.value })}
          />
        </Field>
        {d.kind === "percent" ? (
          <Field
            label="Maximum discount (₹)"
            htmlFor="max"
            error={shown.maxDiscount}
            hint="Optional cap"
          >
            <input
              id="max"
              inputMode="numeric"
              value={d.maxDiscount}
              onChange={(e) => set("maxDiscount", e.target.value)}
              className={cn(inputClass, "tabular-nums")}
              {...describedBy("max", { error: shown.maxDiscount, hint: true })}
            />
          </Field>
        ) : null}
        <Field label="Minimum order (₹)" htmlFor="min" error={shown.minSubtotal}>
          <input
            id="min"
            inputMode="numeric"
            value={d.minSubtotal}
            onChange={(e) => set("minSubtotal", e.target.value)}
            className={cn(inputClass, "tabular-nums")}
            {...describedBy("min", { error: shown.minSubtotal })}
          />
        </Field>
        <Field label="Ends on" htmlFor="ends" hint="Optional">
          <input
            id="ends"
            type="date"
            value={d.endsOn}
            onChange={(e) => set("endsOn", e.target.value)}
            className={inputClass}
            {...describedBy("ends", { hint: true })}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2.5 text-sm text-stone-800">
        <input
          type="checkbox"
          checked={d.firstOrderOnly}
          onChange={(e) => set("firstOrderOnly", e.target.checked)}
          className="size-4 accent-skin-accent"
        />
        First order only
      </label>
      {d.value && !errors.value ? (
        <p className="rounded-lg bg-stone-50 px-3 py-2 text-[0.8125rem] text-stone-700">
          <TicketPercent aria-hidden className="mr-1.5 inline size-4 align-[-3px] text-stone-500" />
          {code || "CODE"}: {describe(d)}
        </p>
      ) : null}
      <p className="flex items-start gap-2 text-xs text-stone-500">
        <Info aria-hidden className="mt-px size-3.5 shrink-0" />
        Demo: new codes are listed on this page only and do not apply at checkout.
      </p>
      <div className="flex justify-end gap-2 pt-1">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">
          Create discount
        </Button>
      </div>
    </form>
  );
}
