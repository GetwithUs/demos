"use client";

import { Boxes, Minus, PackageX, Plus, Search, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import type { Product, Variant } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { useDemoStore, useProducts } from "@/sites/skincare/lib/store";
import ProductThumb from "@/sites/skincare/admin/components/ProductThumb";
import { useToast } from "@/sites/skincare/admin/components/Toast";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  inputClass,
  PageHeader,
  PageSkeleton,
  Segmented,
} from "@/sites/skincare/admin/components/ui";
import { formatNumber, plural } from "@/sites/skincare/admin/lib/format";
import { useAdminReady } from "@/sites/skincare/admin/lib/hooks";
import { LOW_STOCK } from "@/sites/skincare/admin/lib/metrics";

type Row = { product: Product; variant: Variant };
type Show = "all" | "low" | "out";

function sku(product: Product, variant: Variant): string {
  const code = product.slug
    .split("-")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 5);
  return `ORV-${code}-${variant.id.toUpperCase().replace(/[^A-Z0-9]/g, "")}`;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return (
      <Badge tone="red" dot>
        Out of stock
      </Badge>
    );
  if (stock < LOW_STOCK)
    return (
      <Badge tone="amber" dot>
        Low stock
      </Badge>
    );
  return (
    <Badge tone="green" dot>
      In stock
    </Badge>
  );
}

