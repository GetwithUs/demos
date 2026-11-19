"use client";

import { Banknote, CircleAlert, MapPin, RotateCcw, Truck } from "lucide-react";
import { useId, useState } from "react";
import { SHIPPING } from "@/sites/skincare/data/catalog";
import { checkPincode, type PincodeResult } from "@/sites/skincare/lib/pincode";
import { useShopUI } from "@/sites/skincare/shop/ui";

/** "Check delivery" box: delivery date, cash on delivery and returns for a pincode. */
export default function PincodeCheck({ title = "Check delivery" }: { title?: string }) {
  const remembered = useShopUI((s) => s.pincode);
  const setPincode = useShopUI((s) => s.setPincode);
  const [value, setValue] = useState(remembered);
  // Show the last check straight away when the shopper has already entered a pincode.
  const [result, setResult] = useState<PincodeResult | undefined>(() =>
    remembered ? checkPincode(remembered) : undefined,
  );
  const id = useId();

  const check = () => {
    const r = checkPincode(value);
    setResult(r);
    if (r.ok) setPincode(value.trim());
  };

  return (
    <div className="rounded-2xl border border-skin-line bg-white p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-skin-ink">
          <MapPin className="size-4 text-skin-accent" aria-hidden />
          {title}
        </label>
        <div className="mt-2.5 flex gap-2">
          <input
            id={id}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="Enter pincode"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
            aria-describedby={result ? `${id}-result` : undefined}
            className="h-11 min-w-0 flex-1 rounded-full border border-skin-line bg-skin-bg px-4 text-sm tracking-wider focus:border-skin-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-accent/25"
          />
          <button
            type="submit"
            className="h-11 rounded-full px-5 text-sm font-semibold text-skin-accent ring-1 ring-skin-accent/40 transition hover:bg-skin-accent hover:text-white"
          >
            Check
          </button>
        </div>
      </form>
      <div id={`${id}-result`} aria-live="polite">
        {result ? (
          result.ok ? (
            <ul className="mt-3 space-y-2 text-sm text-skin-body">
              <li className="flex items-start gap-2">
                <Truck className="mt-0.5 size-4 shrink-0 text-skin-success" aria-hidden />
                <span>
                  <strong className="text-skin-ink">{result.message.split(".")[0]}</strong>
                  {result.city ? ` to ${result.city}` : ""}.{" "}
                  {result.minDays === result.maxDays
                    ? `${result.minDays} day delivery.`
                    : `${result.minDays} to ${result.maxDays} days.`}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Banknote
                  className={`mt-0.5 size-4 shrink-0 ${result.cod ? "text-skin-success" : "text-skin-danger"}`}
                  aria-hidden
                />
                {result.cod
                  ? "Cash on delivery available"
                  : "Cash on delivery is not available here. Pay online instead."}
              </li>
              <li className="flex items-start gap-2">
                <RotateCcw className="mt-0.5 size-4 shrink-0 text-skin-success" aria-hidden />
                Easy {SHIPPING.returnDays} day returns on unopened products
              </li>
            </ul>
          ) : (
            <p className="mt-3 flex items-center gap-2 text-sm text-skin-danger">
              <CircleAlert className="size-4" aria-hidden />
              {result.message}
            </p>
          )
        ) : (
          <p className="mt-2.5 text-xs text-skin-subtle">
            Free delivery above ₹{SHIPPING.freeAbove}. Try 248001 (Dehradun) or 400050 (Mumbai).
          </p>
        )}
      </div>
    </div>
  );
}
