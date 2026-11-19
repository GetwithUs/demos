import { CATEGORIES, CONCERNS, COUPONS } from "@/sites/skincare/data/catalog";
import type {
  Address,
  CategoryId,
  ConcernId,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
} from "@/sites/skincare/data/types";

/**
 * Every number the owner dashboard shows, worked out from the orders in the store. Pure
 * functions so the overview, analytics and tests agree. Sessions (and the funnel above
 * "orders") are made up, but derived from the real order count so the rates stay believable.
 */

export type RangeKey = "today" | "7d" | "30d";

export const RANGES: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
];

export const LOW_STOCK = 15;

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export type Period = { start: number; end: number };

export type Bucket = {
  start: number;
  end: number;
  /** Axis label, e.g. "18 Nov" or "3 pm". */
  label: string;
  /** Tooltip and table label, e.g. "Tue, 18 Nov" or "3 pm to 4 pm". */
  long: string;
};

export type RangeWindow = {
  key: RangeKey;
  period: Period;
  prevPeriod: Period;
  buckets: Bucket[];
  prevBuckets: Bucket[];
  /** Last bucket with data so far (today's chart stops at the current hour). */
  lastIndex: number;
  /** "vs yesterday", "vs previous 7 days". */
  compareLabel: string;
  /** "Today", "Last 7 days". */
  title: string;
};

export function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function addDays(t: number, n: number): number {
  const d = new Date(t);
  d.setDate(d.getDate() + n);
  return d.getTime();
}

const dayFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const weekdayFmt = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

function hourLabel(h: number): string {
  const suffix = h < 12 ? "am" : "pm";
  const n = h % 12 === 0 ? 12 : h % 12;
  return `${n} ${suffix}`;
}

function dayBuckets(start: number, days: number): Bucket[] {
  return Array.from({ length: days }, (_, i) => {
    const s = addDays(start, i);
    return {
      start: s,
      end: addDays(start, i + 1),
      label: dayFmt.format(s),
      long: weekdayFmt.format(s),
    };
  });
}

function hourBuckets(dayStart: number): Bucket[] {
  return Array.from({ length: 24 }, (_, h) => ({
    start: dayStart + h * HOUR,
    end: dayStart + (h + 1) * HOUR,
    label: hourLabel(h),
    long: `${hourLabel(h)} to ${hourLabel((h + 1) % 24)}`,
  }));
}

export function rangeWindow(key: RangeKey, now: number): RangeWindow {
  const today = startOfDay(now);
  if (key === "today") {
    const yesterday = addDays(today, -1);
    const elapsed = now - today;
    return {
      key,
      // Up to the end of today, so an order placed seconds ago in another tab still counts.
      period: { start: today, end: addDays(today, 1) },
      // Yesterday up to the same time of day, for a like-for-like comparison.
      prevPeriod: { start: yesterday, end: yesterday + elapsed + 1 },
      buckets: hourBuckets(today),
      prevBuckets: hourBuckets(yesterday),
      lastIndex: new Date(now).getHours(),
      compareLabel: "vs yesterday",
      title: "Today",
    };
  }
  const days = key === "7d" ? 7 : 30;
  const start = addDays(today, -(days - 1));
  const prevStart = addDays(start, -days);
  return {
    key,
    period: { start, end: addDays(today, 1) },
    prevPeriod: { start: prevStart, end: start },
    buckets: dayBuckets(start, days),
    prevBuckets: dayBuckets(prevStart, days),
    lastIndex: days - 1,
    compareLabel: `vs previous ${days} days`,
    title: `Last ${days} days`,
  };
}

export const orderTime = (o: Order) => Date.parse(o.createdAt);

export function inPeriod(o: Order, p: Period): boolean {
  const t = orderTime(o);
  return t >= p.start && t < p.end;
}

/** Cancelled and returned orders do not count as sales. */
export function isSale(o: Order): boolean {
  return o.status !== "cancelled" && o.status !== "returned";
}

/** Orders that still need the owner: confirm, pack or ship. */
export const OPEN_STATUSES: OrderStatus[] = ["placed", "confirmed", "packed"];
export const isOpen = (o: Order) => OPEN_STATUSES.includes(o.status);

export function revenueOf(orders: Order[]): number {
  return orders.reduce((sum, o) => sum + (isSale(o) ? o.totals.total : 0), 0);
}

/** A stable 0 to 29 number for a calendar day, so made-up traffic does not change on reload. */
function dayNoise(dayStart: number): number {
  const d = new Date(dayStart);
  let h = (d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate()) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 0x5bd1e995) >>> 0;
  h ^= h >>> 15;
  return h % 30;
}

/**
 * Made-up store sessions: a quiet baseline of 40 to 69 visits a day (scaled for part days)
 * plus 22 visits for every order, which keeps conversion near 2 to 2.5%.
 */
