"use client";

import { Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CATEGORIES, CONCERNS, SKIN_TYPES } from "@/sites/skincare/data/catalog";
import type {
  Badge as BadgeName,
  CategoryId,
  ConcernId,
  Product,
  ProductVisualSpec,
  SkinType,
  VisualShape,
} from "@/sites/skincare/data/types";
import { discountPercent, formatINR } from "@/sites/skincare/lib/pricing";
import { useDemoStore, useProducts } from "@/sites/skincare/lib/store";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { useToast } from "@/sites/skincare/admin/components/Toast";
import {
  Button,
  Card,
  describedBy,
  Field,
  inputClass,
  PageHeader,
  PageSkeleton,
  Select,
  Toggle,
} from "@/sites/skincare/admin/components/ui";
import VariantTable from "@/sites/skincare/admin/components/VariantTable";
import { useAdminReady, useNow } from "@/sites/skincare/admin/lib/hooks";
import {
  BADGES,
  slugify,
  toNumber,
  validateText,
  validateVariant,
  variantId,
  type VariantDraft,
  type VariantErrors,
} from "@/sites/skincare/admin/lib/product-form";

const SHAPES: { value: VisualShape; label: string }[] = [
  { value: "dropper", label: "Dropper" },
  { value: "pump", label: "Pump" },
  { value: "tube", label: "Tube" },
  { value: "jar", label: "Jar" },
  { value: "mist", label: "Mist" },
  { value: "stick", label: "Stick" },
  { value: "box", label: "Box" },
];

type Colours = Omit<ProductVisualSpec, "shape" | "label">;

const PALETTES: { name: string; colours: Colours }[] = [
  {
    name: "Sage",
    colours: {
      body: "#f2efe9",
      cap: "#2f3a33",
      liquid: "#e7efe4",
      labelBg: "#8fa98b",
      labelInk: "#ffffff",
      tint: "#e5ecdf",
    },
  },
  {
    name: "Amber",
    colours: {
      body: "#c7863f",
      cap: "#2b2622",
      liquid: "#e2a560",
      labelBg: "#f3e2c4",
      labelInk: "#7a4a17",
      tint: "#f7e6cc",
    },
  },
  {
    name: "Sky",
    colours: {
      body: "#eef3f6",
      cap: "#26343d",
      liquid: "#d7e6ef",
      labelBg: "#8fb3c9",
      labelInk: "#ffffff",
      tint: "#e1ecf2",
    },
  },
  {
    name: "Plum",
    colours: {
      body: "#3d3346",
      cap: "#1f1a24",
      liquid: "#6b5878",
      labelBg: "#e7def0",
      labelInk: "#3d3346",
      tint: "#ebe3f1",
    },
  },
  {
    name: "Rose",
    colours: {
      body: "#f4eeec",
      cap: "#3b2b2b",
      liquid: "#f1dcd8",
      labelBg: "#c98f8f",
      labelInk: "#ffffff",
      tint: "#f3e1de",
    },
  },
  {
    name: "Kesar",
    colours: {
      body: "#f2d9b5",
      cap: "#b0562a",
      liquid: "#f5c98e",
      labelBg: "#f2d9b5",
      labelInk: "#7a2f10",
      tint: "#f6dfc1",
    },
  },
  {
    name: "Sand",
    colours: {
      body: "#f3eee6",
      cap: "#b9a389",
      liquid: "#efe2cf",
      labelBg: "#f3eee6",
      labelInk: "#6d5a44",
      tint: "#f1e9dd",
    },
  },
];

const COLOUR_FIELDS: { key: keyof Colours; label: string }[] = [
  { key: "body", label: "Pack" },
  { key: "cap", label: "Cap or pump" },
  { key: "labelBg", label: "Label" },
  { key: "labelInk", label: "Label text" },
  { key: "liquid", label: "Liquid" },
  { key: "tint", label: "Background" },
];

type Ingredient = { name: string; amount: string; benefit: string };

type Draft = {
  name: string;
  tagline: string;
  description: string;
  category: CategoryId;
  concerns: ConcernId[];
  skinTypes: SkinType[];
  when: ("AM" | "PM")[];
  texture: string;
  fragranceFree: boolean;
  keyIngredients: Ingredient[];
  benefits: string;
  howToUse: string;
  ingredients: string;
  shape: VisualShape;
  colours: Colours;
  label1: string;
  label2: string;
  variants: VariantDraft[];
  badges: BadgeName[];
  active: boolean;
};

