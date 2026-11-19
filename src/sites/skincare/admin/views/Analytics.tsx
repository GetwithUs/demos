"use client";

import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useProducts } from "@/sites/skincare/lib/store";
import BarList from "@/sites/skincare/admin/components/charts/BarList";
import RangeSwitch from "@/sites/skincare/admin/components/RangeSwitch";
import {
  Card,
  CardHeader,
  Delta,
  PageHeader,
  PageSkeleton,
} from "@/sites/skincare/admin/components/ui";
import { PAYMENT_COLORS } from "@/sites/skincare/admin/lib/constants";
import {
  formatNumber,
  formatPercent,
  PAYMENT_LABEL,
  plural,
} from "@/sites/skincare/admin/lib/format";
import { useAdminReady, useNow, useOrders } from "@/sites/skincare/admin/lib/hooks";
import {
  categorySales,
  change,
  computeKpis,
  concernSales,
  deriveCustomers,
  funnel,
  groupRevenue,
  inPeriod,
  isSale,
  paymentSplit,
  rangeWindow,
  repeatRate,
  type RangeKey,
} from "@/sites/skincare/admin/lib/metrics";

export default function Analytics() {
  const ready = useAdminReady();
  const now = useNow();
  const [range, setRange] = useState<RangeKey>("30d");
  if (!ready || !now) return <PageSkeleton rows={3} />;
  return <AnalyticsContent now={now} range={range} setRange={setRange} />;
}

function Stat({
  label,
  value,
  delta,
  unit,
  note,
}: {
  label: string;
  value: string;
  delta?: number | null;
  unit?: "%" | "pts";
  note?: string;
}) {
  return (
    <Card className="px-4 py-4 sm:px-5">
      <h3 className="text-[0.8125rem] font-medium text-stone-600">{label}</h3>
      <p className="mt-1 text-xl font-semibold text-stone-900 tabular-nums sm:text-2xl">{value}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {delta !== undefined ? <Delta value={delta} unit={unit} /> : null}
        {note ? <span className="text-xs text-stone-500">{note}</span> : null}
      </div>
    </Card>
  );
}

