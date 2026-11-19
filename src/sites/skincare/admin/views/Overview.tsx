"use client";

import { ArrowRight, PackageCheck, PackageOpen, Truck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useProducts } from "@/sites/skincare/lib/store";
import BarList from "@/sites/skincare/admin/components/charts/BarList";
import Donut from "@/sites/skincare/admin/components/charts/Donut";
import SalesChart from "@/sites/skincare/admin/components/charts/SalesChart";
import OrderList from "@/sites/skincare/admin/components/OrderList";
import ProductThumb from "@/sites/skincare/admin/components/ProductThumb";
import {
  Badge,
  ButtonLink,
  Card,
  CardHeader,
  Delta,
  EmptyState,
  PageSkeleton,
} from "@/sites/skincare/admin/components/ui";
import RangeSwitch from "@/sites/skincare/admin/components/RangeSwitch";
import { PAYMENT_COLORS, STATUS_BAR, STATUS_TAB } from "@/sites/skincare/admin/lib/constants";
import {
  firstName,
  formatLongDate,
  formatNumber,
  formatPercent,
  PAYMENT_LABEL,
  plural,
  STATUS_LABEL,
} from "@/sites/skincare/admin/lib/format";
import { STORE_DETAILS } from "@/sites/skincare/admin/lib/gst";
import { useAdminReady, useNow, useOrders } from "@/sites/skincare/admin/lib/hooks";
import {
  change,
  computeKpis,
  inPeriod,
  LOW_STOCK,
  paymentSplit,
  productSales,
  rangeWindow,
  seriesFor,
  statusCounts,
  type RangeKey,
} from "@/sites/skincare/admin/lib/metrics";
import type { OrderStatus } from "@/sites/skincare/data/types";