const EMPTY: Draft = {
  name: "",
  tagline: "",
  description: "",
  category: "serums",
  concerns: [],
  skinTypes: [],
  when: ["AM", "PM"],
  texture: "",
  fragranceFree: true,
  keyIngredients: [{ name: "", amount: "", benefit: "" }],
  benefits: "",
  howToUse: "",
  ingredients: "",
  shape: "dropper",
  colours: PALETTES[0].colours,
  label1: "",
  label2: "",
  variants: [{ id: "row-1", size: "30 ml", price: "", mrp: "", stock: "50" }],
  badges: ["New"],
  active: true,
};

const EXAMPLE: Draft = {
  name: "Rice Water Brightening Toner",
  tagline: "Hydrates and evens tone, alcohol free",
  description:
    "A watery toner with fermented rice water and niacinamide that preps skin for serums, softens dry patches and brings back an even, bright tone. Gentle enough for twice-daily use in Indian summers and winters.",
  category: "toners",
  concerns: ["dullness", "pigmentation", "dryness"],
  skinTypes: ["normal", "dry", "combination"],
  when: ["AM", "PM"],
  texture: "Watery essence, absorbs fast",
  fragranceFree: true,
  keyIngredients: [
    { name: "Fermented rice water", amount: "20%", benefit: "Brightens and softens" },
    { name: "Niacinamide", amount: "3%", benefit: "Evens tone" },
  ],
  benefits:
    "Brighter, more even tone in 4 weeks\nSofter skin from the first use\nAlcohol free and fragrance free",
  howToUse:
    "After cleansing, pour a few drops into your palms.\nPress gently into the face and neck.\nFollow with serum and moisturiser.",
  ingredients:
    "Aqua, Oryza Sativa (Rice) Ferment Filtrate, Niacinamide, Glycerin, Panthenol, Sodium PCA, Allantoin, Phenoxyethanol, Ethylhexylglycerin.",
  shape: "mist",
  colours: PALETTES[2].colours,
  label1: "Rice Water",
  label2: "Toner",
  variants: [
    { id: "row-1", size: "100 ml", price: "399", mrp: "449", stock: "60" },
    { id: "row-2", size: "200 ml", price: "649", mrp: "749", stock: "40" },
  ],
  badges: ["New"],
  active: true,
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-5">
      <h2 className="text-[0.9375rem] font-semibold text-stone-900">{title}</h2>
      {description ? <p className="mt-0.5 text-[0.8125rem] text-stone-600">{description}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </Card>
  );
}

