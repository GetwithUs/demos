"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Inbox,
  PackageCheck,
  Search,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { Order, OrderStatus } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";
import ShipDialog from "@/sites/skincare/admin/components/ShipDialog";
import { useToast } from "@/sites/skincare/admin/components/Toast";
import {
  Button,
  Card,
  Checkbox,
  EmptyState,
  inputClass,
  PageHeader,
  PageSkeleton,
  PaymentBadge,
  Select,
  StatusBadge,
  VisitorBadge,
} from "@/sites/skincare/admin/components/ui";
import {
  formatDateTime,
  formatNumber,
  PAYMENT_LABEL,
  PAYMENT_SHORT,
  plural,
  STATUS_LABEL,
} from "@/sites/skincare/admin/lib/format";
import { useAdminReady, useNow, useOrders } from "@/sites/skincare/admin/lib/hooks";
import { addDays, startOfDay } from "@/sites/skincare/admin/lib/metrics";
import { packOrder, shipOrder, newAwb } from "@/sites/skincare/admin/lib/order-actions";

const TABS: { key: string; label: string; statuses?: OrderStatus[] }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Needs action", statuses: ["placed", "confirmed", "packed"] },
  { key: "to-confirm", label: "To confirm", statuses: ["placed"] },
  { key: "to-pack", label: "To pack", statuses: ["confirmed"] },
  { key: "to-ship", label: "Ready to ship", statuses: ["packed"] },
  { key: "in-transit", label: "In transit", statuses: ["shipped", "out-for-delivery"] },
  { key: "delivered", label: "Delivered", statuses: ["delivered"] },
  { key: "closed", label: "Cancelled and returned", statuses: ["cancelled", "returned"] },
];

const PAY_FILTERS = [
  { value: "all", label: "All payments" },
  { value: "prepaid", label: "Prepaid (all online)" },
  { value: "upi", label: PAYMENT_LABEL.upi },
  { value: "card", label: PAYMENT_LABEL.card },
  { value: "netbanking", label: PAYMENT_LABEL.netbanking },
  { value: "cod", label: PAYMENT_LABEL.cod },
];

const DATE_FILTERS = [
  { value: "all", label: "All dates" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "total-desc", label: "Highest total" },
  { value: "total-asc", label: "Lowest total" },
];

const PAGE_SIZE = 15;

function pick(
  value: string | null,
  allowed: { value?: string; key?: string }[],
  fallback: string,
): string {
  return value && allowed.some((a) => (a.value ?? a.key) === value) ? value : fallback;
}

export default function Orders() {
  const ready = useAdminReady();
  const now = useNow();
  if (!ready || !now) return <PageSkeleton rows={1} />;
  return <OrdersContent now={now} />;
}

