"use client";

import { Package, Search, ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useProducts } from "@/sites/skincare/lib/store";
import { useOrders } from "@/sites/skincare/admin/lib/hooks";
import { deriveCustomers } from "@/sites/skincare/admin/lib/metrics";

type Result = {
  id: string;
  group: "Orders" | "Products" | "Customers";
  title: string;
  sub: string;
  href: string;
};

const ICONS = { Orders: ShoppingBag, Products: Package, Customers: User } as const;

/** Search orders (ID, name, phone, city), products and customers from the top bar. */
export default function GlobalSearch({
  className,
  autoFocus = false,
  onNavigate,
}: {
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const orders = useOrders();
  const products = useProducts({ includeInactive: true });
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const optionId = (i: number) => `${listId}-opt-${i}`;

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const digits = q.replace(/\D/g, "");
    const orderHits = orders
      .filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.address.name.toLowerCase().includes(q) ||
          o.address.city.toLowerCase().includes(q) ||
          (digits.length >= 2 && o.address.phone.replace(/\D/g, "").includes(digits)),
      )
      .slice(0, 5)
      .map<Result>((o) => ({
        id: `o-${o.id}`,
        group: "Orders",
        title: `${o.id} · ${o.address.name}`,
        sub: `${o.address.city}, ${formatINR(o.totals.total)}`,
        href: `/skincare/admin/orders/${o.id}`,
      }));
    const productHits = products
      .filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q))
      .slice(0, 4)
      .map<Result>((p) => ({
        id: `p-${p.slug}`,
        group: "Products",
        title: p.name,
        sub: p.variants.map((v) => v.size).join(", "),
        href: `/skincare/admin/products/${p.slug}`,
      }));
    const customerHits = deriveCustomers(orders)
      .filter((c) => c.name.toLowerCase().includes(q) || c.address.city.toLowerCase().includes(q))
      .slice(0, 3)
      .map<Result>((c) => ({
        id: `c-${c.key}`,
        group: "Customers",
        title: c.name,
        sub: `${c.address.city}, ${c.orders.length} ${c.orders.length === 1 ? "order" : "orders"}`,
        href: `/skincare/admin/customers?c=${encodeURIComponent(c.key)}`,
      }));
    return [...orderHits, ...productHits, ...customerHits];
  }, [query, orders, products]);

  const go = (r: Result | undefined) => {
    if (!r) return;
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(r.href);
  };

  const expanded = open && query.trim().length >= 2;

  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-500"
      />
      <input
        type="search"
        role="combobox"
        aria-label="Search orders, products and customers"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={expanded && results[active] ? optionId(active) : undefined}
        autoFocus={autoFocus}
        value={query}
        placeholder="Search orders, products, customers"
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((a) => (results.length ? (a + 1) % results.length : 0));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            go(results[active]);
          } else if (e.key === "Escape") {
            if (query) setQuery("");
            else setOpen(false);
          }
        }}
        className="h-9 w-full rounded-lg border border-stone-300 bg-stone-50 pr-3 pl-9 text-sm text-stone-900 placeholder:text-stone-500 focus:border-skin-accent focus:bg-white focus:outline-2 focus:outline-offset-0 focus:outline-skin-accent/25 [&::-webkit-search-cancel-button]:hidden"
      />
      {expanded ? (
        <div className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-[70vh] overflow-y-auto rounded-xl border border-stone-200 bg-white py-1.5 shadow-xl">
          {results.length ? (
            <ul id={listId} role="listbox" aria-label="Search results">
              {results.map((r, i) => {
                const Icon = ICONS[r.group];
                const first = i === 0 || results[i - 1].group !== r.group;
                return (
                  <li key={r.id} role="presentation">
                    {first ? (
                      <p
                        role="presentation"
                        className="px-3 pt-2 pb-1 text-[0.6875rem] font-semibold tracking-wide text-stone-500 uppercase"
                      >
                        {r.group}
                      </p>
                    ) : null}
                    <div
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === active}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => go(r)}
                      onMouseMove={() => setActive(i)}
                      className={cn(
                        "mx-1.5 flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2",
                        i === active ? "bg-stone-100" : "",
                      )}
                    >
                      <Icon aria-hidden className="size-4 shrink-0 text-stone-500" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-stone-900">{r.title}</span>
                        <span className="block truncate text-xs text-stone-500">{r.sub}</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p id={listId} className="px-4 py-6 text-center text-sm text-stone-500">
              Nothing matches &ldquo;{query.trim()}&rdquo;.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
