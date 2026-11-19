"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ReviewCard } from "@/sites/dental-clinic/components/cards";
import type { Review } from "@/sites/dental-clinic/content/reviews";

/** Review cards with filter chips by treatment. */
export default function ReviewsBrowser({ reviews }: { reviews: Review[] }) {
  const [filter, setFilter] = useState("All");
  const treatments = ["All", ...Array.from(new Set(reviews.map((r) => r.treatment)))];
  const shown = filter === "All" ? reviews : reviews.filter((r) => r.treatment === filter);

  return (
    <div>
      <div role="group" aria-label="Filter reviews by treatment" className="flex flex-wrap gap-2">
        {treatments.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            aria-pressed={filter === t}
            className={cn(
              "rounded-full border px-4 py-2 text-[0.875rem] font-medium transition-colors",
              filter === t
                ? "border-dental-spruce bg-dental-spruce text-white"
                : "border-dental-line bg-dental-paper text-dental-ink hover:border-dental-sage",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "review" : "reviews"}
      </p>
      <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((review, i) => (
          <li key={review.id} className="animate-dental-pop">
            <ReviewCard review={review} index={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}