function StockControl({ row }: { row: Row }) {
  const updateVariant = useDemoStore((s) => s.updateVariant);
  const toast = useToast();
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { product, variant } = row;
  const label = `${product.name}, ${variant.size}`;
  const errorId = `stock-err-${product.slug}-${variant.id}`;

  const setStock = (n: number, announce = false) => {
    const next = Math.max(0, Math.min(99999, n));
    updateVariant(product.slug, variant.id, { stock: next });
    if (announce) toast({ title: `Stock updated to ${formatNumber(next)}`, description: label });
  };

  const commit = () => {
    if (editing === null) return;
    const clean = editing.trim();
    if (!/^\d+$/.test(clean) || Number(clean) > 99999) {
      setError("Enter a whole number from 0 to 99,999.");
      return;
    }
    setError("");
    setEditing(null);
    if (Number(clean) !== variant.stock) setStock(Number(clean), true);
  };

  return (
    <div>
      <div className="inline-flex items-center rounded-lg border border-stone-300 bg-white shadow-xs">
        <button
          type="button"
          onClick={() => setStock(variant.stock - 1)}
          disabled={variant.stock === 0}
          aria-label={`Remove one unit, ${label}`}
          className="grid size-9 place-items-center rounded-l-lg text-stone-600 hover:bg-stone-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-skin-accent disabled:opacity-40"
        >
          <Minus aria-hidden className="size-3.5" />
        </button>
        <input
          inputMode="numeric"
          aria-label={`Stock, ${label}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={editing ?? String(variant.stock)}
          onFocus={(e) => {
            setEditing(String(variant.stock));
            e.currentTarget.select();
          }}
          onChange={(e) => {
            setEditing(e.target.value);
            setError("");
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            } else if (e.key === "Escape") {
              setEditing(null);
              setError("");
            }
          }}
          className={cn(
            "h-9 w-16 border-x border-stone-300 bg-white text-center text-sm font-medium text-stone-900 tabular-nums focus:outline-2 focus:-outline-offset-2 focus:outline-skin-accent",
            error && "bg-red-50 text-red-800",
          )}
        />
        <button
          type="button"
          onClick={() => setStock(variant.stock + 1)}
          aria-label={`Add one unit, ${label}`}
          className="grid size-9 place-items-center rounded-r-lg text-stone-600 hover:bg-stone-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-skin-accent"
        >
          <Plus aria-hidden className="size-3.5" />
        </button>
      </div>
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RestockButton({ row }: { row: Row }) {
  const updateVariant = useDemoStore((s) => s.updateVariant);
  const toast = useToast();
  return (
    <Button
      size="sm"
      variant="ghost"
      className="text-skin-accent"
      onClick={() => {
        updateVariant(row.product.slug, row.variant.id, { stock: row.variant.stock + 50 });
        toast({
          title: `Added 50 units`,
          description: `${row.product.name}, ${row.variant.size}: now ${formatNumber(row.variant.stock + 50)}`,
        });
      }}
    >
      Add 50
    </Button>
  );
}

export default function Inventory() {
  const ready = useAdminReady();
  const params = useSearchParams();
  const products = useProducts({ includeInactive: true });
  const [show, setShow] = useState<Show>(() =>
    params.get("show") === "low" ? "low" : params.get("show") === "out" ? "out" : "all",
  );
  const [query, setQuery] = useState("");

  const rows = useMemo<Row[]>(
    () => products.flatMap((product) => product.variants.map((variant) => ({ product, variant }))),
    [products],
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((r) =>
        show === "low"
          ? r.variant.stock < LOW_STOCK
          : show === "out"
            ? r.variant.stock === 0
            : true,
      )
      .filter(
        (r) =>
          !q ||
          r.product.name.toLowerCase().includes(q) ||
          sku(r.product, r.variant).toLowerCase().includes(q),
      )
      .sort((a, b) => (show === "all" ? 0 : a.variant.stock - b.variant.stock));
  }, [rows, show, query]);

  if (!ready) return <PageSkeleton rows={1} />;

  const units = rows.reduce((s, r) => s + r.variant.stock, 0);
  const value = rows.reduce((s, r) => s + r.variant.stock * r.variant.price, 0);
  const low = rows.filter((r) => r.variant.stock > 0 && r.variant.stock < LOW_STOCK).length;
  const out = rows.filter((r) => r.variant.stock === 0).length;

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Stock for every size. Changes show in the shop straight away, and orders from the shop take stock off."
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: "Units in stock",
            value: formatNumber(units),
            note: `Across ${plural(rows.length, "size")}`,
          },
          { label: "Stock value", value: formatINR(value), note: "At selling price" },
          {
            label: "Low stock",
            value: formatNumber(low),
            note: `Sizes under ${LOW_STOCK} units`,
            tone: low ? "text-amber-800" : "",
          },
          {
            label: "Out of stock",
            value: formatNumber(out),
            note: "Not buyable in the shop",
            tone: out ? "text-red-700" : "",
          },
        ].map((k) => (
          <Card key={k.label} className="px-4 py-4 sm:px-5">
            <h2 className="text-[0.8125rem] font-medium text-stone-600">{k.label}</h2>
            <p
              className={cn(
                "mt-1 text-xl font-semibold text-stone-900 tabular-nums sm:text-2xl",
                k.tone,
              )}
            >
              {k.value}
            </p>
            <p className="mt-0.5 text-xs text-stone-500">{k.note}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:p-4">
          <Segmented
            label="Show"
            value={show}
            onChange={setShow}
            options={[
              { value: "all", label: "All sizes" },
              {
                value: "low",
                label: (
                  <>
                    Low stock <span className="tabular-nums opacity-80">({low + out})</span>
                  </>
                ),
              },
              {
                value: "out",
                label: (
                  <>
                    Out of stock <span className="tabular-nums opacity-80">({out})</span>
                  </>
                ),
              },
            ]}
          />
          <div className="relative flex-1 sm:ml-auto sm:max-w-xs">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-500"
            />
            <label htmlFor="inv-search" className="sr-only">
              Search by product or SKU
            </label>
            <input
              id="inv-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product or SKU"
              className={cn(inputClass, "pl-9")}
            />
          </div>
        </div>

        {!list.length ? (
          <EmptyState
            icon={show === "all" ? <Boxes /> : <PackageX />}
            title={
              show === "all"
                ? "No sizes match"
                : show === "low"
                  ? "Nothing is low on stock"
                  : "Nothing is out of stock"
            }
            description={
              show === "all"
                ? "Try another search."
                : `Every size has ${show === "low" ? `${LOW_STOCK} or more units` : "at least one unit"}.`
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Stock by size</caption>
                <thead>
                  <tr className="border-y border-stone-200 bg-stone-50/70 text-[0.75rem] text-stone-600">
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Product
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      SKU
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right font-medium">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-2.5 font-medium">
                      Stock
                    </th>
                    <th scope="col" className="px-4 py-2.5">
                      <span className="sr-only">Restock</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {list.map((r) => (
                    <tr
                      key={`${r.product.slug}-${r.variant.id}`}
                      className={cn(
                        "hover:bg-stone-50",
                        r.variant.stock === 0
                          ? "bg-red-50/40"
                          : r.variant.stock < LOW_STOCK
                            ? "bg-amber-50/40"
                            : "",
                      )}
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <ProductThumb spec={r.product.visual} name={r.product.name} size="sm" />
                          <div className="min-w-0">
                            <Link
                              href={`/skincare/admin/products/${r.product.slug}`}
                              className="font-medium text-stone-900 hover:underline"
                            >
                              {r.product.name}
                            </Link>
                            <p className="text-xs text-stone-500">
                              {r.variant.size}
                              {!r.product.active ? " · Draft" : ""}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs text-stone-600">
                        {sku(r.product, r.variant)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-stone-700 tabular-nums">
                        {formatINR(r.variant.price)}
                      </td>
                      <td className="px-3 py-2.5">
                        <StockBadge stock={r.variant.stock} />
                      </td>
                      <td className="px-3 py-2.5">
                        <StockControl row={r} />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {r.variant.stock < LOW_STOCK ? <RestockButton row={r} /> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul
              className="divide-y divide-stone-100 border-t border-stone-100 md:hidden"
              aria-label="Stock by size"
            >
              {list.map((r) => (
                <li
                  key={`${r.product.slug}-${r.variant.id}`}
                  className={cn(
                    "px-3 py-3",
                    r.variant.stock === 0
                      ? "bg-red-50/40"
                      : r.variant.stock < LOW_STOCK
                        ? "bg-amber-50/40"
                        : "",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <ProductThumb spec={r.product.visual} name={r.product.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/skincare/admin/products/${r.product.slug}`}
                        className="block truncate font-medium text-stone-900"
                      >
                        {r.product.name}
                      </Link>
                      <p className="text-xs text-stone-500">
                        {r.variant.size} ·{" "}
                        <span className="font-mono">{sku(r.product, r.variant)}</span>
                      </p>
                      <div className="mt-1">
                        <StockBadge stock={r.variant.stock} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-2 pl-15">
                    <StockControl row={r} />
                    {r.variant.stock < LOW_STOCK ? <RestockButton row={r} /> : null}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {low + out > 0 && show === "all" ? (
          <p className="flex items-center gap-2 border-t border-stone-100 px-4 py-3 text-xs text-amber-900">
            <TriangleAlert aria-hidden className="size-3.5" />
            {plural(low + out, "size")} below {LOW_STOCK} units. Restock to avoid missed orders.
          </p>
        ) : null}
      </Card>
    </div>
  );
}
