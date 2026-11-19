"use client";

import { ChevronRight, Mail, MapPin, Phone, Search, Users } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { Overlay } from "@/sites/skincare/admin/components/Overlay";
import {
  Badge,
  Card,
  EmptyState,
  inputClass,
  PageHeader,
  PageSkeleton,
  PaymentBadge,
  Select,
  StatusBadge,
} from "@/sites/skincare/admin/components/ui";
import {
  formatDate,
  formatNumber,
  formatPercent,
  initials,
  PAYMENT_SHORT,
  plural,
  relativeTime,
} from "@/sites/skincare/admin/lib/format";
import { useAdminReady, useNow, useOrders } from "@/sites/skincare/admin/lib/hooks";
import { deriveCustomers, repeatRate, type Customer } from "@/sites/skincare/admin/lib/metrics";

type Filter = "all" | "repeat" | "new" | "cod";
type Sort = "recent" | "spent" | "orders";

function PaymentMix({ c }: { c: Customer }) {
  const total = c.codOrders + c.prepaidOrders;
  const prepaidPct = total ? (c.prepaidOrders / total) * 100 : 0;
  return (
    <span className="flex min-w-28 flex-col gap-1">
      <span className="text-xs text-stone-700 tabular-nums">
        {c.prepaidOrders} prepaid, {c.codOrders} COD
      </span>
      <span aria-hidden className="flex h-1.5 overflow-hidden rounded-full bg-[#d08419]">
        <span className="h-full bg-[#1f8a65]" style={{ width: `${prepaidPct}%` }} />
      </span>
    </span>
  );
}

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-skin-accent-soft text-xs font-semibold text-skin-accent",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export default function Customers() {
  const ready = useAdminReady();
  const now = useNow();
  if (!ready || !now) return <PageSkeleton rows={1} />;
  return <CustomersContent now={now} />;
}