function AnalyticsContent({
  now,
  range,
  setRange,
}: {
  now: number;
  range: RangeKey;
  setRange: (r: RangeKey) => void;
}) {
  const orders = useOrders();
  const products = useProducts({ includeInactive: true });
  const w = useMemo(() => rangeWindow(range, now), [range, now]);

  const d = useMemo(() => {
    const inRange = orders.filter((o) => inPeriod(o, w.period));
    const customers = deriveCustomers(orders);
    const buckets = { one: 0, two: 0, more: 0 };
    for (const c of customers) {
      if (c.orders.length === 1) buckets.one += 1;
      else if (c.orders.length === 2) buckets.two += 1;
      else buckets.more += 1;
    }
    return {
      inRange,
      k: computeKpis(orders, w.period, now),
      p: computeKpis(orders, w.prevPeriod),
      states: groupRevenue(inRange, (o) => o.address.state),
      cities: groupRevenue(inRange, (o) => o.address.city),
      categories: categorySales(inRange, products),
      concerns: concernSales(inRange, products),
      funnel: funnel(orders, w.period, now),
      payments: paymentSplit(inRange),
      customers,
      buckets,
      repeat: repeatRate(customers),
    };
  }, [orders, products, w, now]);

  const { k, p } = d;
  const closed = d.inRange.filter((o) => !isSale(o)).length;
  const cod = d.payments.find((x) => x.method === "cod")?.orders ?? 0;
  const top = d.funnel[0]?.value || 1;
  const periodLabel = w.title.toLowerCase();

  return (
    <div>
      <PageHeader
        title="Analytics"
        description={`Where sales come from, ${periodLabel}. Everything is worked out from the orders in this store.`}
        actions={<RangeSwitch value={range} onChange={setRange} />}
      />

      <h2 className="sr-only">Summary</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Revenue" value={formatINR(k.revenue)} delta={change(k.revenue, p.revenue)} />
        <Stat label="Orders" value={formatNumber(k.orders)} delta={change(k.orders, p.orders)} />
        <Stat label="Average order value" value={formatINR(k.aov)} delta={change(k.aov, p.aov)} />
        <Stat
          label="Conversion rate"
          value={formatPercent(k.conversion, 2)}
          note={`${formatNumber(k.sessions)} sessions`}
        />
        <Stat
          label="Cash on delivery"
          value={formatPercent(k.orders ? (cod / k.orders) * 100 : 0, 0)}
          note={`${cod} of ${plural(k.orders, "order")}`}
        />
        <Stat
          label="Cancellations"
          value={formatPercent(k.orders ? (closed / k.orders) * 100 : 0, 1)}
          note={`${closed} cancelled or returned`}
        />
      </div>

      <Card className="mt-4 sm:mt-6">
        <CardHeader title="Store funnel" description={`From visit to order, ${periodLabel}`} />
        <ol className="space-y-3 px-5 pb-4">
          {d.funnel.map((s, i) => {
            const prev = d.funnel[i - 1];
            const stepRate = prev && prev.value ? (s.value / prev.value) * 100 : null;
            return (
              <li
                key={s.key}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[11rem_minmax(0,1fr)_9rem]"
              >
                <span className="text-sm text-stone-800">
                  {s.label}
                  {s.real ? (
                    <span className="ml-1.5 rounded bg-skin-accent-soft px-1.5 py-px text-[0.6875rem] font-medium text-skin-accent">
                      Real
                    </span>
                  ) : null}
                </span>
                <span className="order-3 col-span-2 h-7 rounded-md bg-stone-100 sm:order-none sm:col-span-1">
                  <span
                    className="flex h-7 items-center rounded-md px-2 text-xs font-medium text-white tabular-nums"
                    style={{
                      width: `${Math.max(3, (s.value / top) * 100)}%`,
                      background: s.real ? "#2f5d50" : "#6f8f84",
                    }}
                  >
                    {(s.value / top) * 100 >= 12 ? formatNumber(s.value) : ""}
                  </span>
                </span>
                <span className="text-right text-sm tabular-nums">
                  <span className="font-semibold text-stone-900">{formatNumber(s.value)}</span>
                  {stepRate !== null ? (
                    <span className="ml-2 text-xs text-stone-500">
                      {formatPercent(stepRate, 1)} of previous
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="flex items-start gap-2 border-t border-stone-100 px-5 py-3 text-xs text-stone-600">
          <Info aria-hidden className="mt-px size-3.5 shrink-0" />
          Orders are real. Sessions, product views, carts and checkouts are demo numbers worked out
          from the order count (about 2 checkouts per order), as a live store would get them from
          its analytics.
        </p>
      </Card>

      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Revenue by state"
            description={`${d.states.length} states, ${periodLabel}`}
          />
          <div className="px-5 pb-5">
            <BarList
              rows={d.states.slice(0, 8).map((r) => ({
                key: r.key,
                label: r.label,
                value: r.revenue,
                display: formatINR(r.revenue),
                sub: plural(r.orders, "order"),
              }))}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Top cities" description="By revenue" />
          <div className="px-5 pb-5">
            <BarList
              color="#4f74d9"
              rows={d.cities.slice(0, 8).map((r) => ({
                key: r.key,
                label: r.label,
                value: r.revenue,
                display: formatINR(r.revenue),
                sub: plural(r.orders, "order"),
              }))}
            />
          </div>
        </Card>
        <Card>
          <CardHeader
            title="Sales by category"
            description="Item sales at selling price, before coupons and delivery"
          />
          <div className="px-5 pb-5">
            <BarList
              color="#a24f9a"
              rows={d.categories.map((r) => ({
                key: r.category,
                label: r.label,
                value: r.revenue,
                display: formatINR(r.revenue),
                sub: plural(r.units, "unit"),
              }))}
            />
          </div>
        </Card>
        <Card>
          <CardHeader
            title="Top skin concerns"
            description="Units sold for each concern; a product can count for more than one"
          />
          <div className="px-5 pb-5">
            <BarList
              color="#d08419"
              rows={d.concerns.slice(0, 8).map((r) => ({
                key: r.concern,
                label: r.label,
                value: r.units,
                display: plural(r.units, "unit"),
              }))}
            />
          </div>
        </Card>
        <Card>
          <CardHeader title="Repeat purchase rate" description="All customers, all time" />
          <div className="px-5 pb-5">
            <p className="text-3xl font-semibold text-stone-900 tabular-nums">
              {formatPercent(d.repeat, 0)}
            </p>
            <p className="mt-1 text-sm text-stone-600">
              {d.customers.length - d.buckets.one} of {plural(d.customers.length, "customer")} came
              back for another order.
            </p>
            <div aria-hidden className="mt-4 flex h-3 overflow-hidden rounded-full">
              {[
                { n: d.buckets.one, c: "#d6d3d1" },
                { n: d.buckets.two, c: "#6f8f84" },
                { n: d.buckets.more, c: "#2f5d50" },
              ].map((b, i) => (
                <span
                  key={i}
                  className={cn("h-full", i > 0 && "border-l-2 border-white")}
                  style={{ width: `${(b.n / (d.customers.length || 1)) * 100}%`, background: b.c }}
                />
              ))}
            </div>
            <ul className="mt-3 grid grid-cols-3 gap-2 text-[0.8125rem]">
              {[
                { label: "1 order", n: d.buckets.one, c: "#d6d3d1" },
                { label: "2 orders", n: d.buckets.two, c: "#6f8f84" },
                { label: "3 or more", n: d.buckets.more, c: "#2f5d50" },
              ].map((b) => (
                <li key={b.label} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-2.5 rounded-[3px]"
                    style={{ background: b.c }}
                  />
                  <span className="text-stone-700">{b.label}</span>
                  <span className="ml-auto font-medium text-stone-900 tabular-nums">{b.n}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
        <Card>
          <CardHeader title="Payment methods" description={`Orders and revenue, ${periodLabel}`} />
          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full text-left text-sm tabular-nums">
              <caption className="sr-only">Payment methods</caption>
              <thead>
                <tr className="text-xs text-stone-500">
                  <th scope="col" className="pb-2 font-medium">
                    Method
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Orders
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Share
                  </th>
                  <th scope="col" className="pb-2 text-right font-medium">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {d.payments.map((x) => (
                  <tr key={x.method}>
                    <th scope="row" className="py-2 font-normal text-stone-800">
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden
                          className="size-2.5 rounded-[3px]"
                          style={{ background: PAYMENT_COLORS[x.method] }}
                        />
                        {PAYMENT_LABEL[x.method]}
                      </span>
                    </th>
                    <td className="py-2 text-right">{x.orders}</td>
                    <td className="py-2 text-right">
                      {formatPercent(k.orders ? (x.orders / k.orders) * 100 : 0, 0)}
                    </td>
                    <td className="py-2 text-right font-medium text-stone-900">
                      {formatINR(x.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
