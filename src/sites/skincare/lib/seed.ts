import { PRODUCTS } from "@/sites/skincare/data/products";
import type {
  Address,
  Order,
  OrderEvent,
  OrderStatus,
  PaymentMethod,
} from "@/sites/skincare/data/types";
import { computeTotals } from "@/sites/skincare/lib/pricing";
import { COUPONS } from "@/sites/skincare/data/catalog";

/** Small deterministic random generator, so every visitor starts with the same sample data. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Customer = Omit<Address, "line1" | "line2" | "landmark">;

/** Where customers live (weighted by repeats in this list: the home city and metros order most). */
const PLACES: Pick<Address, "city" | "state" | "pincode">[] = [
  { city: "Dehradun", state: "Uttarakhand", pincode: "248001" },
  { city: "New Delhi", state: "Delhi", pincode: "110017" },
  { city: "Mumbai", state: "Maharashtra", pincode: "400050" },
  { city: "Bengaluru", state: "Karnataka", pincode: "560038" },
  { city: "Hyderabad", state: "Telangana", pincode: "500034" },
  { city: "Dehradun", state: "Uttarakhand", pincode: "248009" },
  { city: "Kochi", state: "Kerala", pincode: "682020" },
  { city: "Kolkata", state: "West Bengal", pincode: "700019" },
  { city: "Gurugram", state: "Haryana", pincode: "122002" },
  { city: "Haridwar", state: "Uttarakhand", pincode: "249401" },
  { city: "Chandigarh", state: "Chandigarh", pincode: "160017" },
  { city: "Pune", state: "Maharashtra", pincode: "411001" },
  { city: "Chennai", state: "Tamil Nadu", pincode: "600040" },
  { city: "Jaipur", state: "Rajasthan", pincode: "302017" },
  { city: "Dehradun", state: "Uttarakhand", pincode: "248006" },
  { city: "Lucknow", state: "Uttar Pradesh", pincode: "226010" },
  { city: "Noida", state: "Uttar Pradesh", pincode: "201301" },
  { city: "Ahmedabad", state: "Gujarat", pincode: "380015" },
  { city: "Dehradun", state: "Uttarakhand", pincode: "248002" },
  { city: "New Delhi", state: "Delhi", pincode: "110024" },
  { city: "Bengaluru", state: "Karnataka", pincode: "560102" },
  { city: "Mumbai", state: "Maharashtra", pincode: "400076" },
];

const FIRST_NAMES = [
  "Ananya",
  "Priya",
  "Rohan",
  "Sneha",
  "Kavya",
  "Aditi",
  "Meera",
  "Ishita",
  "Neha",
  "Arjun",
  "Simran",
  "Tanvi",
  "Divya",
  "Riya",
  "Mansi",
  "Pooja",
  "Zoya",
  "Nisha",
  "Aarav",
  "Shreya",
  "Kritika",
  "Vikram",
  "Sana",
  "Isha",
  "Nikhil",
  "Anjali",
  "Rhea",
  "Karan",
  "Pallavi",
  "Sakshi",
];
const LAST_NAMES = [
  "Rawat",
  "Sharma",
  "Mehta",
  "Iyer",
  "Reddy",
  "Bisht",
  "Nair",
  "Banerjee",
  "Gupta",
  "Negi",
  "Kaur",
  "Joshi",
  "Krishnan",
  "Agarwal",
  "Thapliyal",
  "Verma",
  "Khan",
  "Patel",
  "Menon",
  "Das",
];

/** A large pool of different customers, so repeat-purchase numbers look like a real young brand. */
function makeCustomers(rand: () => number, count = 400): Customer[] {
  const names = new Set<string>();
  const customers: Customer[] = [];
  while (customers.length < count) {
    const name = `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`;
    if (names.has(name)) continue;
    names.add(name);
    const phone = `${pick(rand, ["98", "99", "97", "96", "94", "90", "88", "70"])}XXXXXX${String(Math.floor(rand() * 100)).padStart(2, "0")}`;
    customers.push({ name, phone, ...pick(rand, PLACES) });
  }
  return customers;
}

const STREETS = [
  "Flat 302, Green Avenue",
  "House 14, Lane 3",
  "B-21, Sunshine Apartments",
  "45, Park View Road",
  "Plot 9, Sector 2",
  "C-704, Lakeview Towers",
];

export const COURIERS = ["Delhivery", "Blue Dart", "Ekart", "Xpressbees"] as const;

/** Order of the normal journey; cancelled and returned branch off it. */
export const STATUS_FLOW: OrderStatus[] = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out-for-delivery",
  "delivered",
];

function pick<T>(rand: () => number, list: readonly T[]): T {
  return list[Math.floor(rand() * list.length)];
}

/** Bestsellers sell more: weight by review count. */
function pickProduct(rand: () => number) {
  const total = PRODUCTS.reduce((sum, p) => sum + p.reviewCount, 0);
  let r = rand() * total;
  for (const p of PRODUCTS) {
    r -= p.reviewCount;
    if (r <= 0) return p;
  }
  return PRODUCTS[0];
}

