"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { TREATMENTS } from "@/sites/dental-clinic/content/treatments";
import { formatINR } from "@/sites/dental-clinic/lib/format";

const MONTHS = [3, 6, 9, 12] as const;
const PRESETS = TREATMENTS.filter((t) => t.emi).flatMap((t) =>
  t.priceOptions
    .filter((o) => o.from >= 10000)
    .slice(0, 1)
    .map((o) => ({ label: t.shortName, amount: o.from })),
);

/** Works out a no-cost EMI. Purely arithmetic; no lender is contacted. */
export default function EmiCalculator() {
  const [amount, setAmount] = useState(30000);
  const [months, setMonths] = useState<(typeof MONTHS)[number]>(12);
  const id = useId();
  const monthly = Math.ceil(amount / months / 10) * 10;

  return (
    <div className="rounded-[1.75rem] bg-dental-paper p-6 shadow-dental-soft sm:p-8">
      <p className="text-[0.75rem] font-semibold tracking-[0.14em] text-dental-brass-deep uppercase">
        EMI calculator
      </p>
      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor={`${id}-amount`} className="font-semibold text-dental-ink">
            Treatment cost
          </label>
          <output
            htmlFor={`${id}-amount`}
            className="font-dental-display text-[1.5rem] text-dental-ink tabular-nums"
          >
            {formatINR(amount)}
          </output>
        </div>
        <input
          id={`${id}-amount`}
          type="range"
          min={10000}
          max={300000}
          step={500}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          aria-valuetext={formatINR(amount)}
          className="mt-3 w-full accent-dental-spruce"
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setAmount(p.amount)}
              className={cn(
                "rounded-full border px-3 py-1 text-[0.8125rem] font-medium transition-colors",
                amount === p.amount
                  ? "border-dental-spruce bg-dental-mist text-dental-spruce"
                  : "border-dental-line text-dental-body hover:border-dental-sage",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="font-semibold text-dental-ink">Months</legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {MONTHS.map((m) => (
            <label
              key={m}
              className="cursor-pointer rounded-xl border border-dental-line py-2.5 text-center font-semibold text-dental-ink transition-colors has-[:checked]:border-dental-spruce has-[:checked]:bg-dental-spruce has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-dental-spruce"
            >
              <input
                type="radio"
                name={`${id}-months`}
                value={m}
                checked={months === m}
                onChange={() => setMonths(m)}
                className="sr-only"
              />
              {m}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 rounded-2xl bg-dental-mist p-5" aria-live="polite">
        <p className="text-[0.875rem] text-dental-muted">You would pay about</p>
        <p className="mt-1 font-dental-display text-[2.4rem] leading-none text-dental-ink tabular-nums">
          {formatINR(monthly)}
          <span className="ml-1.5 font-dental-sans text-base text-dental-muted">a month</span>
        </p>
        <p className="mt-2 text-[0.8125rem] text-dental-muted">
          for {months} months, no interest. A processing fee may apply. Subject to approval.
        </p>
      </div>
    </div>
  );
}
