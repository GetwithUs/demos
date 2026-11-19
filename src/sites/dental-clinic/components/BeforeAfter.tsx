"use client";

import { MoveHorizontal } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Drag (or use arrow keys) to compare before and after. A native range input does the work, so
 * it is keyboard and screen reader friendly. Without a separate "before" photo, the same photo
 * is shown with a dulling filter.
 */
export default function BeforeAfter({
  after,
  before,
  alt,
  sizes,
  className,
  preload = false,
}: {
  after: StaticImageData;
  before?: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
}) {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <div
      className={cn(
        "group/compare relative aspect-[3/2] overflow-hidden rounded-[1.5rem] bg-dental-sand select-none has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-dental-spruce",
        className,
      )}
    >
      <Image src={after} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before ?? after}
          alt=""
          fill
          sizes={sizes}
          loading={preload ? "eager" : undefined}
          className={cn("object-cover", !before && "dental-before-filter")}
        />
      </div>

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-dental-ink/70 px-3 py-1 text-[0.75rem] font-semibold tracking-wide text-white backdrop-blur">
        Before
      </span>
      <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-dental-paper/90 px-3 py-1 text-[0.75rem] font-semibold tracking-wide text-dental-ink backdrop-blur">
        After
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/95 shadow-[0_0_12px_rgb(0_0_0/0.25)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-dental-spruce shadow-dental-lift transition-transform duration-300 group-hover/compare:scale-110">
          <MoveHorizontal className="size-5" />
        </span>
      </div>

      <label htmlFor={id} className="sr-only">
        Compare before and after: move the slider to reveal more of either photo
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-valuetext={`${position}% before, ${100 - position}% after`}
        className="absolute inset-0 h-full w-full cursor-ew-resize touch-pan-y appearance-none opacity-0"
      />
    </div>
  );
}
