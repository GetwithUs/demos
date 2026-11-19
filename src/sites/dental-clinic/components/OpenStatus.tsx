"use client";

import { cn } from "@/lib/cn";
import { openStatus } from "@/sites/dental-clinic/lib/schedule";
import { useIsClient } from "@/sites/dental-clinic/lib/use-is-client";

/** "Open now, until 8:00 pm", worked out from the visitor's clock in Indian time. */
export default function OpenStatus({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const isClient = useIsClient();
  const status = isClient ? openStatus(new Date()) : null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[0.875rem] font-medium",
        tone === "dark" ? "text-dental-body" : "text-dental-ivory/90",
        className,
      )}
    >
      <span aria-hidden="true" className="relative flex size-2.5">
        {status?.open ? (
          <span className="absolute inset-0 animate-dental-ping rounded-full bg-dental-success" />
        ) : null}
        <span
          className={cn(
            "relative size-2.5 rounded-full",
            status === null
              ? "bg-dental-sage"
              : status.open
                ? "bg-dental-success"
                : "bg-dental-brass",
          )}
        />
      </span>
      {status ? status.text : "Open 7 days, Sunday by appointment"}
    </span>
  );
}