export function sessionsFor(orders: Order[], p: Period, now = p.end): number {
  let total = 0;
  const end = Math.min(p.end, now);
  for (let day = startOfDay(p.start); day < end; day = addDays(day, 1)) {
    const next = addDays(day, 1);
    const covered = Math.min(next, end) - Math.max(day, p.start);
    total += Math.round((40 + dayNoise(day)) * Math.max(0, Math.min(1, covered / DAY)));
  }
  const count = orders.filter((o) => inPeriod(o, p)).length;
  return total + count * 22;
}

export function customerKey(a: Pick<Address, "name" | "phone">): string {
  return `${a.name.trim().toLowerCase()}|${a.phone.replace(/\s+/g, "")}`;
}

export type Kpis = {
  revenue: number;
  orders: number;
  saleOrders: number;
  aov: number;
  sessions: number;
  conversion: number;
  customers: number;
  returningCustomers: number;
  returningRate: number;
};

export function computeKpis(all: Order[], p: Period, now = p.end): Kpis {
  const inRange = all.filter((o) => inPeriod(o, p));
  const sales = inRange.filter(isSale);
  const revenue = revenueOf(sales);
  const sessions = sessionsFor(all, p, now);
  const customers = new Set(inRange.map((o) => customerKey(o.address)));
  // A customer is returning when, by the end of the period, they have ordered more than once.
  const countUpToEnd = new Map<string, number>();
  for (const o of all) {
    if (orderTime(o) >= p.end) continue;
    const k = customerKey(o.address);
    countUpToEnd.set(k, (countUpToEnd.get(k) ?? 0) + 1);
  }
  const returning = [...customers].filter((k) => (countUpToEnd.get(k) ?? 0) > 1).length;
  return {
    revenue,
    orders: inRange.length,
    saleOrders: sales.length,
    aov: sales.length ? Math.round(revenue / sales.length) : 0,
    sessions,
    conversion: sessions ? (inRange.length / sessions) * 100 : 0,
    customers: customers.size,
    returningCustomers: returning,
    returningRate: customers.size ? (returning / customers.size) * 100 : 0,
  };
}

