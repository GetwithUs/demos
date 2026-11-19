import { Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Listing, { ListingSkeleton } from "@/sites/skincare/components/listing/Listing";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { Breadcrumbs, Container } from "@/sites/skincare/components/ui";
import { CATEGORIES } from "@/sites/skincare/data/catalog";
import { productBySlug } from "@/sites/skincare/data/products";
import type { CategoryId } from "@/sites/skincare/data/types";
import { CATEGORY_PAGES } from "@/sites/skincare/content/collections";
import { CATEGORY_TILES } from "@/sites/skincare/content/home";

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((id) => ({ id }));
}

function isCategory(id: string): id is CategoryId {
  return id in CATEGORIES;
}

export async function generateMetadata({
  params,
}: PageProps<"/skincare/categories/[id]">): Promise<Metadata> {
  const { id } = await params;
  if (!isCategory(id)) return {};
  return { title: CATEGORIES[id].plural, description: CATEGORY_PAGES[id].intro };
}

export default async function CategoryPage({ params }: PageProps<"/skincare/categories/[id]">) {
  const { id } = await params;
  if (!isCategory(id)) notFound();
  const page = CATEGORY_PAGES[id];
  const hero = productBySlug(CATEGORY_TILES[id]);

  return (
    <>
      <section className="border-b border-skin-line bg-skin-sand/50">
        <Container className="grid items-center gap-8 pt-6 pb-10 sm:pt-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/skincare" },
                { label: "Shop", href: "/skincare/shop" },
                { label: CATEGORIES[id].plural },
              ]}
            />
            <h1 className="mt-6 font-skin-display text-4xl leading-tight tracking-tight text-skin-ink sm:text-5xl">
              {CATEGORIES[id].plural}
            </h1>
            <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-skin-body">
              {page.intro}
            </p>
            <p className="mt-5 inline-flex max-w-xl items-start gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-skin-body">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-skin-saffron" aria-hidden />
              <span>
                <span className="font-semibold text-skin-ink">Tip: </span>
                {page.tip}
              </span>
            </p>
          </div>
          {hero ? (
            <div
              className="mx-auto hidden w-56 rounded-[1.75rem] px-8 pt-6 md:block"
              style={{ background: hero.visual.tint }}
            >
              <ProductVisual spec={hero.visual} name={hero.name} className="animate-skin-float" />
            </div>
          ) : null}
        </Container>
      </section>
      <Container className="pb-8">
        <Suspense fallback={<ListingSkeleton />}>
          <Listing fixed={{ category: [id] }} />
        </Suspense>
      </Container>
    </>
  );
}