function CustomersContent({ now }: { now: number }) {
  const params = useSearchParams();
  const orders = useOrders();
  const customers = useMemo(() => deriveCustomers(orders), [orders]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [openKey, setOpenKey] = useState<string | null>(() => params.get("c"));

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const digits = q.replace(/\D/g, "");
    return customers
      .filter((c) =>
        filter === "repeat"
          ? c.orders.length > 1
          : filter === "new"
            ? c.orders.length === 1
            : filter === "cod"
              ? c.codOrders > c.prepaidOrders
              : true,
      )
      .filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.address.city.toLowerCase().includes(q) ||
          (digits.length >= 2 && c.phone.replace(/\D/g, "").includes(digits)),
      )
      .sort((a, b) =>
        sort === "spent"
          ? b.spent - a.spent
          : sort === "orders"
            ? b.orders.length - a.orders.length
            : b.lastOrderAt.localeCompare(a.lastOrderAt),
      );
  }, [customers, query, filter, sort]);

  const open = customers.find((c) => c.key === openKey) ?? null;
  const rate = repeatRate(customers);
  const totalSpent = customers.reduce((s, c) => s + c.spent, 0);
  const codLeaning = customers.filter((c) => c.codOrders > c.prepaidOrders).length;

  return (
    <div>
      <PageHeader
        title="Customers"
        description={`${plural(customers.length, "customer")} from ${plural(orders.length, "order")}. Worked out from orders, so it updates as orders come in.`}
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: "Customers",
            value: formatNumber(customers.length),
            note: "Placed at least one order",
          },
          {
            label: "Repeat customers",
            value: formatPercent(rate, 0),
            note: `${customers.filter((c) => c.orders.length > 1).length} ordered more than once`,
          },
          {
            label: "Average spend",
            value: formatINR(customers.length ? Math.round(totalSpent / customers.length) : 0),
            note: "Per customer, all time",
          },
          {
            label: "Prefer cash on delivery",
            value: formatNumber(codLeaning),
            note: "More COD than prepaid orders",
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
        <div className="flex flex-col gap-2 p-3 sm:p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-500"
            />
            <label htmlFor="cust-search" className="sr-only">
              Search customers
            </label>
            <input
              id="cust-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone or city"
              className={cn(inputClass, "pl-9")}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <label htmlFor="cust-filter" className="sr-only">
              Show
            </label>
            <Select
              id="cust-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="sm:w-48"
            >
              <option value="all">All customers</option>
              <option value="repeat">Repeat customers</option>
              <option value="new">One order so far</option>
              <option value="cod">Prefer cash on delivery</option>
            </Select>
            <label htmlFor="cust-sort" className="sr-only">
              Sort
            </label>
            <Select
              id="cust-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="sm:w-44"
            >
              <option value="recent">Last order first</option>
              <option value="spent">Highest spend</option>
              <option value="orders">Most orders</option>
            </Select>
          </div>
        </div>

        {!list.length ? (
          <EmptyState
            icon={<Users />}
            title="No customers match"
            description="Try another search or filter."
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Customers</caption>
                <thead>
                  <tr className="border-y border-stone-200 bg-stone-50/70 text-[0.75rem] text-stone-600">
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Location
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">
                      Orders
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">
                      Total spent
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Last order
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {list.map((c) => (
                    <tr key={c.key} className="hover:bg-stone-50">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={c.name} />
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setOpenKey(c.key)}
                              className="text-left font-medium text-stone-900 hover:underline"
                            >
                              {c.name}
                            </button>
                            <p className="text-xs text-stone-500 tabular-nums">{c.phone}</p>
                          </div>
                          {c.orders.length > 1 ? <Badge tone="teal">Repeat</Badge> : null}
                          {c.fromThisBrowser ? <Badge tone="blue">This browser</Badge> : null}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-stone-700">
                        {c.address.city}
                        <span className="block text-xs text-stone-500">{c.address.state}</span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-stone-900 tabular-nums">
                        {c.orders.length}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-stone-900 tabular-nums">
                        {formatINR(c.spent)}
                      </td>
                      <td className="px-3 py-2.5 text-stone-700">
                        {relativeTime(c.lastOrderAt, now)}
                        <span className="block text-xs text-stone-500">
                          {formatDate(c.lastOrderAt)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <PaymentMix c={c} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul
              className="divide-y divide-stone-100 border-t border-stone-100 md:hidden"
              aria-label="Customers"
            >
              {list.map((c) => (
                <li key={c.key}>
                  <button
                    type="button"
                    onClick={() => setOpenKey(c.key)}
                    className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-stone-50"
                  >
                    <Avatar name={c.name} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium text-stone-900">{c.name}</span>
                        <span className="font-medium text-stone-900 tabular-nums">
                          {formatINR(c.spent)}
                        </span>
                      </span>
                      <span className="block text-[0.8125rem] text-stone-600">
                        {c.address.city} · {plural(c.orders.length, "order")} ·{" "}
                        {relativeTime(c.lastOrderAt, now)}
                      </span>
                    </span>
                    <ChevronRight aria-hidden className="size-4 shrink-0 text-stone-400" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <Overlay
        open={Boolean(open)}
        onClose={() => setOpenKey(null)}
        kind="drawer-right"
        title={open?.name ?? "Customer"}
        description={open ? `Customer since ${formatDate(open.firstOrderAt)}` : undefined}
      >
        {open ? <CustomerDetail c={open} now={now} /> : null}
      </Overlay>
    </div>
  );
}

function CustomerDetail({ c, now }: { c: Customer; now: number }) {
  const saleOrders = c.orders.filter(
    (o) => o.status !== "cancelled" && o.status !== "returned",
  ).length;
  return (
    <div className="space-y-5 pt-4">
      <dl className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-stone-50 px-3 py-2.5">
          <dt className="text-xs text-stone-600">Orders</dt>
          <dd className="text-lg font-semibold text-stone-900 tabular-nums">{c.orders.length}</dd>
        </div>
        <div className="rounded-lg bg-stone-50 px-3 py-2.5">
          <dt className="text-xs text-stone-600">Spent</dt>
          <dd className="text-lg font-semibold text-stone-900 tabular-nums">
            {formatINR(c.spent)}
          </dd>
        </div>
        <div className="rounded-lg bg-stone-50 px-3 py-2.5">
          <dt className="text-xs text-stone-600">Per order</dt>
          <dd className="text-lg font-semibold text-stone-900 tabular-nums">
            {formatINR(saleOrders ? Math.round(c.spent / saleOrders) : 0)}
          </dd>
        </div>
      </dl>

      <section>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
          Contact
        </h3>
        <div className="space-y-1.5 text-sm text-stone-700">
          <p className="flex items-center gap-2">
            <Phone aria-hidden className="size-4 text-stone-500" />
            <span className="tabular-nums">{c.phone}</span>
          </p>
          {c.email ? (
            <p className="flex items-center gap-2 break-all">
              <Mail aria-hidden className="size-4 shrink-0 text-stone-500" />
              {c.email}
            </p>
          ) : null}
          <p className="flex items-start gap-2">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-stone-500" />
            <span>
              {c.address.line1}
              {c.address.line2 ? `, ${c.address.line2}` : ""}, {c.address.city}, {c.address.state}{" "}
              {c.address.pincode}
            </span>
          </p>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
          How they pay
        </h3>
        <PaymentMix c={c} />
        <p className="mt-1.5 text-xs text-stone-500">
          {c.codOrders > c.prepaidOrders
            ? "Mostly cash on delivery. A WhatsApp nudge with the prepaid discount can move them to UPI."
            : "Mostly prepaid, which means fewer returns to origin."}
        </p>
      </section>

      <section>
        <h3 className="mb-2 text-xs font-semibold tracking-wide text-stone-500 uppercase">
          Orders
        </h3>
        <ul className="divide-y divide-stone-100 rounded-lg border border-stone-200">
          {c.orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/skincare/admin/orders/${o.id}`}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-stone-50"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-stone-900">{o.id}</span>
                    <span className="font-medium text-stone-900 tabular-nums">
                      {formatINR(o.totals.total)}
                    </span>
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                    {relativeTime(o.createdAt, now)} · {PAYMENT_SHORT[o.payment.method]}
                    <StatusBadge status={o.status} />
                    <PaymentBadge order={o} />
                  </span>
                </span>
                <ChevronRight aria-hidden className="size-4 shrink-0 text-stone-400" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
