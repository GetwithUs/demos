"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import type { Product } from "@/sites/skincare/data/types";

const SKIN_TONES = ["#f1d3bc", "#dfb08c", "#c48a62", "#9c6644", "#6e4630"];

const CREAMY = new Set(["jar", "pump", "tube", "stick", "box"]);

/** Texture swatch drawn in CSS: drops for serums and mists, a swirl for creams. */
function TextureView({ product }: { product: Product }) {
  const v = product.visual;
  const creamy = CREAMY.has(v.shape) && !v.liquid;
  const colour =
    v.liquid ?? (product.category === "sunscreens" ? "#fbf6ec" : creamy ? "#fdfaf4" : v.body);
  return (
    <div
      className="relative grid size-full place-items-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${v.tint}, #ffffff)` }}
    >
      {creamy ? (
        <div className="relative">
          <div
            className="h-40 w-64 -rotate-12 rounded-[60%_40%_55%_45%/60%_50%_50%_40%] shadow-[inset_-10px_-14px_30px_rgba(0,0,0,0.08),0_20px_40px_-20px_rgba(0,0,0,0.25)]"
            style={{
              background: `radial-gradient(circle at 30% 30%, #ffffff, ${colour} 55%, ${v.tint})`,
            }}
          />
          <div className="absolute top-8 left-14 h-6 w-24 -rotate-12 rounded-full bg-white/80 blur-[3px]" />
          <div className="absolute top-16 left-28 h-3 w-16 -rotate-12 rounded-full bg-white/70 blur-[2px]" />
        </div>
      ) : (
        <div className="relative h-56 w-72">
          {[
            { x: 30, y: 40, s: 90 },
            { x: 150, y: 20, s: 64 },
            { x: 120, y: 120, s: 110 },
            { x: 40, y: 150, s: 46 },
          ].map((d, i) => (
            <span
              key={i}
              className="absolute rounded-full shadow-[inset_-6px_-10px_18px_rgba(0,0,0,0.08),0_14px_24px_-14px_rgba(0,0,0,0.3)]"
              style={{
                left: d.x,
                top: d.y,
                width: d.s,
                height: d.s,
                background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95) 0 10%, ${colour}cc 38%, ${colour} 75%)`,
              }}
            />
          ))}
        </div>
      )}
      <Caption>Texture: {product.texture}</Caption>
    </div>
  );
}

/** A warm skin-tone panel with a swatch blended in: how the product sits on skin. */
function OnSkinView({ product }: { product: Product }) {
  const spf =
    product.category === "sunscreens" || product.keyIngredients.some((k) => /spf/i.test(k.name));
  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ background: "linear-gradient(135deg, #e7bf9f 0%, #d29f7c 55%, #b9835f 100%)" }}
    >
      <div
        className="absolute top-[28%] left-[12%] h-24 w-[70%] -rotate-6 rounded-full opacity-70 blur-md"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 35%, rgba(255,255,255,0.15) 100%)",
        }}
      />
      <div className="absolute top-[30%] left-[16%] h-10 w-[45%] -rotate-6 rounded-full bg-white/40 blur-sm" />
      {spf ? (
        <div className="absolute right-4 bottom-20 left-4 rounded-2xl bg-white/85 p-3 backdrop-blur">
          <p className="text-xs font-semibold text-skin-ink">Tested for no white cast on</p>
          <div className="mt-2 flex gap-1.5">
            {SKIN_TONES.map((t, i) => (
              <span key={t} className="h-7 flex-1 rounded-md" style={{ background: t }} aria-hidden>
                <span className="sr-only">Skin tone {i + 3}</span>
              </span>
            ))}
          </div>
          <p className="mt-1.5 text-[0.7rem] text-skin-subtle">Fitzpatrick types II to VI</p>
        </div>
      ) : null}
      <Caption>
        On skin: {product.fragranceFree ? "fragrance free, " : ""}
        {product.texture.toLowerCase()}
      </Caption>
    </div>
  );
}

function IngredientsView({ product }: { product: Product }) {
  const v = product.visual;
  return (
    <div
      className="flex size-full flex-col justify-center gap-5 px-8 sm:px-12"
      style={{ background: v.labelBg, color: v.labelInk }}
    >
      <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">What is inside</p>
      <ul className="space-y-4">
        {product.keyIngredients.map((k) => (
          <li key={k.name}>
            <p className="font-skin-display text-3xl leading-tight sm:text-4xl">
              {k.amount ? <span className="mr-2">{k.amount}</span> : null}
              {k.name}
            </p>
            <p className="mt-0.5 text-sm opacity-85">{k.benefit}</p>
          </li>
        ))}
      </ul>
      <p className="text-xs opacity-80">
        {product.fragranceFree ? "Fragrance free · " : ""}Dermatologist tested · Cruelty free
      </p>
    </div>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <p className="absolute bottom-4 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full bg-white/90 px-3.5 py-1.5 text-center text-xs font-medium text-skin-ink shadow-sm">
      {children}
    </p>
  );
}

/** Product gallery: the pack, a texture swatch, how it sits on skin and the key actives. */
export default function Gallery({ product }: { product: Product }) {
  const views: { label: string; thumb: ReactNode; view: ReactNode }[] = [
    {
      label: "Pack",
      thumb: <ProductVisual spec={product.visual} name={product.name} className="mx-auto w-3/4" />,
      view: (
        <div
          className="grid size-full place-items-center px-[14%] pt-[6%]"
          style={{ background: product.visual.tint }}
        >
          <ProductVisual spec={product.visual} name={product.name} className="max-h-full" />
        </div>
      ),
    },
    {
      label: "Texture",
      thumb: <TextureView product={product} />,
      view: <TextureView product={product} />,
    },
    {
      label: "On skin",
      thumb: <OnSkinView product={product} />,
      view: <OnSkinView product={product} />,
    },
    {
      label: "Ingredients",
      thumb: <IngredientsView product={product} />,
      view: <IngredientsView product={product} />,
    },
  ];
  const [index, setIndex] = useState(0);
  const go = (d: number) => setIndex((i) => (i + d + views.length) % views.length);

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      <ul className="flex gap-2.5 lg:flex-col" aria-label="Product views">
        {views.map((v, i) => (
          <li key={v.label} className="w-[calc(25%-0.5rem)] lg:w-20">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
              aria-label={`Show ${v.label.toLowerCase()} view`}
              className={cn(
                "relative block aspect-square w-full overflow-hidden rounded-xl ring-offset-2 transition [&_p]:hidden",
                i === index
                  ? "ring-2 ring-skin-ink"
                  : "opacity-80 ring-1 ring-skin-line hover:opacity-100",
              )}
              style={{ background: product.visual.tint }}
            >
              <span className="pointer-events-none absolute inset-0 origin-top-left scale-[0.25] [&>*]:h-[400%] [&>*]:w-[400%]">
                {i === 0 ? (
                  <span className="grid h-[400%] w-[400%] place-items-center px-[12%]">
                    {v.thumb}
                  </span>
                ) : (
                  v.thumb
                )}
              </span>
            </button>
            <span className="mt-1 block text-center text-[0.68rem] text-skin-subtle lg:hidden">
              {v.label}
            </span>
          </li>
        ))}
      </ul>
      <div className="relative flex-1">
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] sm:aspect-square lg:aspect-[4/5]"
          aria-live="polite"
        >
          <div key={index} className="size-full animate-skin-fade-in">
            {views[index].view}
          </div>
        </div>
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-skin-ink shadow-sm backdrop-blur transition hover:bg-white"
          aria-label="Previous view"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-skin-ink shadow-sm backdrop-blur transition hover:bg-white"
          aria-label="Next view"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
        <p className="absolute top-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-skin-ink backdrop-blur">
          {views[index].label}
        </p>
      </div>
    </div>
  );
}
