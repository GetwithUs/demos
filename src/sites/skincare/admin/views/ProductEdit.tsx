"use client";

import { ExternalLink, PackageSearch, Star } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { CATEGORIES, CONCERNS } from "@/sites/skincare/data/catalog";
import type { Badge as BadgeName, Product } from "@/sites/skincare/data/types";
import { discountPercent, formatINR } from "@/sites/skincare/lib/pricing";
import { totalStock, useDemoStore, useProducts } from "@/sites/skincare/lib/store";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { useToast } from "@/sites/skincare/admin/components/Toast";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  CardHeader,
  describedBy,
  EmptyState,
  Field,
  inputClass,
  PageHeader,
  PageSkeleton,
  Toggle,
} from "@/sites/skincare/admin/components/ui";
import VariantTable from "@/sites/skincare/admin/components/VariantTable";
import { formatNumber, plural } from "@/sites/skincare/admin/lib/format";
import { useAdminReady, useNow, useOrders } from "@/sites/skincare/admin/lib/hooks";
import { addDays, isSale, LOW_STOCK, startOfDay } from "@/sites/skincare/admin/lib/metrics";
import {
  BADGES,
  toNumber,
  validateText,
  validateVariant,
  type VariantDraft,
  type VariantErrors,
} from "@/sites/skincare/admin/lib/product-form";

export default function ProductEdit({ slug }: { slug: string }) {
  const ready = useAdminReady();
  const products = useProducts({ includeInactive: true });
  if (!ready) return <PageSkeleton rows={2} />;
  const product = products.find((p) => p.slug === decodeURIComponent(slug));
  if (!product) {
    return (
      <Card>
        <EmptyState
          icon={<PackageSearch />}
          title="Product not found"
          description="It may have been removed when the demo was reset."
          action={<ButtonLink href="/skincare/admin/products">Back to products</ButtonLink>}
        />
      </Card>
    );
  }
  return <EditForm key={product.slug} product={product} />;
}

type Draft = {
  name: string;
  tagline: string;
  description: string;
  badges: BadgeName[];
  active: boolean;
  variants: VariantDraft[];
};

function toDraft(p: Product): Draft {
  return {
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    badges: [...p.badges],
    active: p.active,
    variants: p.variants.map((v) => ({
      id: v.id,
      size: v.size,
      price: String(v.price),
      mrp: String(v.mrp),
      stock: String(v.stock),
    })),
  };
}