function Chips<T extends string>({
  legend,
  options,
  value,
  onChange,
  error,
  id,
}: {
  legend: string;
  options: { value: T; label: string }[];
  value: T[];
  onChange: (v: T[]) => void;
  error?: string;
  id: string;
}) {
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="mb-1.5 text-[0.8125rem] font-medium text-stone-800">
        {legend}
        <span aria-hidden className="text-red-700">
          {" "}
          *
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <label
              key={o.value}
              className={cn(
                "inline-flex cursor-pointer items-center rounded-full border px-3 py-1.5 text-[0.8125rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
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
                  onChange(
                    on
                      ? value.filter((x) => x !== o.value)
                      : options
                          .filter((x) => x.value === o.value || value.includes(x.value))
                          .map((x) => x.value),
                  )
                }
              />
              {o.label}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.8125rem] text-red-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export default function ProductNew() {
  const ready = useAdminReady();
  const now = useNow();
  if (!ready || !now) return <PageSkeleton rows={2} />;
  return <NewForm now={now} />;
}

function NewForm({ now }: { now: number }) {
  const router = useRouter();
  const toast = useToast();
  const products = useProducts({ includeInactive: true });
  const addProduct = useDemoStore((s) => s.addProduct);
  const [d, setD] = useState<Draft>(EMPTY);
  const [showErrors, setShowErrors] = useState(false);
  const [nextRow, setNextRow] = useState(3);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setD((x) => ({ ...x, [key]: value }));
  const slug = slugify(d.name);
  const label = [
    d.label1.trim() || d.name.trim().split(" ").slice(0, 2).join(" ") || "Your product",
    d.label2.trim(),
  ]
    .filter(Boolean)
    .join("\n");
  const spec: ProductVisualSpec = { shape: d.shape, label, ...d.colours };

  const sizes = d.variants.map((v) => v.size.trim().toLowerCase());
  const errors = {
    name:
      validateText(d.name, "name", 3, 80) ??
      (slug === "new" || products.some((p) => p.slug === slug)
        ? "A product with this name already exists. Try another name."
        : undefined),
    tagline: validateText(d.tagline, "tagline", 3, 90),
    description: validateText(d.description, "description", 20, 900),
    concerns: d.concerns.length ? undefined : "Pick at least one skin concern.",
    skinTypes: d.skinTypes.length ? undefined : "Pick at least one skin type.",
    when: d.when.length ? undefined : "Pick morning, night or both.",
    ingredient: d.keyIngredients[0]?.name.trim() ? undefined : "Add at least one key ingredient.",
    label1: d.label1.trim().length > 14 ? "Keep each label line to 14 characters." : undefined,
    label2: d.label2.trim().length > 14 ? "Keep each label line to 14 characters." : undefined,
  };
  const variantErrors: VariantErrors[] = d.variants.map((v, i) => {
    const e = validateVariant(v, { checkSize: true });
    if (!e.size && sizes.indexOf(sizes[i]) !== i) e.size = "Each size must be different.";
    return e;
  });
  const hasErrors =
    Object.values(errors).some(Boolean) || variantErrors.some((e) => Object.keys(e).length > 0);
  const show = showErrors ? errors : ({} as Partial<typeof errors>);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (hasErrors) {
      setShowErrors(true);
      toast({
        title: "A few fields need attention",
        description: "They are marked in red.",
        tone: "info",
      });
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(),
      );
      return;
    }
    const taken: string[] = [];
    const variants = d.variants.map((v) => {
      const id = variantId(v.size, taken);
      taken.push(id);
      return {
        id,
        size: v.size.trim(),
        price: toNumber(v.price),
        mrp: toNumber(v.mrp),
        stock: toNumber(v.stock),
      };
    });
    const product: Product = {
      slug,
      name: d.name.trim(),
      tagline: d.tagline.trim(),
      category: d.category,
      concerns: d.concerns,
      skinTypes: d.skinTypes,
      keyIngredients: d.keyIngredients
        .filter((k) => k.name.trim())
        .map((k) => ({
          name: k.name.trim(),
          amount: k.amount.trim() || undefined,
          benefit: k.benefit.trim() || "Key active",
        })),
      description: d.description.trim(),
      benefits: lines(d.benefits),
      howToUse: lines(d.howToUse).length
        ? lines(d.howToUse)
        : ["Apply on clean skin.", "Use daily for best results."],
      ingredients: d.ingredients.trim() || "Full ingredient list on the pack.",
      texture: d.texture.trim() || "Lightweight",
      when: d.when,
      variants,
      rating: 0,
      reviewCount: 0,
      badges: d.badges,
      visual: spec,
      pairsWith: [],
      fragranceFree: d.fragranceFree,
      launchedOn: new Date(now).toISOString().slice(0, 10),
      active: d.active,
    };
    addProduct(product);
    toast({
      title: `${product.name} added`,
      description: product.active
        ? "It is live in the shop now."
        : "Saved as a draft. Turn it on when you are ready.",
      action: product.active
        ? { label: "View in shop", href: `/skincare/products/${slug}`, external: true }
        : undefined,
    });
    router.push(`/skincare/admin/products/${slug}`);
  };

  const first = d.variants[0];
  const price = toNumber(first?.price ?? "");
  const mrp = toNumber(first?.mrp ?? "");

  return (
    <form onSubmit={submit} noValidate>
      <PageHeader
        back={{ href: "/skincare/admin/products", label: "Products" }}
        title="Add product"
        description="It appears in the shop as soon as you save it as active."
        actions={
          <>
            <Button
              onClick={() => {
                setD(EXAMPLE);
                setShowErrors(false);
              }}
            >
              <Sparkles aria-hidden className="size-4" />
              Fill with an example
            </Button>
            <Button type="submit" variant="primary">
              Save product
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4 sm:space-y-6">
          <Section title="Basics">
            <Field
              label="Name"
              htmlFor="name"
              required
              error={show.name}
              hint={
                slug
                  ? `Shop link: /skincare/products/${slug}`
                  : "For example: Rice Water Brightening Toner"
              }
            >
              <input
                id="name"
                value={d.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputClass}
                {...describedBy("name", { error: show.name, hint: true })}
              />
            </Field>
            <Field
              label="Tagline"
              htmlFor="tagline"
              required
              error={show.tagline}
              hint="One line under the name, up to 90 characters."
            >
              <input
                id="tagline"
                value={d.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                className={inputClass}
                {...describedBy("tagline", { error: show.tagline, hint: true })}
              />
            </Field>
            <Field label="Description" htmlFor="description" required error={show.description}>
              <textarea
                id="description"
                rows={4}
                value={d.description}
                onChange={(e) => set("description", e.target.value)}
                className={cn(inputClass, "h-auto py-2 leading-relaxed")}
                {...describedBy("description", { error: show.description })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" htmlFor="category" required>
                <Select
                  id="category"
                  value={d.category}
                  onChange={(e) => set("category", e.target.value as CategoryId)}
                >
                  {(Object.keys(CATEGORIES) as CategoryId[]).map((c) => (
                    <option key={c} value={c}>
                      {CATEGORIES[c].label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Texture" htmlFor="texture" hint="For example: Light gel, absorbs fast">
                <input
                  id="texture"
                  value={d.texture}
                  onChange={(e) => set("texture", e.target.value)}
                  className={inputClass}
                  {...describedBy("texture", { hint: true })}
                />
              </Field>
            </div>
          </Section>

          <Section title="Who it is for">
            <Chips
              id="concerns"
              legend="Skin concerns"
              value={d.concerns}
              onChange={(v) => set("concerns", v)}
              error={show.concerns}
              options={(Object.keys(CONCERNS) as ConcernId[]).map((c) => ({
                value: c,
                label: CONCERNS[c].label,
              }))}
            />
            <Chips
              id="skin-types"
              legend="Skin types"
              value={d.skinTypes}
              onChange={(v) => set("skinTypes", v)}
              error={show.skinTypes}
              options={(Object.keys(SKIN_TYPES) as SkinType[]).map((s) => ({
                value: s,
                label: SKIN_TYPES[s],
              }))}
            />
            <Chips
              id="when"
              legend="When to use"
              value={d.when}
              onChange={(v) => set("when", v)}
              error={show.when}
              options={[
                { value: "AM", label: "Morning" },
                { value: "PM", label: "Night" },
              ]}
            />
            <Toggle
              id="fragrance"
              checked={d.fragranceFree}
              onChange={(v) => set("fragranceFree", v)}
              label="Fragrance free"
            />
          </Section>

          <Section title="Ingredients and use">
            <fieldset aria-describedby={show.ingredient ? "ingredient-error" : undefined}>
              <legend className="mb-1.5 text-[0.8125rem] font-medium text-stone-800">
                Key ingredients
                <span aria-hidden className="text-red-700">
                  {" "}
                  *
                </span>
              </legend>
              <div className="space-y-2">
                {d.keyIngredients.map((k, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_5.5rem] gap-2 sm:grid-cols-[1.2fr_5.5rem_1.5fr]"
                  >
                    <input
                      aria-label={`Ingredient ${i + 1} name`}
                      placeholder="Ingredient"
                      value={k.name}
                      onChange={(e) =>
                        set(
                          "keyIngredients",
                          d.keyIngredients.map((x, j) =>
                            j === i ? { ...x, name: e.target.value } : x,
                          ),
                        )
                      }
                      className={inputClass}
                      aria-invalid={i === 0 && show.ingredient ? true : undefined}
                    />
                    <input
                      aria-label={`Ingredient ${i + 1} amount`}
                      placeholder="Amount"
                      value={k.amount}
                      onChange={(e) =>
                        set(
                          "keyIngredients",
                          d.keyIngredients.map((x, j) =>
                            j === i ? { ...x, amount: e.target.value } : x,
                          ),
                        )
                      }
                      className={inputClass}
                    />
                    <input
                      aria-label={`Ingredient ${i + 1} benefit`}
                      placeholder="What it does"
                      value={k.benefit}
                      onChange={(e) =>
                        set(
                          "keyIngredients",
                          d.keyIngredients.map((x, j) =>
                            j === i ? { ...x, benefit: e.target.value } : x,
                          ),
                        )
                      }
                      className={cn(inputClass, "col-span-2 sm:col-span-1")}
                    />
                  </div>
                ))}
              </div>
              {show.ingredient ? (
                <p id="ingredient-error" className="mt-1.5 text-[0.8125rem] text-red-700">
                  {show.ingredient}
                </p>
              ) : null}
              {d.keyIngredients.length < 3 ? (
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-2 text-skin-accent"
                  onClick={() =>
                    set("keyIngredients", [
                      ...d.keyIngredients,
                      { name: "", amount: "", benefit: "" },
                    ])
                  }
                >
                  <Plus aria-hidden className="size-4" />
                  Add ingredient
                </Button>
              ) : null}
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Benefits" htmlFor="benefits" hint="One per line.">
                <textarea
                  id="benefits"
                  rows={4}
                  value={d.benefits}
                  onChange={(e) => set("benefits", e.target.value)}
                  className={cn(inputClass, "h-auto py-2")}
                  {...describedBy("benefits", { hint: true })}
                />
              </Field>
              <Field label="How to use" htmlFor="how" hint="One step per line.">
                <textarea
                  id="how"
                  rows={4}
                  value={d.howToUse}
                  onChange={(e) => set("howToUse", e.target.value)}
                  className={cn(inputClass, "h-auto py-2")}
                  {...describedBy("how", { hint: true })}
                />
              </Field>
            </div>
            <Field label="Full ingredient list (INCI)" htmlFor="inci">
              <textarea
                id="inci"
                rows={2}
                value={d.ingredients}
                onChange={(e) => set("ingredients", e.target.value)}
                className={cn(inputClass, "h-auto py-2")}
              />
            </Field>
          </Section>

          <Section
            title="Pack design"
            description="Drawn automatically, so every product has a clean pack image without a photo shoot."
          >
            <fieldset>
              <legend className="mb-1.5 text-[0.8125rem] font-medium text-stone-800">
                Pack shape
              </legend>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {SHAPES.map((s) => (
                  <label
                    key={s.value}
                    className={cn(
                      "flex cursor-pointer flex-col items-center rounded-lg border p-1.5 pb-2 text-xs transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
                      d.shape === s.value
                        ? "border-skin-accent bg-skin-accent-soft/60 text-skin-accent"
                        : "border-stone-200 text-stone-700 hover:border-stone-300",
                    )}
                  >
                    <input
                      type="radio"
                      name="shape"
                      value={s.value}
                      checked={d.shape === s.value}
                      onChange={() => set("shape", s.value)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden
                      className="block w-full rounded-md px-1"
                      style={{ background: d.colours.tint }}
                    >
                      <ProductVisual spec={{ ...spec, shape: s.value, label: "" }} name={s.label} />
                    </span>
                    <span className="mt-1">{s.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-1.5 text-[0.8125rem] font-medium text-stone-800">
                Colour palette
              </legend>
              <div className="flex flex-wrap gap-2">
                {PALETTES.map((p) => {
                  const on = JSON.stringify(p.colours) === JSON.stringify(d.colours);
                  return (
                    <button
                      key={p.name}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set("colours", p.colours)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-[0.8125rem] focus-visible:outline-2 focus-visible:outline-skin-accent",
                        on
                          ? "border-skin-accent bg-skin-accent-soft text-skin-accent"
                          : "border-stone-300 text-stone-700 hover:bg-stone-50",
                      )}
                    >
                      <span aria-hidden className="flex -space-x-1">
                        {[p.colours.tint, p.colours.body, p.colours.labelBg, p.colours.cap].map(
                          (c, i) => (
                            <span
                              key={i}
                              className="size-4 rounded-full ring-2 ring-white"
                              style={{ background: c }}
                            />
                          ),
                        )}
                      </span>
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {COLOUR_FIELDS.map((f) => (
                <label
                  key={f.key}
                  htmlFor={`c-${f.key}`}
                  className="flex items-center gap-2.5 rounded-lg border border-stone-200 px-2.5 py-2 text-[0.8125rem] text-stone-700"
                >
                  <input
                    id={`c-${f.key}`}
                    type="color"
                    value={d.colours[f.key] ?? "#ffffff"}
                    onChange={(e) => set("colours", { ...d.colours, [f.key]: e.target.value })}
                    className="size-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <span className="min-w-0">
                    <span className="block">{f.label}</span>
                    <span className="block font-mono text-[0.6875rem] text-stone-500 uppercase">
                      {d.colours[f.key]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Label line 1"
                htmlFor="label1"
                error={show.label1}
                hint="Up to 14 characters, e.g. Vitamin C"
              >
                <input
                  id="label1"
                  value={d.label1}
                  onChange={(e) => set("label1", e.target.value)}
                  className={inputClass}
                  {...describedBy("label1", { error: show.label1, hint: true })}
                />
              </Field>
              <Field
                label="Label line 2"
                htmlFor="label2"
                error={show.label2}
                hint="Optional, e.g. 15%"
              >
                <input
                  id="label2"
                  value={d.label2}
                  onChange={(e) => set("label2", e.target.value)}
                  className={inputClass}
                  {...describedBy("label2", { error: show.label2, hint: true })}
                />
              </Field>
            </div>
          </Section>

          <Section
            title="Sizes, prices and stock"
            description="Prices in whole rupees, GST included. The price cannot be above the MRP."
          >
            <VariantTable
              idPrefix="nv"
              editableSize
              rows={d.variants}
              errors={showErrors ? variantErrors : []}
              onChange={(i, patch) =>
                set(
                  "variants",
                  d.variants.map((v, j) => (j === i ? { ...v, ...patch } : v)),
                )
              }
              onRemove={(i) =>
                set(
                  "variants",
                  d.variants.filter((_, j) => j !== i),
                )
              }
            />
            {d.variants.length < 4 ? (
              <Button
                size="sm"
                variant="ghost"
                className="text-skin-accent"
                onClick={() => {
                  set("variants", [
                    ...d.variants,
                    { id: `row-${nextRow}`, size: "", price: "", mrp: "", stock: "0" },
                  ]);
                  setNextRow((n) => n + 1);
                }}
              >
                <Plus aria-hidden className="size-4" />
                Add size
              </Button>
            ) : null}
          </Section>
        </div>

        <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden">
            <div className="px-5 pt-4 pb-3">
              <h2 className="text-[0.9375rem] font-semibold text-stone-900">Live preview</h2>
              <p className="text-[0.8125rem] text-stone-600">
                How the product card will look in the shop
              </p>
            </div>
            <div className="px-5 pb-5">
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <div className="relative px-14 pt-4" style={{ background: d.colours.tint }}>
                  <ProductVisual spec={spec} name={d.name || "New product"} />
                  {d.badges[0] ? (
                    <span className="absolute top-3 left-3 rounded-full bg-white px-2 py-0.5 text-[0.6875rem] font-semibold text-stone-800 shadow-sm">
                      {d.badges[0]}
                    </span>
                  ) : null}
                </div>
                <div className="p-3.5">
                  <p className="font-skin-display text-[0.9375rem] font-semibold text-stone-900">
                    {d.name || "Product name"}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-600">{d.tagline || "Tagline"}</p>
                  <p className="mt-1.5 text-sm tabular-nums">
                    {Number.isFinite(price) && price > 0 ? (
                      <>
                        <span className="font-semibold text-stone-900">{formatINR(price)}</span>{" "}
                        {mrp > price ? (
                          <>
                            <span className="text-xs text-stone-500 line-through">
                              {formatINR(mrp)}
                            </span>{" "}
                            <span className="text-xs font-medium text-emerald-800">
                              {discountPercent(price, mrp)}% off
                            </span>
                          </>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-stone-500">Add a price</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="space-y-4 p-5">
            <Toggle
              id="active"
              checked={d.active}
              onChange={(v) => set("active", v)}
              label={d.active ? "Active, shown in the shop" : "Draft, hidden from the shop"}
            />
            <fieldset>
              <legend className="mb-1.5 text-[0.8125rem] font-medium text-stone-800">Badges</legend>
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b) => {
                  const on = d.badges.includes(b);
                  return (
                    <label
                      key={b}
                      className={cn(
                        "inline-flex cursor-pointer items-center rounded-full border px-3 py-1 text-[0.8125rem] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
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
                              ? d.badges.filter((x) => x !== b)
                              : BADGES.filter((x) => x === b || d.badges.includes(x)),
                          )
                        }
                      />
                      {b}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <Button type="submit" variant="primary" className="w-full">
              Save product
            </Button>
          </Card>
        </div>
      </div>
    </form>
  );
}
