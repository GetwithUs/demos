"use client";

import { useMemo, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PRODUCTS } from "@/sites/skincare/data/products";
import type {
  Address,
  Badge,
  CartLine,
  CartTotals,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  Variant,
} from "@/sites/skincare/data/types";
import { COURIERS, makeSeedOrders, STATUS_FLOW } from "@/sites/skincare/lib/seed";

/** What the owner can change on a catalogue product from the dashboard. */
export type ProductPatch = Partial<
  Pick<Product, "name" | "tagline" | "active" | "badges" | "description">
>;
export type VariantPatch = Partial<Pick<Variant, "price" | "mrp" | "stock">>;

type ProductOverride = ProductPatch & { variants?: Record<string, VariantPatch> };

/** The demo login, shown pre-filled on the owner sign-in screen. */
export const OWNER_LOGIN = { email: "owner@oruviskin.example", password: "demo1234" } as const;

type DemoState = {
  cart: CartLine[];
  couponCode?: string;
  wishlist: string[];
  recentlyViewed: string[];
  orders: Order[];
  seeded: boolean;
  overrides: Record<string, ProductOverride>;
  addedProducts: Product[];
  ownerSignedIn: boolean;

  addToCart: (slug: string, variantId: string, qty?: number) => void;
  setQty: (slug: string, variantId: string, qty: number) => void;
  removeFromCart: (slug: string, variantId: string) => void;
  clearCart: () => void;
  setCoupon: (code: string | undefined) => void;
  toggleWishlist: (slug: string) => void;
  markViewed: (slug: string) => void;
  /** Places an order from already-computed items and totals, takes stock, empties the cart. */
  placeOrder: (input: {
    items: OrderItem[];
    totals: CartTotals;
    address: Address;
    payment: PaymentMethod;
  }) => Order;
  setOrderStatus: (id: string, status: OrderStatus, note?: string) => void;
  /** Moves an order one step along placed, confirmed, packed, shipped, out for delivery, delivered. */
  advanceOrder: (id: string) => void;
  /** Owner dashboard: records the courier and AWB chosen when shipping (call before setOrderStatus "shipped"). */
  setShipment: (id: string, shipment: { courier: string; awb: string }) => void;
  updateProduct: (slug: string, patch: ProductPatch) => void;
  updateVariant: (slug: string, variantId: string, patch: VariantPatch) => void;
  addProduct: (product: Product) => void;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
  /** Back to the starting catalogue and sample orders; clears cart, wishlist and visitor orders. */
  resetDemo: () => void;
};

function randomId(prefix: string, digits = 5): string {
  const n = Math.floor(Math.random() * 10 ** digits);
  return `${prefix}${String(n).padStart(digits, "0")}`;
}

