import { cn } from "@/lib/cn";

/**
 * The slim line at the very top of every demo page saying it is a template, not a real
 * business. Required on every page of every demo; style it with `className` to suit the
 * site, but keep the words and keep it visible.
 */
export default function DemoBanner({
  business,
  className,
}: {
  /** What the made-up business is, as in "not a real dental clinic". */
  business: string;
  className?: string;
}) {
  return (
    <div
      role="note"
      className={cn(
        "relative z-50 bg-neutral-950 px-4 py-2 text-center text-[0.8125rem] leading-snug text-neutral-200",
        className,
      )}
    >
      <span className="font-semibold text-white">Demo website by GetwithUs.</span> This is a
      template, not a real {business}. Bookings, orders and payments are pretend.
    </div>
  );
}