function greeting(now: number): string {
  const h = new Date(now).getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default function Overview() {
  const ready = useAdminReady();
  const now = useNow();
  const [range, setRange] = useState<RangeKey>("7d");
  if (!ready || !now) return <PageSkeleton rows={2} />;
  return <OverviewContent now={now} range={range} setRange={setRange} />;
}

function KpiCard({
  label,
  value,
  delta,
  unit,
  compareLabel,
  note,
}: {
  label: string;
  value: string;
  delta: number | null;
  unit?: "%" | "pts";
  compareLabel: string;
  note?: string;
}) {
  return (
    <Card className="px-4 py-4 sm:px-5">
      <h3 className="text-[0.8125rem] font-medium text-stone-600">{label}</h3>
      <p className="mt-1.5 text-[1.375rem] leading-tight font-semibold tracking-tight text-stone-900 tabular-nums sm:text-2xl">
        {value}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <Delta value={delta} unit={unit} />
        {delta !== null ? <span className="text-xs text-stone-500">{compareLabel}</span> : null}
      </div>
      {note ? <p className="mt-1 text-xs text-stone-500">{note}</p> : null}
    </Card>
  );
}

function OverviewContent({
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

  const data = useMemo(() => {
    const inRange = orders.filter((o) => inPeriod(o, w.period));
    const k = computeKpis(orders, w.period, now);
    const p = computeKpis(orders, w.prevPeriod);
    return {
      inRange,
      k,
      p,
      series: seriesFor(orders, w.buckets),
      prevSeries: seriesFor(orders, w.prevBuckets),
      statuses: statusCounts(inRange),
      payments: paymentSplit(inRange),
      top: productSales(inRange, products).slice(0, 5),
    };
  }, [orders, products, w, now]);

  const open = orders.filter((o) => ["placed", "confirmed", "packed"].includes(o.status));
  const toConfirm = open.filter((o) => o.status === "placed").length;
  const toPack = open.filter((o) => o.status === "confirmed").length;
  const toShip = open.filter((o) => o.status === "packed").length;
  const newVisitor = orders.filter((o) => o.source === "visitor" && o.status === "placed");

  const lowStock = products
    .flatMap((p) => p.variants.map((v) => ({ product: p, variant: v })))
    .filter((x) => x.variant.stock < LOW_STOCK)
    .sort((a, b) => a.variant.stock - b.variant.stock);

  const { k, p } = data;
  const prepaid = data.payments.filter((x) => x.method !== "cod").reduce((s, x) => s + x.orders, 0);
  const totalPay = data.payments.reduce((s, x) => s + x.orders, 0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.8125rem] text-stone-500">{formatLongDate(now)}</p>
          <h1 className="mt-0.5 font-skin-display text-2xl font-semibold tracking-tight text-stone-900 sm:text-[1.75rem]">
            {greeting(now)}, {firstName(STORE_DETAILS.owner.name)}
          </h1>
          <p className="mt-1 text-sm text-stone-600">Here is how your store is doing.</p>
        </div>
        <RangeSwitch value={range} onChange={setRange} />
      </div>

      {newVisitor.length ? (
        <Link
          href={`/skincare/admin/orders/${newVisitor[0].id}`}
          className="mb-4 flex items-center gap-3 rounded-xl bg-skin-accent px-4 py-3 text-sm text-white shadow-sm hover:bg-skin-accent-hover"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex size-2.5 rounded-full bg-white" />
          </span>
          <span className="flex-1">
            <span className="font-semibold">
              {newVisitor.length === 1
                ? "You have a new order from this browser"
                : `${newVisitor.length} new orders from this browser`}
            </span>{" "}
            {newVisitor[0].id} from {newVisitor[0].address.name},{" "}
            {formatINR(newVisitor[0].totals.total)}
          </span>
          <span className="hidden items-center gap-1 font-medium sm:inline-flex">
            Open order <ArrowRight aria-hidden className="size-4" />
          </span>
        </Link>
      ) : null}

      <Card className="mb-6 overflow-hidden">
        <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center">
          <div className="flex items-start gap-3.5 lg:flex-1">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-skin-saffron-soft text-skin-saffron"
            >
              <Truck className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-stone-900">
                {open.length
                  ? `${plural(open.length, "order")} to ship today`
                  : "Nothing waiting to ship"}
              </h2>
              <p className="mt-0.5 text-sm text-stone-600">
                {open.length
                  ? "Confirm, pack and hand them over at the daily 5 pm courier pickup to keep delivery times short."
                  : "Every order has been handed to a courier. New orders will show up here."}
              </p>
            </div>
          </div>
          {open.length ? (
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
              {[
                { label: "To confirm", n: toConfirm, tab: "to-confirm", icon: PackageOpen },
                { label: "To pack", n: toPack, tab: "to-pack", icon: PackageCheck },
                { label: "Ready to ship", n: toShip, tab: "to-ship", icon: Truck },
              ].map((s) => (
                <Link
                  key={s.tab}
                  href={`/skincare/admin/orders?tab=${s.tab}`}
                  className="flex flex-col rounded-lg border border-stone-200 px-3 py-2 hover:border-stone-300 hover:bg-stone-50 sm:min-w-32"
                >
                  <span className="text-lg font-semibold text-stone-900 tabular-nums">{s.n}</span>
                  <span className="text-xs text-stone-600">{s.label}</span>
                </Link>
              ))}
              <ButtonLink
                href="/skincare/admin/orders?tab=open"
                variant="primary"
                className="col-span-3 sm:h-auto sm:self-stretch"
              >
                Start shipping <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </Card>

      <h2 className="sr-only">Key numbers, {w.title.toLowerCase()}</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard
          label="Revenue"
          value={formatINR(k.revenue)}
          delta={change(k.revenue, p.revenue)}
          compareLabel={w.compareLabel}
          note={`From ${plural(k.saleOrders, "order")}`}
        />
        <KpiCard
          label="Orders"
          value={formatNumber(k.orders)}
          delta={change(k.orders, p.orders)}
          compareLabel={w.compareLabel}
          note={`${formatNumber(k.orders - k.saleOrders)} cancelled or returned`}
        />
        <KpiCard
          label="Average order value"
          value={formatINR(k.aov)}
          delta={change(k.aov, p.aov)}
          compareLabel={w.compareLabel}
          note="Revenue per order"
        />
        <KpiCard
          label="Conversion rate"
          value={formatPercent(k.conversion, 2)}
          delta={p.sessions && p.orders ? k.conversion - p.conversion : null}
          unit="pts"
          compareLabel={w.compareLabel}
          note={`${formatNumber(k.sessions)} store sessions`}
        />
        <div className="col-span-2 md:col-span-1">
          <KpiCard
            label="Returning customers"
            value={formatPercent(k.returningRate, 0)}
            delta={p.customers ? k.returningRate - p.returningRate : null}
            unit="pts"
            compareLabel={w.compareLabel}
            note={`${k.returningCustomers} of ${plural(k.customers, "customer")}`}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Sales"
            description={`Revenue by ${range === "today" ? "hour" : "day"}, ${w.title.toLowerCase()}. Cancelled and returned orders are left out.`}
            action={
              <p className="text-right">
                <span className="block text-lg font-semibold text-stone-900 tabular-nums">
                  {formatINR(k.revenue)}
                </span>
              </p>
            }
          />
          <div className="px-4 pb-5 sm:px-5">
            <SalesChart
              buckets={w.buckets}
              current={data.series}
              previous={data.prevSeries}
              lastIndex={w.lastIndex}
              compareLabel={w.compareLabel}
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Orders by status"
            description={`${plural(k.orders, "order")} placed, ${w.title.toLowerCase()}`}
          />
          <div className="px-5 pb-5">
            <BarList
              dense
              empty="No orders in this period yet."
              rows={(Object.keys(data.statuses) as OrderStatus[]).map((s) => ({
                key: s,
                label: (
                  <span className="inline-flex items-center gap-2">
                    <span
                      aria-hidden
                      className="size-2 rounded-full"
                      style={{ background: STATUS_BAR[s] }}
                    />
                    {STATUS_LABEL[s]}
                  </span>
                ),
                value: data.statuses[s],
                display: formatNumber(data.statuses[s]),
                color: STATUS_BAR[s],
                href: `/skincare/admin/orders?tab=${STATUS_TAB[s]}`,
              }))}
            />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="Payment methods"
            description={
              totalPay
                ? `${formatPercent((prepaid / totalPay) * 100, 0)} prepaid, ${formatPercent(((totalPay - prepaid) / totalPay) * 100, 0)} cash on delivery`
                : "No orders in this period yet"
            }
          />
          <div className="px-5 pb-5">
            <Donut
              label="Orders by payment method"
              centerLabel="Orders"
              centerValue={formatNumber(totalPay)}
              formatValue={(v) => formatNumber(v)}
              segments={data.payments.map((x) => ({
                key: x.method,
                label: PAYMENT_LABEL[x.method],
                value: x.orders,
                color: PAYMENT_COLORS[x.method],
                detail: formatINR(x.revenue),
              }))}
            />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Top products"
            description="By sales, before coupons"
            action={
              <Link
                href="/skincare/admin/analytics"
                className="text-[0.8125rem] font-medium text-skin-accent hover:underline"
              >
                Analytics
              </Link>
            }
          />
          {data.top.length ? (
            <ol className="px-3 pb-3">
              {data.top.map((row, i) => (
                <li key={row.slug}>
                  <Link
                    href={`/skincare/admin/products/${row.slug}`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-stone-50"
                  >
                    <span className="w-4 text-center text-xs font-medium text-stone-500 tabular-nums">
                      {i + 1}
                    </span>
                    <ProductThumb spec={row.product?.visual} name={row.name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-stone-900">{row.name}</span>
                      <span className="block text-xs text-stone-500">
                        {plural(row.units, "unit")} sold
                      </span>
                    </span>
                    <span className="text-sm font-medium text-stone-900 tabular-nums">
                      {formatINR(row.revenue)}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState
              title="No sales in this period yet"
              description="Products will rank here once orders come in."
            />
          )}
        </Card>

        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader
            title="Low stock"
            description={`Sizes with fewer than ${LOW_STOCK} units`}
            action={
              <Link
                href="/skincare/admin/inventory?show=low"
                className="text-[0.8125rem] font-medium text-skin-accent hover:underline"
              >
                Inventory
              </Link>
            }
          />
          {lowStock.length ? (
            <ul className="px-3 pb-3">
              {lowStock.slice(0, 5).map(({ product, variant }) => (
                <li key={`${product.slug}-${variant.id}`}>
                  <Link
                    href={`/skincare/admin/inventory?show=low`}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-stone-50"
                  >
                    <ProductThumb spec={product.visual} name={product.name} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-stone-900">{product.name}</span>
                      <span className="block text-xs text-stone-500">{variant.size}</span>
                    </span>
                    <Badge tone={variant.stock === 0 ? "red" : "amber"}>
                      {variant.stock === 0 ? "Out of stock" : `${variant.stock} left`}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<PackageCheck />}
              title="Stock looks healthy"
              description={`Every size has ${LOW_STOCK} or more units.`}
            />
          )}
          {lowStock.length ? (
            <p
              className={cn(
                "flex items-center gap-2 border-t border-stone-100 px-5 py-3 text-xs text-amber-900",
              )}
            >
              <TriangleAlert aria-hidden className="size-3.5" />
              {plural(lowStock.length, "size")} running low. Restock soon to avoid missed orders.
            </p>
          ) : null}
        </Card>
      </div>

      <Card className="mt-4 sm:mt-6">
        <CardHeader
          title="Recent orders"
          description="The latest orders across all dates"
          action={
            <ButtonLink href="/skincare/admin/orders" size="sm">
              All orders
            </ButtonLink>
          }
        />
        <OrderList orders={orders.slice(0, 6)} caption="Recent orders" />
      </Card>
    </div>
  );
}
