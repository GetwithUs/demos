"use client";

import { Check } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { NEWSLETTER } from "@/sites/skincare/content/home";
import { useShopPrefs } from "@/sites/skincare/shop/prefs";

/** Newsletter sign-up. Simulated: the address is kept in this browser only. */
export default function Newsletter({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const subscribed = useShopPrefs((s) => s.newsletterEmail);
  const subscribe = useShopPrefs((s) => s.subscribe);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const id = useId();
  const dark = tone === "dark";

  if (subscribed) {
    return (
      <div
        className={cn(
          "rounded-2xl p-4 text-sm",
          dark ? "bg-white/10 text-white" : "bg-skin-accent-soft text-skin-ink",
          className,
        )}
        role="status"
      >
        <p className="flex items-center gap-2 font-medium">
          <Check className="size-4" aria-hidden />
          You are on the list
        </p>
        <p className={cn("mt-1", dark ? "text-white/75" : "text-skin-body")}>
          Welcome gift: use <strong className="tracking-wide">GLOW10</strong> for 10% off. (Demo: no
          email is sent.)
        </p>
      </div>
    );
  }

  return (
    <form
      className={className}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
          setError("Enter a valid email address.");
          return;
        }
        subscribe(email.trim());
      }}
    >
      <label
        htmlFor={id}
        className={cn("block font-skin-display text-xl", dark ? "text-white" : "text-skin-ink")}
      >
        {NEWSLETTER.title}
      </label>
      <p className={cn("mt-1 text-sm", dark ? "text-white/70" : "text-skin-body")}>
        {NEWSLETTER.text}
      </p>
      <div className="mt-3 flex gap-2">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(
            "h-11 min-w-0 flex-1 rounded-full px-4 text-sm focus:outline-none focus-visible:ring-2",
            dark
              ? "bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/60"
              : "border border-skin-line bg-white text-skin-ink focus-visible:ring-skin-accent/30",
          )}
        />
        <button
          type="submit"
          className={cn(
            "h-11 shrink-0 rounded-full px-5 text-sm font-medium transition",
            dark
              ? "bg-white text-skin-forest hover:bg-skin-sand"
              : "bg-skin-ink text-white hover:bg-black",
          )}
        >
          Subscribe
        </button>
      </div>
      {error ? (
        <p
          id={`${id}-err`}
          role="alert"
          className={cn("mt-2 text-sm", dark ? "text-[#ffc9bf]" : "text-skin-danger")}
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
