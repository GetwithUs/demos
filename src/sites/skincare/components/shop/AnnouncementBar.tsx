"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ANNOUNCEMENTS } from "@/sites/skincare/content/nav";

/** Slim offers bar above the header. Rotates every few seconds; pauses on hover or focus. */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 4500);
    return () => clearInterval(timer);
  }, [paused]);

  const item = ANNOUNCEMENTS[index];
  const step = (d: number) =>
    setIndex((i) => (i + d + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);

  return (
    <div
      className="bg-skin-forest text-[0.8rem] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto flex h-9 max-w-[1320px] items-center justify-between gap-2 px-2 sm:px-6">
        <button
          type="button"
          onClick={() => step(-1)}
          className="grid size-7 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Previous offer"
        >
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <p className="min-w-0 flex-1 overflow-hidden text-center" aria-live="off">
          <Link
            key={index}
            href={item.href}
            className="inline-block animate-skin-ticker truncate align-middle font-medium tracking-wide hover:underline"
          >
            {item.text}
          </Link>
        </p>
        <button
          type="button"
          onClick={() => step(1)}
          className="grid size-7 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Next offer"
        >
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
