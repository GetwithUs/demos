import { ArrowRight, CircleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/sites/skincare/components/ui";
import { CONCERNS } from "@/sites/skincare/data/catalog";
import { PRODUCTS } from "@/sites/skincare/data/products";
import { INGREDIENTS, productIngredientIds } from "@/sites/skincare/content/ingredients";

export const metadata: Metadata = {
  title: "Ingredient glossary",
  description:
    "What niacinamide, vitamin C, retinol, salicylic acid and more do, who they suit and how to use them.",
};

export default function IngredientsPage() {
  const list = [...INGREDIENTS].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <Container className="pb-10">
      <PageHeader
        crumb="Ingredients"
        eyebrow="Ingredient glossary"
        title="Know what you put on your skin"
        intro="Every active we use, what it does, who it suits and what not to mix it with. Plain words, no jargon."
      />
      <nav aria-label="Jump to an ingredient" className="mt-8">
        <ul className="flex flex-wrap gap-2">
          {list.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className="inline-flex rounded-full border border-skin-line bg-white px-3.5 py-1.5 text-sm text-skin-ink transition hover:border-skin-ink"
              >
                {i.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {list.map((i) => {
          const products = PRODUCTS.filter((p) => productIngredientIds(p).includes(i.id));
          return (
            <li
              key={i.id}
              id={i.id}
              className="scroll-mt-28 overflow-hidden rounded-3xl bg-white ring-1 ring-skin-line"
            >
              <div className="px-6 pt-6 pb-5 sm:px-8" style={{ background: i.tint }}>
                <p className="text-xs font-semibold tracking-[0.16em] text-skin-subtle uppercase">
                  {i.short}
                </p>
                <h2 className="mt-1 font-skin-display text-3xl text-skin-ink">{i.name}</h2>
                {i.aka.length ? (
                  <p className="mt-1 text-sm text-skin-body">Also called {i.aka.join(", ")}</p>
                ) : null}
              </div>
              <div className="space-y-4 px-6 py-6 text-[0.95rem] text-skin-body sm:px-8">
                <p>{i.whatItDoes}</p>
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="font-semibold text-skin-ink">Best for</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {i.bestFor.map((c) => (
                        <Link
                          key={c}
                          href={`/skincare/concerns/${c}`}
                          className="rounded-full bg-skin-sand px-2.5 py-0.5 text-skin-ink hover:bg-skin-sand-2"
                        >
                          {CONCERNS[c].label}
                        </Link>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-skin-ink">How to use</dt>
                    <dd>{i.howToUse}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-skin-ink">Pairs well with</dt>
                    <dd>{i.pairsWith}</dd>
                  </div>
                  {i.avoidWith ? (
                    <div className="flex gap-2 rounded-xl bg-skin-saffron-soft/70 px-3 py-2">
                      <CircleAlert
                        className="mt-0.5 size-4 shrink-0 text-skin-saffron-ink"
                        aria-hidden
                      />
                      <div>
                        <dt className="font-semibold text-skin-ink">Avoid</dt>
                        <dd>{i.avoidWith}</dd>
                      </div>
                    </div>
                  ) : null}
                </dl>
                {products.length ? (
                  <div className="border-t border-skin-line pt-4 text-sm">
                    <p className="font-semibold text-skin-ink">Find it in</p>
                    <ul className="mt-1.5 space-y-1">
                      {products.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/skincare/products/${p.slug}`}
                            className="text-skin-accent hover:underline"
                          >
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/skincare/shop?ingredient=${i.id}`}
                      className="mt-3 inline-flex items-center gap-1 font-medium text-skin-ink hover:underline"
                    >
                      Shop {i.name.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
