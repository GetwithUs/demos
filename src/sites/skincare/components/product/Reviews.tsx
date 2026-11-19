"use client";

import { BadgeCheck, PenLine, Star, ThumbsUp, X } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import Dialog from "@/sites/skincare/components/Dialog";
import { Stars, buttonClass } from "@/sites/skincare/components/ui";
import { SKIN_TYPES } from "@/sites/skincare/data/catalog";
import type { Product, SkinType } from "@/sites/skincare/data/types";
import { formatReviewDate, reviewsFor, type Review } from "@/sites/skincare/content/reviews";
import { formatCount, ratingBreakdown } from "@/sites/skincare/shop/catalog";

type Sort = "helpful" | "newest" | "high" | "low";

/** Rating summary with breakdown, filters, helpful votes and a simulated "Write a review" form. */
export default function Reviews({ product }: { product: Product }) {
  const [mine, setMine] = useState<Review[]>([]);
  const [voted, setVoted] = useState<string[]>([]);
  const [stars, setStars] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>("helpful");
  const [writing, setWriting] = useState(false);
  const sortId = useId();

  const base = reviewsFor(product.slug);
  const breakdown = ratingBreakdown(product.rating, product.reviewCount);
  const total = product.reviewCount + mine.length;
  const list = [...mine, ...base]
    .filter((r) => (stars === null ? true : stars <= 3 ? r.rating <= 3 : r.rating === stars))
    .sort((a, b) =>
      sort === "newest"
        ? b.date.localeCompare(a.date)
        : sort === "high"
          ? b.rating - a.rating
          : sort === "low"
            ? a.rating - b.rating
            : b.helpful - a.helpful,
    );

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2
          id="reviews-heading"
          className="font-skin-display text-3xl tracking-tight text-skin-ink sm:text-4xl"
        >
          Customer reviews
        </h2>
        <button
          type="button"
          onClick={() => setWriting(true)}
          className={buttonClass("outline", "md")}
        >
          <PenLine className="size-4" aria-hidden />
          Write a review
        </button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[320px_1fr] [&>*]:min-w-0">
        <div className="self-start rounded-3xl bg-white p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-4">
            <p className="font-skin-display text-6xl leading-none text-skin-ink">
              {product.rating.toFixed(1)}
            </p>
            <div>
              <Stars rating={product.rating} size={18} />
              <p className="mt-1 text-sm text-skin-subtle">{formatCount(total)} verified reviews</p>
            </div>
          </div>
          <ul className="mt-6 space-y-2" aria-label="Rating breakdown">
            {breakdown.map((n, i) => {
              const star = 5 - i;
              const pct = product.reviewCount ? Math.round((n / product.reviewCount) * 100) : 0;
              const active = stars === star || (star <= 3 && stars === 3 && star === 3);
              return (
                <li key={star}>
                  <button
                    type="button"
                    onClick={() => setStars(stars === star ? null : star <= 3 ? 3 : star)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-1 py-0.5 text-sm transition hover:bg-skin-sand",
                      active && "bg-skin-sand",
                    )}
                    aria-label={`${star} star: ${pct}% of reviews. Show ${star <= 3 ? "3 stars and below" : `${star} star reviews`}`}
                  >
                    <span className="flex w-7 items-center gap-0.5 text-skin-ink">
                      {star} <Star className="size-3 fill-skin-star text-skin-star" aria-hidden />
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-skin-sand">
                      <span
                        className="block h-full rounded-full bg-skin-star"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-9 text-right text-xs text-skin-subtle tabular-nums">
                      {pct}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 rounded-2xl bg-skin-accent-soft p-4 text-sm text-skin-ink">
            <strong>
              {Math.round(((breakdown[0] + breakdown[1]) / Math.max(1, product.reviewCount)) * 100)}
              %
            </strong>{" "}
            of buyers rate it 4 stars or more.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-skin-subtle">
            We publish every review, positive or negative, from buyers whose order was delivered.
          </p>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by rating">
              {[null, 5, 4, 3].map((s) => (
                <button
                  key={String(s)}
                  type="button"
                  aria-pressed={stars === s}
                  onClick={() => setStars(s)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition",
                    stars === s
                      ? "border-skin-ink bg-skin-ink text-white"
                      : "border-skin-line bg-white text-skin-ink hover:border-skin-ink/40",
                  )}
                >
                  {s === null ? "All" : s === 3 ? "3 stars and below" : `${s} stars`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor={sortId} className="text-skin-subtle">
                Sort
              </label>
              <select
                id={sortId}
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-9 rounded-full border border-skin-line bg-white px-3 text-sm text-skin-ink focus:border-skin-accent focus:outline-none"
              >
                <option value="helpful">Most helpful</option>
                <option value="newest">Newest</option>
                <option value="high">Highest rated</option>
                <option value="low">Lowest rated</option>
              </select>
            </div>
          </div>

          {list.length ? (
            <ul className="mt-6 divide-y divide-skin-line border-y border-skin-line">
              {list.map((r) => {
                const didVote = voted.includes(r.id);
                return (
                  <li key={r.id} className="py-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Stars rating={r.rating} />
                      <p className="text-xs text-skin-subtle">
                        {r.id.startsWith("mine") ? "Just now" : formatReviewDate(r.date)}
                      </p>
                    </div>
                    <h3 className="mt-2 font-medium text-skin-ink">{r.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-skin-body">{r.body}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-skin-subtle">
                        <span className="font-medium text-skin-ink">{r.name}</span>
                        <span>{r.city}</span>
                        <span aria-hidden>·</span>
                        <span>{SKIN_TYPES[r.skin]} skin</span>
                        {r.verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-skin-accent-soft px-2 py-0.5 font-medium text-skin-accent">
                            <BadgeCheck className="size-3.5" aria-hidden /> Verified buyer
                          </span>
                        ) : (
                          <span className="rounded-full bg-skin-saffron-soft px-2 py-0.5 font-medium text-skin-saffron-ink">
                            Shown only in this browser
                          </span>
                        )}
                      </p>
                      <button
                        type="button"
                        aria-pressed={didVote}
                        onClick={() =>
                          setVoted(didVote ? voted.filter((v) => v !== r.id) : [...voted, r.id])
                        }
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition",
                          didVote
                            ? "border-skin-accent bg-skin-accent-soft text-skin-accent"
                            : "border-skin-line text-skin-subtle hover:text-skin-ink",
                        )}
                      >
                        <ThumbsUp className="size-3.5" aria-hidden />
                        Helpful ({r.helpful + (didVote ? 1 : 0)})
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-skin-subtle">
              {base.length
                ? "No reviews with this rating yet."
                : "No reviews yet. Be the first to share how it worked for you."}
            </p>
          )}
          {base.length ? (
            <p className="mt-4 text-xs text-skin-subtle">
              Showing the {list.length} most helpful of {formatCount(total)} reviews.
            </p>
          ) : null}
        </div>
      </div>

      <WriteReview
        open={writing}
        product={product}
        onClose={() => setWriting(false)}
        onSubmit={(r) => {
          setMine([r, ...mine]);
          setWriting(false);
          setStars(null);
        }}
      />
    </section>
  );
}

function WriteReview({
  open,
  product,
  onClose,
  onSubmit,
}: {
  open: boolean;
  product: Product;
  onClose: () => void;
  onSubmit: (r: Review) => void;
}) {
  const titleId = useId();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      side="center"
      labelledBy={titleId}
      className="w-[min(94vw,560px)] rounded-3xl"
    >
      {open ? (
        <ReviewForm titleId={titleId} product={product} onClose={onClose} onSubmit={onSubmit} />
      ) : null}
    </Dialog>
  );
}

function ReviewForm({
  titleId,
  product,
  onClose,
  onSubmit,
}: {
  titleId: string;
  product: Product;
  onClose: () => void;
  onSubmit: (r: Review) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const field =
    "mt-1.5 h-11 w-full rounded-xl border border-skin-line bg-skin-bg px-3.5 text-sm text-skin-ink focus:border-skin-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-accent/25";
  const label = "text-sm font-medium text-skin-ink";
  const id = useId();

  return (
    <form
      className="max-h-[90dvh] overflow-y-auto bg-white p-6 sm:p-8"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const get = (k: string) => String(data.get(k) ?? "").trim();
        const next: Record<string, string> = {};
        if (!rating) next.rating = "Choose a star rating.";
        if (get("title").length < 3) next.title = "Add a short title.";
        if (get("body").length < 20) next.body = "Tell us a little more (at least 20 characters).";
        if (get("name").length < 2) next.name = "Add your name.";
        setErrors(next);
        if (Object.keys(next).length) return;
        onSubmit({
          id: `mine-${get("name")}-${get("title")}`,
          slug: product.slug,
          name: get("name"),
          city: get("city") || "India",
          skin: (get("skin") || "normal") as SkinType,
          rating,
          date: "2026-11-19",
          helpful: 0,
          title: get("title"),
          body: get("body"),
          verified: false,
        });
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="font-skin-display text-2xl text-skin-ink">
            Write a review
          </h2>
          <p className="mt-1 text-sm text-skin-subtle">{product.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-skin-sand"
          aria-label="Close"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <fieldset className="mt-6">
        <legend className={label}>Your rating</legend>
        <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer" onMouseEnter={() => setHover(n)}>
              <input
                type="radio"
                name="rating"
                value={n}
                className="peer sr-only"
                checked={rating === n}
                onChange={() => setRating(n)}
              />
              <Star
                className={cn(
                  "size-8 rounded transition peer-focus-visible:outline-2 peer-focus-visible:outline-skin-accent",
                  (hover || rating) >= n ? "fill-skin-star text-skin-star" : "text-skin-sand-2",
                )}
                aria-hidden
              />
              <span className="sr-only">
                {n} {n === 1 ? "star" : "stars"}
              </span>
            </label>
          ))}
        </div>
        {errors.rating ? <p className="mt-1 text-sm text-skin-danger">{errors.rating}</p> : null}
      </fieldset>

      <div className="mt-5 grid gap-4">
        <div>
          <label htmlFor={`${id}-title`} className={label}>
            Title
          </label>
          <input
            id={`${id}-title`}
            name="title"
            className={field}
            placeholder="Sum it up in a line"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? <p className="mt-1 text-sm text-skin-danger">{errors.title}</p> : null}
        </div>
        <div>
          <label htmlFor={`${id}-body`} className={label}>
            Your review
          </label>
          <textarea
            id={`${id}-body`}
            name="body"
            rows={4}
            className={cn(field, "h-auto py-3")}
            placeholder="How did your skin feel? How long have you used it?"
            aria-invalid={Boolean(errors.body)}
          />
          {errors.body ? <p className="mt-1 text-sm text-skin-danger">{errors.body}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor={`${id}-name`} className={label}>
              Name
            </label>
            <input
              id={`${id}-name`}
              name="name"
              className={field}
              autoComplete="given-name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <p className="mt-1 text-sm text-skin-danger">{errors.name}</p> : null}
          </div>
          <div>
            <label htmlFor={`${id}-city`} className={label}>
              City
            </label>
            <input id={`${id}-city`} name="city" className={field} autoComplete="address-level2" />
          </div>
          <div>
            <label htmlFor={`${id}-skin`} className={label}>
              Skin type
            </label>
            <select id={`${id}-skin`} name="skin" className={field} defaultValue="normal">
              {Object.entries(SKIN_TYPES).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <p className="mt-5 rounded-xl bg-skin-sand/70 p-3 text-xs text-skin-subtle">
        Demo: in a live store, reviews are checked before they appear. Here yours shows straight
        away, only in this browser.
      </p>
      <div className="mt-5 flex justify-end gap-3">
        <button type="button" onClick={onClose} className={buttonClass("ghost", "md")}>
          Cancel
        </button>
        <button type="submit" className={buttonClass("primary", "md")}>
          Submit review
        </button>
      </div>
    </form>
  );
}