function EditForm({ product }: { product: Product }) {
  const updateProduct = useDemoStore((s) => s.updateProduct);
  const updateVariant = useDemoStore((s) => s.updateVariant);
  const toast = useToast();
  const orders = useOrders();
  const now = useNow();
  const [draft, setDraft] = useState<Draft>(() => toDraft(product));
  const [showErrors, setShowErrors] = useState(false);

  const original = useMemo(() => toDraft(product), [product]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(original);

  const errors = {
    name: validateText(draft.name, "name", 3, 80),
    tagline: validateText(draft.tagline, "tagline", 3, 90),
    description: validateText(draft.description, "description", 20, 900),
  };
  const variantErrors: VariantErrors[] = draft.variants.map((v) => validateVariant(v));
  const hasErrors =
    Object.values(errors).some(Boolean) || variantErrors.some((e) => Object.keys(e).length > 0);
  const shown: Partial<typeof errors> = showErrors ? errors : {};
  const shownVariantErrors = showErrors ? variantErrors : [];

  const sales = useMemo(() => {
    const since = addDays(startOfDay(now || 0), -29);
    let units = 0;
    let revenue = 0;
    for (const o of orders) {
      if (!isSale(o) || Date.parse(o.createdAt) < since) continue;
      for (const i of o.items) {
        if (i.slug !== product.slug) continue;
        units += i.qty;
        revenue += i.price * i.qty;
      }
    }
    return { units, revenue };
  }, [orders, product.slug, now]);

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (hasErrors) {
      setShowErrors(true);
      toast({
        title: "Check the highlighted fields",
        description: "Nothing was saved yet.",
        tone: "info",
      });
      return;
    }
    const patch = {
      name: draft.name.trim(),
      tagline: draft.tagline.trim(),
      description: draft.description.trim(),
      badges: draft.badges,
      active: draft.active,
    };
    updateProduct(product.slug, patch);
    for (const v of draft.variants) {
      const before = product.variants.find((x) => x.id === v.id);
      const next = { price: toNumber(v.price), mrp: toNumber(v.mrp), stock: toNumber(v.stock) };
      if (
        !before ||
        before.price !== next.price ||
        before.mrp !== next.mrp ||
        before.stock !== next.stock
      ) {
        updateVariant(product.slug, v.id, next);
      }
    }
    // Keep the form in step with what was saved (trimmed text, plain numbers).
    setDraft({
      ...patch,
      variants: draft.variants.map((v) => ({
        ...v,
        price: String(toNumber(v.price)),
        mrp: String(toNumber(v.mrp)),
        stock: String(toNumber(v.stock)),
      })),
    });
    setShowErrors(false);
    toast({
      title: "Product saved",
      description: draft.active
        ? "The shop shows the new details now."
        : "Saved as a draft, hidden from the shop.",
      action: draft.active
        ? { label: "View in shop", href: `/skincare/products/${product.slug}`, external: true }
        : undefined,
    });
  };

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));
  const preview = draft.variants[0];
  const previewPrice = toNumber(preview?.price ?? "0");
  const previewMrp = toNumber(preview?.mrp ?? "0");

  return (
    <form onSubmit={save} noValidate>
      <PageHeader
        back={{ href: "/skincare/admin/products", label: "Products" }}
        title={product.name}
        meta={draft.active ? <Badge tone="green">Active</Badge> : <Badge>Draft</Badge>}
        description={`${CATEGORIES[product.category].label} · ${plural(product.variants.length, "size")} · ${formatNumber(totalStock(product))} units in stock`}
        actions={
          <>
            <ButtonLink href={`/skincare/products/${product.slug}`} target="_blank">
              <ExternalLink aria-hidden className="size-4" />
              View in shop
              <span className="sr-only">(opens in a new tab)</span>
            </ButtonLink>
            <Button type="submit" variant="primary" disabled={!dirty}>
              Save
            </Button>
          </>
        }
      />

      <div className="grid gap-4 pb-20 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 text-[0.9375rem] font-semibold text-stone-900">Details</h2>
            <div className="space-y-4">
              <Field label="Name" htmlFor="name" required error={shown.name}>
                <input
                  id="name"
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputClass}
                  {...describedBy("name", { error: shown.name })}
                />
              </Field>
              <Field
                label="Tagline"
                htmlFor="tagline"
                required
                error={shown.tagline}
                hint="One line under the name in the shop."
              >
                <input
                  id="tagline"
                  value={draft.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                  className={inputClass}
                  {...describedBy("tagline", { error: shown.tagline, hint: true })}
                />
              </Field>
              <Field label="Description" htmlFor="description" required error={shown.description}>
                <textarea
                  id="description"
                  rows={5}
                  value={draft.description}
                  onChange={(e) => set("description", e.target.value)}
                  className={cn(inputClass, "h-auto py-2 leading-relaxed")}
                  {...describedBy("description", { error: shown.description })}
                />
              </Field>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[0.9375rem] font-semibold text-stone-900">Prices and stock</h2>
            <p className="mt-0.5 mb-4 text-[0.8125rem] text-stone-600">
              Prices include GST. The selling price cannot be above the MRP. Sizes under {LOW_STOCK}{" "}
              units show as low stock.
            </p>
            <VariantTable
              idPrefix="v"
              rows={draft.variants}
              errors={shownVariantErrors}
              onChange={(i, patch) =>
                set(
                  "variants",
                  draft.variants.map((v, j) => (j === i ? { ...v, ...patch } : v)),
                )
              }
            />
          </Card>

          <Card className="p-5">
            <fieldset>
              <legend className="text-[0.9375rem] font-semibold text-stone-900">Badges</legend>
              <p className="mt-0.5 mb-3 text-[0.8125rem] text-stone-600">
                Shown on the product card in the shop.
              </p>
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b) => {
                  const on = draft.badges.includes(b);
                  return (
                    <label
                      key={b}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
                        on
                          ? "border-skin-accent bg-skin-accent-soft text-skin-accent"
                          : "border-stone-300 text-stone-700 hover:bg-stone-50",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() =>
                          set(
                            "badges",
                            on
                              ? draft.badges.filter((x) => x !== b)
                              : BADGES.filter((x) => x === b || draft.badges.includes(x)),
                          )
                        }
                      />
                      {b}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card className="p-5">
            <h2 className="mb-3 text-[0.9375rem] font-semibold text-stone-900">Visibility</h2>
            <Toggle
              id="active"
              checked={draft.active}
              onChange={(v) => set("active", v)}
              label={draft.active ? "Active, shown in the shop" : "Draft, hidden from the shop"}
              description="Turn off to hide the product from listings and search without losing it."
            />
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title="Shop preview" description="How the card looks with your changes" />
            <div className="px-5 pb-5">
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <div className="relative px-12 pt-4" style={{ background: product.visual.tint }}>
                  <ProductVisual spec={product.visual} name={draft.name || product.name} />
                  {draft.badges[0] ? (
                    <span className="absolute top-3 left-3 rounded-full bg-white px-2 py-0.5 text-[0.6875rem] font-semibold text-stone-800 shadow-sm">
                      {draft.badges[0]}
                    </span>
                  ) : null}
                </div>
                <div className="p-3.5">
                  <p className="font-skin-display text-[0.9375rem] font-semibold text-stone-900">
                    {draft.name || "Product name"}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-600">{draft.tagline}</p>
                  {product.reviewCount ? (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-stone-700">
                      <Star aria-hidden className="size-3.5 fill-skin-star text-skin-star" />
                      {product.rating.toFixed(1)} ({formatNumber(product.reviewCount)})
                    </p>
                  ) : null}
                  {Number.isFinite(previewPrice) && previewPrice > 0 ? (
                    <p className="mt-1.5 text-sm tabular-nums">
                      <span className="font-semibold text-stone-900">
                        {formatINR(previewPrice)}
                      </span>{" "}
                      {previewMrp > previewPrice ? (
                        <>
                          <span className="text-xs text-stone-500 line-through">
                            {formatINR(previewMrp)}
                          </span>{" "}
                          <span className="text-xs font-medium text-emerald-800">
                            {discountPercent(previewPrice, previewMrp)}% off
                          </span>
                        </>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-[0.9375rem] font-semibold text-stone-900">Last 30 days</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-stone-50 px-3 py-2.5">
                <dt className="text-xs text-stone-600">Units sold</dt>
                <dd className="text-lg font-semibold text-stone-900 tabular-nums">
                  {formatNumber(sales.units)}
                </dd>
              </div>
              <div className="rounded-lg bg-stone-50 px-3 py-2.5">
                <dt className="text-xs text-stone-600">Sales</dt>
                <dd className="text-lg font-semibold text-stone-900 tabular-nums">
                  {formatINR(sales.revenue)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-stone-500">
              Concerns: {product.concerns.map((c) => CONCERNS[c].label).join(", ")}
            </p>
          </Card>
        </div>
      </div>

      {dirty ? (
        <div className="fixed inset-x-0 bottom-14 z-30 border-t border-stone-200 bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur lg:bottom-0 lg:left-60 print:hidden">
          <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 lg:px-4">
            <p className="text-sm font-medium text-stone-800">Unsaved changes</p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setDraft(original);
                  setShowErrors(false);
                }}
              >
                Discard
              </Button>
              <Button type="submit" variant="primary">
                Save changes
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {dirty ? "You have unsaved changes." : ""}
      </p>
    </form>
  );
}
