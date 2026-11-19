"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useShopUI } from "@/sites/skincare/shop/ui";

/** A coupon code with a copy button, as on Indian product pages. */
export default function CopyCode({ code, className }: { code: string; className?: string }) {
  const toast = useShopUI((s) => s.toast);
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          // Clipboard can be blocked (e.g. insecure context); the code is visible anyway.
        }
        setCopied(true);
        toast(`Code ${code} copied`);
        setTimeout(() => setCopied(false), 1800);
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-dashed border-skin-accent/60 bg-white px-2.5 py-1 text-xs font-semibold tracking-wider text-skin-accent transition hover:bg-skin-accent-soft",
        className,
      )}
      aria-label={`Copy code ${code}`}
    >
      {code}
      {copied ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
    </button>
  );
}
