"use client";

import { Trash } from "lucide-react";
import { cn } from "@/lib/cn";
import { discountPercent } from "@/sites/skincare/lib/pricing";
import { describedBy, inputClass } from "@/sites/skincare/admin/components/ui";
import type { VariantDraft, VariantErrors } from "@/sites/skincare/admin/lib/product-form";

/**
 * Per-size price, MRP and stock inputs. Rows stack into small cards on phones. Sizes are
 * editable only when adding a product (existing orders refer to them).
 */
export default function VariantTable({
  rows,
  errors,
  onChange,
  editableSize = false,
  onRemove,
  idPrefix,
}: {
  rows: VariantDraft[];
  errors: VariantErrors[];
  onChange: (index: number, patch: Partial<VariantDraft>) => void;
  editableSize?: boolean;
  onRemove?: (index: number) => void;
  idPrefix: string;
}) {
  return (
    <div className="space-y-3">
      <div
        aria-hidden
        className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-3 px-1 text-xs font-medium text-stone-600 sm:grid"
      >
        <span>Size</span>
        <span>Price (₹)</span>
        <span>MRP (₹)</span>
        <span>Stock</span>
        <span className={onRemove ? "w-9" : "w-16"} />
      </div>
      {rows.map((row, i) => {
        const e = errors[i] ?? {};
        const id = (f: string) => `${idPrefix}-${i}-${f}`;
        const price = Number(row.price);
        const mrp = Number(row.mrp);
        const off =
          Number.isFinite(price) && Number.isFinite(mrp) ? discountPercent(price, mrp) : 0;
        const field = (f: "size" | "price" | "mrp" | "stock", label: string, extra?: string) => (
          <div className="min-w-0">
            <label
              htmlFor={id(f)}
              className="mb-1 block text-xs font-medium text-stone-600 sm:sr-only"
            >
              {label}
            </label>
            <input
              id={id(f)}
              value={row[f]}
              inputMode={f === "size" ? "text" : "numeric"}
              onChange={(ev) => onChange(i, { [f]: ev.target.value })}
              className={cn(inputClass, f !== "size" && "tabular-nums", extra)}
              aria-label={`${label}, ${row.size || `size ${i + 1}`}`}
              {...describedBy(id(f), { error: e[f] })}
            />
            {e[f] ? (
              <p id={`${id(f)}-error`} className="mt-1 text-xs text-red-700">
                {e[f]}
              </p>
            ) : null}
          </div>
        );
        return (
          <div key={row.id} className="rounded-lg border border-stone-200 p-3 sm:border-0 sm:p-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1.2fr_1fr_1fr_1fr_auto] sm:items-start">
              {editableSize ? (
                field("size", "Size")
              ) : (
                <div className="col-span-2 flex h-10 items-center text-sm font-medium text-stone-900 sm:col-span-1">
                  {row.size}
                </div>
              )}
              {field("price", "Price")}
              {field("mrp", "MRP")}
              {field("stock", "Stock")}
              <div className="flex h-10 items-center justify-end">
                {onRemove ? (
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    disabled={rows.length === 1}
                    aria-label={`Remove ${row.size || `size ${i + 1}`}`}
                    className="grid size-9 place-items-center rounded-lg text-stone-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                  >
                    <Trash aria-hidden className="size-4" />
                  </button>
                ) : (
                  <span className="w-16 text-right text-xs text-emerald-800 tabular-nums">
                    {off ? `${off}% off` : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
