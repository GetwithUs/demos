import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Listing, { ListingSkeleton } from "@/sites/skincare/components/listing/Listing";
import { Breadcrumbs, Container } from "@/sites/skincare/components/ui";
import { CONCERNS } from "@/sites/skincare/data/catalog";
import type { ConcernId } from "@/sites/skincare/data/types";
import { CONCERN_PAGES } from "@/sites/skincare/content/collections";
import { CONCERN_TILES } from "@/sites/skincare/content/home";
import { ingredientById } from "@/sites/skincare/content/ingredients";

export function generateStaticParams() {
  return Object.keys(CONCERNS).map((id) => ({ id }));
}

function isConcern(id: string): id is ConcernId {
  return id in CONCERNS;
}

export async function generateMetadata({
  params,
}: PageProps<"/skincare/concerns/[id]">): Promise<Metadata> {
  const { id } = await params;
  if (!isConcern(id)) return {};
  return {
    title: `${CONCERNS[id].label}: skincare that helps`,
    description: CONCERN_PAGES[id].intro,
  };
}

export default async function ConcernPage({ params }: PageProps<"/skincare/concerns/[id]">) {
  const { id } = await params;
  if (!isConcern(id)) notFound();
  const page = CONCERN_PAGES[id];
  const tile = CONCERN_TILES[id];

  return (
    <>
      <section style={{ background: tile.tint }}>
        <Container className="grid gap-10 pt-6 pb-12 sm:pt-8 lg:grid-cols-[1.2fr_1fr] lg:pb-16 [&>*]:min-w-0">
          <div>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/skincare" },
                { label: "Shop", href: "/skincare/shop" },
                { label: page.title },
              ]}
            />
            <p className="mt-8 font-skin-display text-2xl italic" style={{ color: tile.ink }}>
              {tile.mark}
            </p>
            <h1 className="mt-1 font-skin-display text-4xl leading-tight tracking-tight text-skin-ink sm:text-5xl">
              {page.title}
            </h1>
            <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-skin-body">
              {page.intro}
            </p>
            <p className="mt-4 max-w-xl text-sm text-skin-body">
              <span className="font-semibold text-skin-ink">Common triggers: </span>
              {page.causes}
            </p>
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-[0.16em] text-skin-subtle uppercase">
                Ingredients that help
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {page.ingredients.map((iid) => {
                  const ing = ingredientById(iid);
                  return ing ? (
                    <li key={iid}>
                      <Link
                        href={`/skincare/shop?ingredient=${iid}`}
                        className="inline-flex rounded-full bg-white/80 px-3.5 py-1.5 text-sm text-skin-ink ring-1 ring-black/5 transition hover:bg-white"
                      >
                        {ing.name}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </div>
          <div className="self-end rounded-[1.75rem] bg-white/75 p-6 backdrop-blur sm:p-8">
            <p className="text-xs font-semibold tracking-[0.16em] text-skin-subtle uppercase">
              A simple routine
            </p>
            <ol className="mt-4 space-y-3">
              {page.routine.map((step, i) => (
                <li key={step} className="flex gap-3 text-[0.95rem] text-skin-ink">
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold text-white"
                    style={{ background: tile.ink }}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <Link
              href="/skincare/skin-quiz"
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-skin-ink underline-offset-4 hover:underline"
            >
              Get a routine made for you <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>
      <Container className="pb-8">
        <Suspense fallback={<ListingSkeleton />}>
          <Listing fixed={{ concern: [id] }} />
        </Suspense>
      </Container>
    </>
  );
}