const initial = {
  cart: [] as CartLine[],
  couponCode: undefined as string | undefined,
  wishlist: [] as string[],
  recentlyViewed: [] as string[],
  orders: [] as Order[],
  seeded: false,
  overrides: {} as Record<string, ProductOverride>,
  addedProducts: [] as Product[],
  ownerSignedIn: false,
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      ...initial,

      addToCart: (slug, variantId, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((l) => l.slug === slug && l.variantId === variantId);
          return {
            cart: existing
              ? s.cart.map((l) => (l === existing ? { ...l, qty: Math.min(10, l.qty + qty) } : l))
              : [...s.cart, { slug, variantId, qty: Math.min(10, qty) }],
          };
        }),
      setQty: (slug, variantId, qty) =>
        set((s) => ({
          cart:
            qty < 1
              ? s.cart.filter((l) => !(l.slug === slug && l.variantId === variantId))
              : s.cart.map((l) =>
                  l.slug === slug && l.variantId === variantId
                    ? { ...l, qty: Math.min(10, qty) }
                    : l,
                ),
        })),
      removeFromCart: (slug, variantId) =>
        set((s) => ({
          cart: s.cart.filter((l) => !(l.slug === slug && l.variantId === variantId)),
        })),
      clearCart: () => set({ cart: [], couponCode: undefined }),
      setCoupon: (code) => set({ couponCode: code?.trim().toUpperCase() || undefined }),
      toggleWishlist: (slug) =>
        set((s) => ({
          wishlist: s.wishlist.includes(slug)
            ? s.wishlist.filter((x) => x !== slug)
            : [slug, ...s.wishlist],
        })),
      markViewed: (slug) =>
        set((s) => ({
          recentlyViewed: [slug, ...s.recentlyViewed.filter((x) => x !== slug)].slice(0, 8),
        })),

      placeOrder: ({ items, totals, address, payment }) => {
        const now = new Date().toISOString();
        const order: Order = {
          id: randomId("ORV-"),
          createdAt: now,
          items,
          totals,
          payment: {
            method: payment,
            status: payment === "cod" ? "pending" : "paid",
            ref:
              payment === "cod" ? undefined : `pay_demo_${Math.random().toString(36).slice(2, 14)}`,
          },
          address,
          status: "placed",
          history: [{ status: "placed", at: now }],
          source: "visitor",
        };
        set((s) => {
          const overrides = { ...s.overrides };
          for (const item of items) {
            const base = mergedProduct(item.slug, s);
            const variant = base?.variants.find((v) => v.id === item.variantId);
            if (!variant) continue;
            const o = { ...overrides[item.slug] };
            o.variants = {
              ...o.variants,
              [item.variantId]: {
                ...o.variants?.[item.variantId],
                stock: Math.max(0, variant.stock - item.qty),
              },
            };
            overrides[item.slug] = o;
          }
          return { orders: [order, ...s.orders], cart: [], couponCode: undefined, overrides };
        });
        return order;
      },

      setOrderStatus: (id, status, note) =>
        set((s) => ({
          orders: s.orders.map((o) => {
            if (o.id !== id || o.status === status) return o;
            const shipped = STATUS_FLOW.indexOf(status) >= STATUS_FLOW.indexOf("shipped");
            return {
              ...o,
              status,
              history: [...o.history, { status, at: new Date().toISOString(), note }],
              courier: o.courier ?? (shipped ? COURIERS[0] : undefined),
              awb: o.awb ?? (shipped ? String(Math.floor(1e11 + Math.random() * 9e11)) : undefined),
              payment: {
                ...o.payment,
                status:
                  status === "cancelled" || status === "returned"
                    ? o.payment.method === "cod"
                      ? o.payment.status
                      : "refunded"
                    : status === "delivered" && o.payment.method === "cod"
                      ? "paid"
                      : o.payment.status,
              },
            };
          }),
        })),
      advanceOrder: (id) => {
        const order = get().orders.find((o) => o.id === id);
        if (!order) return;
        const next = STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1];
        if (next) get().setOrderStatus(id, next);
      },
      setShipment: (id, { courier, awb }) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, courier, awb } : o)) })),

      updateProduct: (slug, patch) =>
        set((s) => ({ overrides: { ...s.overrides, [slug]: { ...s.overrides[slug], ...patch } } })),
      updateVariant: (slug, variantId, patch) =>
        set((s) => {
          const o = s.overrides[slug] ?? {};
          return {
            overrides: {
              ...s.overrides,
              [slug]: {
                ...o,
                variants: { ...o.variants, [variantId]: { ...o.variants?.[variantId], ...patch } },
              },
            },
          };
        }),
      addProduct: (product) => set((s) => ({ addedProducts: [product, ...s.addedProducts] })),

      signIn: (email, password) => {
        const ok =
          email.trim().toLowerCase() === OWNER_LOGIN.email && password === OWNER_LOGIN.password;
        if (ok) set({ ownerSignedIn: true });
        return ok;
      },
      signOut: () => set({ ownerSignedIn: false }),

      resetDemo: () => set({ ...initial, orders: makeSeedOrders(), seeded: true }),
    }),
    {
      name: "oruvi-demo-v1",
      storage: createJSONStorage(() => localStorage),
      // Read localStorage only in the browser, after the first render (see SkincareStoreHydrator).
      skipHydration: true,
      partialize: (s) => ({
        cart: s.cart,
        couponCode: s.couponCode,
        wishlist: s.wishlist,
        recentlyViewed: s.recentlyViewed,
        orders: s.orders,
        seeded: s.seeded,
        overrides: s.overrides,
        addedProducts: s.addedProducts,
        ownerSignedIn: s.ownerSignedIn,
      }),
    },
  ),
);

/** Loads saved data from localStorage and adds the sample orders the first time. Call once, on mount. */
export async function hydrateDemoStore(): Promise<void> {
  await useDemoStore.persist.rehydrate();
  if (!useDemoStore.getState().seeded) {
    useDemoStore.setState({
      orders: [...useDemoStore.getState().orders, ...makeSeedOrders()],
      seeded: true,
    });
  }
}

/** False on the server and until saved data has loaded; use it to avoid showing an empty cart flash. */
export function useStoreHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useDemoStore.persist.onFinishHydration(onChange),
    () => useDemoStore.persist.hasHydrated(),
    () => false,
  );
}

function applyOverride(product: Product, o: ProductOverride | undefined): Product {
  if (!o) return product;
  const { variants: variantPatches, ...patch } = o;
  return {
    ...product,
    ...patch,
    variants: product.variants.map((v) => ({ ...v, ...variantPatches?.[v.id] })),
  };
}

function mergedProduct(
  slug: string,
  s: Pick<DemoState, "overrides" | "addedProducts">,
): Product | undefined {
  const base =
    PRODUCTS.find((p) => p.slug === slug) ?? s.addedProducts.find((p) => p.slug === slug);
  return base && applyOverride(base, s.overrides[slug]);
}

/**
 * The catalogue with the owner's dashboard changes applied. The shop passes nothing and gets
 * only active products; the dashboard passes includeInactive to see everything.
 */
export function useProducts({
  includeInactive = false,
}: { includeInactive?: boolean } = {}): Product[] {
  const overrides = useDemoStore((s) => s.overrides);
  const added = useDemoStore((s) => s.addedProducts);
  return useMemo(() => {
    const all = [...PRODUCTS, ...added].map((p) => applyOverride(p, overrides[p.slug]));
    return includeInactive ? all : all.filter((p) => p.active);
  }, [overrides, added, includeInactive]);
}

/** One product with dashboard changes applied (undefined if unknown or switched off). */
export function useProduct(slug: string, { includeInactive = false } = {}): Product | undefined {
  const products = useProducts({ includeInactive });
  return products.find((p) => p.slug === slug);
}

/** Total stock across sizes. */
export function totalStock(product: Product): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export type { Badge };