/** Percentage change, or null when there is nothing to compare with. */
export function change(current: number, previous: number): number | null {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

export type SeriesPoint = { revenue: number; orders: number };

export function seriesFor(orders: Order[], buckets: Bucket[]): SeriesPoint[] {
  const points = buckets.map(() => ({ revenue: 0, orders: 0 }));
  if (!buckets.length) return points;
  const first = buckets[0].start;
  const last = buckets[buckets.length - 1].end;
  for (const o of orders) {
    const t = orderTime(o);
    if (t < first || t >= last) continue;
    const i = buckets.findIndex((b) => t >= b.start && t < b.end);
    if (i < 0) continue;
    points[i].orders += 1;
    if (isSale(o)) points[i].revenue += o.totals.total;
  }
  return points;
}

export function statusCounts(orders: Order[]): Record<OrderStatus, number> {
  const counts: Record<OrderStatus, number> = {
    placed: 0,
    confirmed: 0,
    packed: 0,
    shipped: 0,
    "out-for-delivery": 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
  };
  for (const o of orders) counts[o.status] += 1;
  return counts;
}

export type PaymentSplit = { method: PaymentMethod; orders: number; revenue: number }[];

export function paymentSplit(orders: Order[]): PaymentSplit {
  const methods: PaymentMethod[] = ["upi", "card", "netbanking", "cod"];
  return methods.map((method) => {
    const list = orders.filter((o) => o.payment.method === method);
    return { method, orders: list.length, revenue: revenueOf(list) };
  });
}

export type ProductSales = {
  slug: string;
  name: string;
  units: number;
  revenue: number;
  product?: Product;
};

/** Item sales at selling price (before coupons and delivery), from orders that count as sales. */
export function productSales(orders: Order[], products: Product[]): ProductSales[] {
  const map = new Map<string, ProductSales>();
  for (const o of orders) {
    if (!isSale(o)) continue;
    for (const item of o.items) {
      const row = map.get(item.slug) ?? {
        slug: item.slug,
        name: item.name,
        units: 0,
        revenue: 0,
        product: products.find((p) => p.slug === item.slug),
      };
      row.units += item.qty;
      row.revenue += item.price * item.qty;
      map.set(item.slug, row);
    }
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue || b.units - a.units);
}

export type GroupRow = { key: string; label: string; revenue: number; orders: number };

export function groupRevenue(orders: Order[], keyOf: (o: Order) => string): GroupRow[] {
  const map = new Map<string, GroupRow>();
  for (const o of orders) {
    const key = keyOf(o);
    const row = map.get(key) ?? { key, label: key, revenue: 0, orders: 0 };
    row.orders += 1;
    if (isSale(o)) row.revenue += o.totals.total;
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue || b.orders - a.orders);
}

export type CategoryRow = { category: CategoryId; label: string; units: number; revenue: number };

export function categorySales(orders: Order[], products: Product[]): CategoryRow[] {
  const map = new Map<CategoryId, CategoryRow>();
  for (const row of productSales(orders, products)) {
    const category = row.product?.category;
    if (!category) continue;
    const c = map.get(category) ?? {
      category,
      label: CATEGORIES[category].plural,
      units: 0,
      revenue: 0,
    };
    c.units += row.units;
    c.revenue += row.revenue;
    map.set(category, c);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

export type ConcernRow = { concern: ConcernId; label: string; units: number };

/** Units sold for each skin concern; a product made for three concerns counts for each. */
export function concernSales(orders: Order[], products: Product[]): ConcernRow[] {
  const map = new Map<ConcernId, ConcernRow>();
  for (const row of productSales(orders, products)) {
    for (const concern of row.product?.concerns ?? []) {
      const c = map.get(concern) ?? { concern, label: CONCERNS[concern].label, units: 0 };
      c.units += row.units;
      map.set(concern, c);
    }
  }
  return [...map.values()].sort((a, b) => b.units - a.units);
}

export type Customer = {
  key: string;
  name: string;
  phone: string;
  email?: string;
  address: Address;
  /** Newest first. */
  orders: Order[];
  spent: number;
  firstOrderAt: string;
  lastOrderAt: string;
  codOrders: number;
  prepaidOrders: number;
  fromThisBrowser: boolean;
};

export function deriveCustomers(orders: Order[]): Customer[] {
  const map = new Map<string, Order[]>();
  for (const o of orders) {
    const k = customerKey(o.address);
    map.set(k, [...(map.get(k) ?? []), o]);
  }
  return [...map.entries()]
    .map(([key, list]) => {
      const sorted = [...list].sort((a, b) => orderTime(b) - orderTime(a));
      const latest = sorted[0];
      return {
        key,
        name: latest.address.name,
        phone: latest.address.phone,
        email: sorted.find((o) => o.address.email)?.address.email,
        address: latest.address,
        orders: sorted,
        spent: revenueOf(sorted),
        firstOrderAt: sorted[sorted.length - 1].createdAt,
        lastOrderAt: latest.createdAt,
        codOrders: sorted.filter((o) => o.payment.method === "cod").length,
        prepaidOrders: sorted.filter((o) => o.payment.method !== "cod").length,
        fromThisBrowser: sorted.some((o) => o.source === "visitor"),
      };
    })
    .sort((a, b) => b.lastOrderAt.localeCompare(a.lastOrderAt));
}

/** Share of customers who have ordered more than once. */
export function repeatRate(customers: Customer[]): number {
  if (!customers.length) return 0;
  return (customers.filter((c) => c.orders.length > 1).length / customers.length) * 100;
}

export type FunnelStep = { key: string; label: string; value: number; real: boolean };

/**
 * Store funnel for a period. Orders are real; the steps above are demo numbers derived from
 * them: checkouts about 1.9x orders, carts about 2x checkouts, product views about 58% of sessions.
 */
export function funnel(all: Order[], p: Period, now = p.end): FunnelStep[] {
  const orders = all.filter((o) => inPeriod(o, p)).length;
  const sessions = sessionsFor(all, p, now);
  const checkout = orders ? Math.round(orders * 1.9) : Math.round(sessions * 0.004);
  const cart = Math.round(checkout * 1.95 + sessions * 0.01);
  const views = Math.max(cart, Math.round(sessions * 0.58));
  return [
    { key: "sessions", label: "Sessions", value: Math.max(views, sessions), real: false },
    { key: "views", label: "Viewed a product", value: views, real: false },
    { key: "cart", label: "Added to cart", value: cart, real: false },
    { key: "checkout", label: "Reached checkout", value: checkout, real: false },
    { key: "orders", label: "Placed an order", value: orders, real: true },
  ];
}

export type CouponStats = {
  code: string;
  description: string;
  active: boolean;
  uses: number;
  discount: number;
  revenue: number;
  lastUsed?: string;
};

export function couponStats(orders: Order[]): CouponStats[] {
  return COUPONS.map((c) => {
    const used = orders.filter((o) => o.totals.couponCode === c.code);
    const sales = used.filter(isSale);
    return {
      code: c.code,
      description: c.description,
      active: c.active,
      uses: used.length,
      discount: sales.reduce((sum, o) => sum + o.totals.couponDiscount, 0),
      revenue: revenueOf(sales),
      lastUsed: used
        .map((o) => o.createdAt)
        .sort()
        .at(-1),
    };
  });
}

/** Prepaid orders get an automatic discount (catalog SHIPPING.prepaidPercent). */
export function prepaidDiscountStats(orders: Order[]): {
  uses: number;
  discount: number;
  revenue: number;
} {
  const used = orders.filter((o) => o.totals.prepaidDiscount > 0);
  const sales = used.filter(isSale);
  return {
    uses: used.length,
    discount: sales.reduce((sum, o) => sum + o.totals.prepaidDiscount, 0),
    revenue: revenueOf(sales),
  };
}

/** Rounds up to a clean axis maximum (1, 2, 2.5 or 5 times a power of ten). */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(value)));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (value <= m * exp) return m * exp;
  }
  return 10 * exp;
}
