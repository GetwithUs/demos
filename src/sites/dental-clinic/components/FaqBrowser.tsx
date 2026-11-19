"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { FaqList } from "@/sites/dental-clinic/components/sections";
import type { FaqGroup } from "@/sites/dental-clinic/content/faqs";

/** All FAQs by topic, with a search box that filters questions and answers as you type. */
export default function FaqBrowser({ groups }: { groups: FaqGroup[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = groups
    .map((g) => ({
      ...g,
      items: q ? g.items.filter((i) => `${i.q} ${i.a}`.toLowerCase().includes(q)) : g.items,
    }))
    .filter((g) => g.items.length > 0);
  const count = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <label htmlFor="dental-faq-search" className="font-semibold text-dental-ink">
          Search questions
        </label>
        <div className="relative mt-2">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-dental-muted"
          />
          <input
            id="dental-faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try EMI, pain or Sunday"
            className="h-12 w-full rounded-full border border-dental-line bg-white pr-11 pl-11 text-dental-ink placeholder:text-dental-muted/70 focus-visible:border-dental-spruce focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-dental-spruce/25 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-dental-muted hover:bg-dental-sand"
            >
              <X aria-hidden="true" className="size-4" />
              <span className="sr-only">Clear search</span>
            </button>
          ) : null}
        </div>
        <p aria-live="polite" className="mt-2 text-[0.8125rem] text-dental-muted">
          {q ? `${count} ${count === 1 ? "answer" : "answers"} found` : `${count} answers`}
        </p>
        <nav aria-label="FAQ topics" className="mt-6 hidden lg:block">
          <ul className="space-y-1">
            {filtered.map((g) => (
              <li key={g.id}>
                <a
                  href={`#faq-${g.id}`}
                  className="block rounded-lg px-3 py-2 text-[0.9375rem] text-dental-body transition-colors hover:bg-dental-paper hover:text-dental-ink"
                >
                  {g.title}
                  <span className="ml-1.5 text-dental-muted">({g.items.length})</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="min-w-0 space-y-14">
        {filtered.map((g) => (
          <section
            key={g.id}
            id={`faq-${g.id}`}
            aria-labelledby={`faq-${g.id}-title`}
            className="scroll-mt-28"
          >
            <h2
              id={`faq-${g.id}-title`}
              className="font-dental-display text-[1.75rem] leading-tight text-dental-ink"
            >
              {g.title}
            </h2>
            <FaqList items={g.items} className="mt-4" />
          </section>
        ))}
        {filtered.length === 0 ? (
          <p className="rounded-2xl bg-dental-paper p-6 text-dental-body shadow-dental-soft">
            No answers match &ldquo;{query}&rdquo;. Try a simpler word, or ask the WhatsApp
            assistant.
          </p>
        ) : null}
      </div>
    </div>
  );
}