/** How many sample orders, over how many days up to today. */
export const SEED_ORDER_COUNT = 165;
export const SEED_DAYS = 60;
const LOYAL_SHARE = 0.15;
/** Chosen so the dashboard shows steady growth and a typical repeat rate (see tests). */
const SEED = 20261265;

/**
 * Sample orders over the last 60 days, ending today, for the owner dashboard, with steady
 * growth and a few hundred customers (so 30-day comparisons and repeat rates look real). Older
 * orders are delivered; recent ones are still moving. Generated once per browser and kept.
 */
export function makeSeedOrders(
  now: Date = new Date(),
  count = SEED_ORDER_COUNT,
  seed = SEED,
): Order[] {
  const rand = mulberry32(seed);
  const customers = makeCustomers(rand);
  // Some orders come from a small core of loyal customers; most from new ones.
  const loyal = customers.slice(0, 20);
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    // Skew towards recent days so the chart trends up.
    const daysAgo = Math.floor(Math.pow(rand(), 1.12) * SEED_DAYS);
    const created = new Date(now);
    created.setDate(created.getDate() - daysAgo);
    created.setHours(8 + Math.floor(rand() * 14), Math.floor(rand() * 60), 0, 0);
    if (created > now) created.setTime(now.getTime() - (i + 1) * 17 * 60 * 1000);

    const lineCount = rand() < 0.55 ? 1 : rand() < 0.8 ? 2 : 3;
    const items = new Map<string, Order["items"][number]>();
    for (let l = 0; l < lineCount; l++) {
      const product = pickProduct(rand);
      const variant = pick(rand, product.variants);
      const key = `${product.slug}:${variant.id}`;
      const existing = items.get(key);
      if (existing) existing.qty += 1;
      else
        items.set(key, {
          slug: product.slug,
          variantId: variant.id,
          name: product.name,
          size: variant.size,
          price: variant.price,
          mrp: variant.mrp,
          qty: rand() < 0.12 ? 2 : 1,
        });
    }
    const orderItems = [...items.values()];
    const methodRoll = rand();
    const method: PaymentMethod =
      methodRoll < 0.55
        ? "upi"
        : methodRoll < 0.7
          ? "card"
          : methodRoll < 0.75
            ? "netbanking"
            : "cod";
    const coupon =
      rand() < 0.3
        ? pick(
            rand,
            COUPONS.filter((c) => !c.firstOrderOnly && !c.minItems),
          )
        : undefined;
    const totals = computeTotals(orderItems, { coupon, payment: method });

    let status: OrderStatus;
    if (daysAgo >= 7)
      status = rand() < 0.06 ? "returned" : rand() < 0.05 ? "cancelled" : "delivered";
    else if (daysAgo >= 4) status = rand() < 0.75 ? "delivered" : "out-for-delivery";
    else if (daysAgo >= 2)
      status = pick(rand, ["shipped", "shipped", "out-for-delivery", "delivered"] as const);
    else if (daysAgo === 1) status = pick(rand, ["packed", "shipped", "confirmed"] as const);
    else status = pick(rand, ["placed", "placed", "confirmed", "packed"] as const);

    const history: OrderEvent[] = [];
    const stepAt = new Date(created);
    const lastIndex = STATUS_FLOW.indexOf(
      status === "cancelled" ? "confirmed" : status === "returned" ? "delivered" : status,
    );
    for (let s = 0; s <= lastIndex; s++) {
      history.push({ status: STATUS_FLOW[s], at: stepAt.toISOString() });
      stepAt.setHours(stepAt.getHours() + (s < 2 ? 3 : 20));
      if (stepAt > now) stepAt.setTime(now.getTime());
    }
    if (status === "cancelled")
      history.push({ status, at: stepAt.toISOString(), note: "Cancelled by customer" });
    if (status === "returned")
      history.push({ status, at: stepAt.toISOString(), note: "Unopened product returned" });

    const customer = rand() < LOYAL_SHARE ? pick(rand, loyal) : pick(rand, customers);
    const shipped =
      STATUS_FLOW.indexOf(status) >= STATUS_FLOW.indexOf("shipped") || status === "returned";
    orders.push({
      id: `ORV-${String(41200 + i * 7 + Math.floor(rand() * 6)).padStart(5, "0")}`,
      createdAt: created.toISOString(),
      items: orderItems,
      totals,
      payment: {
        method,
        status:
          method === "cod"
            ? status === "delivered"
              ? "paid"
              : "pending"
            : status === "returned" || status === "cancelled"
              ? "refunded"
              : "paid",
        ref: method === "cod" ? undefined : `pay_demo_${Math.floor(rand() * 1e12).toString(36)}`,
      },
      address: { ...customer, line1: pick(rand, STREETS) },
      status,
      history,
      courier: shipped ? pick(rand, COURIERS) : undefined,
      awb: shipped ? String(Math.floor(1e11 + rand() * 9e11)) : undefined,
      source: "seed",
    });
  }
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
