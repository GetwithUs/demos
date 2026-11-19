import { cn } from "@/lib/cn";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import type { ProductVisualSpec } from "@/sites/skincare/data/types";

/** A product pack on its tint tile, for tables and lists. Decorative next to the product name. */
export default function ProductThumb({
  spec,
  name,
  size = "md",
  className,
  decorative = true,
}: {
  spec?: ProductVisualSpec;
  name: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  decorative?: boolean;
}) {
  const box =
    size === "xs"
      ? "size-8 rounded-md"
      : size === "sm"
        ? "size-10 rounded-lg"
        : size === "md"
          ? "size-12 rounded-lg"
          : "size-16 rounded-xl";
  return (
    <div
      aria-hidden={decorative || undefined}
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden ring-1 ring-black/5",
        box,
        className,
      )}
      style={{ background: spec?.tint ?? "#f1ebe1" }}
    >
      {spec ? (
        <ProductVisual spec={spec} name={name} className="h-[115%] w-auto translate-y-[4%]" />
      ) : null}
    </div>
  );
}