function OrdersContent({ now }: { now: number }) {
  const params = useSearchParams();
  const orders = useOrders();
  const toast = useToast();
  const tab = pick(params.get("tab"), TABS, "all");
  const pay = pick(params.get("pay"), PAY_FILTERS, "all");
  const date = pick(params.get("date"), DATE_FILTERS, "all");
  const sort = pick(params.get("sort"), SORTS, "newest");
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [shipOpen, setShipOpen] = useState(false);

  const setParams = (updates: Record<string, string | null>, resetPage = true) => {
    const next = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "" || v === "all" || (k === "sort" && v === "newest")) next.delete(k);
      else next.set(k, v);
    }
    if (resetPage && !("page" in updates)) next.delete("page");
    const qs = next.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of TABS)
      c[t.key] = t.statuses
        ? orders.filter((o) => t.statuses!.includes(o.status)).length
        : orders.length;
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const statuses = TABS.find((t) => t.key === tab)?.statuses;
    const q = query.trim().toLowerCase();
    const digits = q.replace(/\D/g, "");
    const today = startOfDay(now);
    const range =
      date === "today"
        ? [today, addDays(today, 1)]
        : date === "yesterday"
          ? [addDays(today, -1), today]
          : date === "7d"
            ? [addDays(today, -6), addDays(today, 1)]
            : date === "30d"
              ? [addDays(today, -29), addDays(today, 1)]
              : null;
    const list = orders.filter((o) => {
      if (statuses && !statuses.includes(o.status)) return false;
      if (pay === "prepaid" && o.payment.method === "cod") return false;
      if (pay !== "all" && pay !== "prepaid" && o.payment.method !== pay) return false;
      if (range) {
        const t = Date.parse(o.createdAt);
        if (t < range[0] || t >= range[1]) return false;
      }
      if (q) {
        const hit =
          o.id.toLowerCase().includes(q) ||
          o.address.name.toLowerCase().includes(q) ||
          o.address.city.toLowerCase().includes(q) ||
          (digits.length >= 2 && o.address.phone.replace(/\D/g, "").includes(digits));
        if (!hit) return false;
      }
      return true;
    });
    const by: Record<string, (a: Order, b: Order) => number> = {
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
      oldest: (a, b) => a.createdAt.localeCompare(b.createdAt),
      "total-desc": (a, b) => b.totals.total - a.totals.total,
      "total-asc": (a, b) => a.totals.total - b.totals.total,
    };
    return list.sort(by[sort]);
  }, [orders, tab, pay, date, sort, query, now]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const selectedOrders = orders.filter((o) => selected.has(o.id));
  const canPack = selectedOrders.filter((o) => o.status === "placed" || o.status === "confirmed");
  const canShip = selectedOrders.filter((o) => o.status === "packed");
  const allOnPage = rows.length > 0 && rows.every((o) => selected.has(o.id));
  const someOnPage = rows.some((o) => selected.has(o.id));
  const filtersOn = tab !== "all" || pay !== "all" || date !== "all" || query.trim() !== "";

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const togglePage = () =>
    setSelected((s) => {
      const next = new Set(s);
      for (const o of rows) {
        if (allOnPage) next.delete(o.id);
        else next.add(o.id);
      }
      return next;
    });

  const bulkPack = () => {
    const done = canPack.filter((o) => packOrder(o.id)).length;
    const skipped = selectedOrders.length - done;
    toast({
      title: `${plural(done, "order")} marked as packed`,
      description: skipped
        ? `${plural(skipped, "order")} skipped: already packed or further along.`
        : "Print the packing slips from each order.",
    });
    setSelected(new Set());
  };

  const bulkShip = (courier: string) => {
    const done = canShip.filter((o) => shipOrder(o.id, courier, newAwb())).length;
    const skipped = selectedOrders.length - done;
    toast({
      title: `${plural(done, "order")} handed to ${courier}`,
      description: skipped
        ? `${plural(skipped, "order")} skipped: only packed orders can ship.`
        : "AWB numbers are on each order.",
    });
    setShipOpen(false);
    setSelected(new Set());
  };

  const exportCsv = () => {
    const header = [
      "Order",
      "Date",
      "Customer",
      "Phone",
      "City",
      "State",
      "Items",
      "Payment",
      "Payment status",
      "Status",
      "Total",
    ];
    const lines = filtered.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleString("en-IN"),
      o.address.name,
      o.address.phone,
      o.address.city,
      o.address.state,
      String(o.totals.itemCount),
      PAYMENT_LABEL[o.payment.method],
      o.payment.status,
      STATUS_LABEL[o.status],
      String(o.totals.total),
    ]);
    const csv = [header, ...lines]
      .map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `oruvi-orders-${new Date(now).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: `Exported ${plural(filtered.length, "order")}`,
      description: "Saved as a CSV file on this device.",
    });
  };

  const sortHeader = (
    label: string,
    asc: string,
    desc: string,
    align: "left" | "right" = "left",
  ) => {
    const state = sort === asc ? "ascending" : sort === desc ? "descending" : "none";
    return (
      <th
        scope="col"
        aria-sort={state}
        className={cn("px-3 py-2.5 font-medium", align === "right" && "text-right")}
      >
        <button
          type="button"
          onClick={() => setParams({ sort: sort === desc ? asc : desc })}
          className={cn(
            "inline-flex items-center gap-1 rounded hover:text-stone-900",
            state !== "none" && "text-stone-900",
          )}
        >
          {label}
          {state === "ascending" ? (
            <ArrowUp aria-hidden className="size-3.5" />
          ) : state === "descending" ? (
            <ArrowDown aria-hidden className="size-3.5" />
          ) : null}
        </button>
      </th>
    );
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description={`${plural(orders.length, "order")} in total, ${formatNumber(counts.open)} need action`}
        actions={
          <Button onClick={exportCsv} disabled={!filtered.length}>
            <Download aria-hidden className="size-4" />
            Export
          </Button>
        }
      />

      <Card>
        <div className="border-b border-stone-200">
          <nav
            aria-label="Order status"
            className="-mb-px flex [scrollbar-width:none] gap-1 overflow-x-auto px-3 sm:px-4"
          >
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => {
                    setParams({ tab: t.key });
                    setSelected(new Set());
                  }}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-3 text-[0.8125rem] font-medium whitespace-nowrap transition-colors",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-skin-accent",
                    active
                      ? "border-skin-accent text-stone-900"
                      : "border-transparent text-stone-600 hover:border-stone-300 hover:text-stone-900",
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-px text-[0.6875rem] tabular-nums",
                      active ? "bg-skin-accent text-white" : "bg-stone-100 text-stone-600",
                    )}
                  >
                    {counts[t.key]}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2 p-3 sm:p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-500"
            />
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <input
              id="order-search"
              type="search"
              value={query}
              placeholder="Search by order ID, name, phone or city"
              onChange={(e) => {
                setQuery(e.target.value);
                setParams({ q: e.target.value });
              }}
              className={cn(inputClass, "pl-9")}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <label className="sr-only" htmlFor="pay-filter">
              Payment
            </label>
            <Select
              id="pay-filter"
              value={pay}
              onChange={(e) => setParams({ pay: e.target.value })}
              className="sm:w-44"
            >
              {PAY_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
            <label className="sr-only" htmlFor="date-filter">
              Date
            </label>
            <Select
              id="date-filter"
              value={date}
              onChange={(e) => setParams({ date: e.target.value })}
              className="sm:w-36"
            >
              {DATE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
            <label className="sr-only" htmlFor="sort">
              Sort
            </label>
            <Select
              id="sort"
              value={sort}
              onChange={(e) => setParams({ sort: e.target.value })}
              className="col-span-2 sm:w-40"
            >
              {SORTS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {selected.size ? (
          <div
            className="flex flex-wrap items-center gap-2 border-y border-skin-accent/20 bg-skin-accent-soft/60 px-3 py-2.5 sm:px-4"
            role="region"
            aria-label="Bulk actions"
          >
            <p className="mr-auto text-sm font-medium text-stone-900">
              {selected.size} selected
              <span className="ml-2 font-normal text-stone-600">
                {canPack.length} can be packed, {canShip.length} ready to ship
              </span>
            </p>
            <Button size="sm" onClick={bulkPack} disabled={!canPack.length}>
              <PackageCheck aria-hidden className="size-4" />
              Mark as packed
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setShipOpen(true)}
              disabled={!canShip.length}
            >
              <Truck aria-hidden className="size-4" />
              Mark as shipped
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
              <X aria-hidden className="size-4" />
              Clear
            </Button>
          </div>
        ) : null}

        {rows.length ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">
                  Orders, {TABS.find((t) => t.key === tab)?.label}
                </caption>
                <thead>
                  <tr className="border-y border-stone-200 bg-stone-50/70 text-[0.75rem] text-stone-600">
                    <th scope="col" className="w-10 py-2.5 pr-1 pl-4">
                      <Checkbox
                        aria-label="Select all orders on this page"
                        checked={allOnPage}
                        ref={(el) => {
                          if (el) el.indeterminate = someOnPage && !allOnPage;
                        }}
                        onChange={togglePage}
                      />
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Order
                    </th>
                    {sortHeader("Date", "oldest", "newest")}
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Items
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Payment
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Status
                    </th>
                    {sortHeader("Total", "total-asc", "total-desc", "right")}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {rows.map((o) => (
                    <tr
                      key={o.id}
                      className={cn(
                        "hover:bg-stone-50",
                        selected.has(o.id) && "bg-skin-accent-soft/40 hover:bg-skin-accent-soft/50",
                      )}
                    >
                      <td className="py-3 pr-1 pl-4">
                        <Checkbox
                          aria-label={`Select order ${o.id}`}
                          checked={selected.has(o.id)}
                          onChange={() => toggle(o.id)}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/skincare/admin/orders/${o.id}`}
                          className="font-medium text-stone-900 hover:underline"
                        >
                          {o.id}
                        </Link>
                        {o.source === "visitor" ? (
                          <span className="mt-1 block">
                            <VisitorBadge order={o} />
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-stone-600">
                        {formatDateTime(o.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-stone-900">{o.address.name}</span>
                        <span className="block text-xs text-stone-500">
                          {o.address.city}, {o.address.phone}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-stone-600 tabular-nums">
                        {o.totals.itemCount}
                      </td>
                      <td className="px-3 py-3">
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs text-stone-600">
                            {PAYMENT_SHORT[o.payment.method]}
                          </span>
                          <PaymentBadge order={o} />
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-stone-900 tabular-nums">
                        {formatINR(o.totals.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul
              className="divide-y divide-stone-100 border-t border-stone-100 md:hidden"
              aria-label="Orders"
            >
              {rows.map((o) => (
                <li
                  key={o.id}
                  className={cn(
                    "flex gap-3 px-3 py-3",
                    selected.has(o.id) && "bg-skin-accent-soft/40",
                  )}
                >
                  <div className="pt-0.5">
                    <Checkbox
                      aria-label={`Select order ${o.id}`}
                      checked={selected.has(o.id)}
                      onChange={() => toggle(o.id)}
                    />
                  </div>
                  <Link href={`/skincare/admin/orders/${o.id}`} className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-medium text-stone-900">{o.id}</span>
                      <span className="font-medium text-stone-900 tabular-nums">
                        {formatINR(o.totals.total)}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-[0.8125rem] text-stone-600">
                      {o.address.name}, {o.address.city}
                    </span>
                    <span className="block text-xs text-stone-500">
                      {formatDateTime(o.createdAt)} · {plural(o.totals.itemCount, "item")}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={o.status} />
                      <PaymentBadge order={o} />
                      <span className="text-xs text-stone-500">
                        {PAYMENT_SHORT[o.payment.method]}
                      </span>
                      <VisitorBadge order={o} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-stone-200 px-4 py-3 sm:flex-row">
              <p className="text-[0.8125rem] text-stone-600 tabular-nums">
                Showing {formatNumber((current - 1) * PAGE_SIZE + 1)} to{" "}
                {formatNumber((current - 1) * PAGE_SIZE + rows.length)} of{" "}
                {plural(filtered.length, "order")}
              </p>
              <nav aria-label="Pages" className="flex items-center gap-1">
                <Button
                  size="sm"
                  onClick={() => setParams({ page: String(current - 1) }, false)}
                  disabled={current <= 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft aria-hidden className="size-4" />
                </Button>
                <span className="px-2 text-[0.8125rem] text-stone-700 tabular-nums">
                  Page {current} of {pages}
                </span>
                <Button
                  size="sm"
                  onClick={() => setParams({ page: String(current + 1) }, false)}
                  disabled={current >= pages}
                  aria-label="Next page"
                >
                  <ChevronRight aria-hidden className="size-4" />
                </Button>
              </nav>
            </div>
          </>
        ) : (
          <EmptyState
            icon={<Inbox />}
            title={filtersOn ? "No orders match these filters" : "No orders yet"}
            description={
              filtersOn
                ? "Try another tab, a different date or clear the search."
                : "Orders from the shop will appear here as soon as they are placed."
            }
            action={
              filtersOn ? (
                <Button
                  onClick={() => {
                    setQuery("");
                    window.history.replaceState(null, "", window.location.pathname);
                  }}
                >
                  Clear filters
                </Button>
              ) : null
            }
          />
        )}
      </Card>

      <ShipDialog
        open={shipOpen}
        onClose={() => setShipOpen(false)}
        count={canShip.length}
        onShip={(courier) => bulkShip(courier)}
      />
    </div>
  );
}
