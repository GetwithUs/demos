"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { COURIERS } from "@/sites/skincare/lib/seed";
import { Overlay } from "@/sites/skincare/admin/components/Overlay";
import { Button, describedBy, Field, inputClass } from "@/sites/skincare/admin/components/ui";

const COURIER_INFO: Record<(typeof COURIERS)[number], { speed: string; rate: string }> = {
  Delhivery: { speed: "2 to 4 days, most pincodes", rate: "₹58 per 500 g" },
  "Blue Dart": { speed: "1 to 3 days, metros", rate: "₹92 per 500 g" },
  Ekart: { speed: "3 to 5 days, wide reach", rate: "₹49 per 500 g" },
  Xpressbees: { speed: "2 to 4 days, good COD", rate: "₹54 per 500 g" },
};

/**
 * Choose a courier (and, for one order, the AWB) before shipping. Rates are illustrative; in
 * a real store this is where the shipping aggregator books the pickup.
 */
export default function ShipDialog({
  open,
  onClose,
  count,
  initialAwb,
  onShip,
}: {
  open: boolean;
  onClose: () => void;
  /** Number of orders being shipped. */
  count: number;
  /** Pre-filled AWB when shipping a single order. */
  initialAwb?: string;
  onShip: (courier: string, awb?: string) => void;
}) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      title={count === 1 ? "Ship order" : `Ship ${count} orders`}
      description="Pick the courier that collects today. The customer can track the parcel with the AWB number."
    >
      {open ? (
        <ShipForm count={count} initialAwb={initialAwb} onCancel={onClose} onShip={onShip} />
      ) : null}
    </Overlay>
  );
}

function ShipForm({
  count,
  initialAwb,
  onCancel,
  onShip,
}: {
  count: number;
  initialAwb?: string;
  onCancel: () => void;
  onShip: (courier: string, awb?: string) => void;
}) {
  const [courier, setCourier] = useState<string>(COURIERS[0]);
  const [awb, setAwb] = useState(initialAwb ?? "");
  const [error, setError] = useState("");

  const submit = () => {
    if (count === 1) {
      const clean = awb.replace(/\s+/g, "");
      if (!/^\d{8,14}$/.test(clean)) {
        setError("Enter the AWB number from the courier: 8 to 14 digits.");
        return;
      }
      onShip(courier, clean);
    } else {
      onShip(courier);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <fieldset>
        <legend className="mb-2 text-[0.8125rem] font-medium text-stone-800">Courier</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {COURIERS.map((c, i) => (
            <label
              key={c}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
                courier === c
                  ? "border-skin-accent bg-skin-accent-soft/60"
                  : "border-stone-200 hover:border-stone-300",
              )}
            >
              <input
                type="radio"
                name="courier"
                value={c}
                checked={courier === c}
                onChange={() => setCourier(c)}
                data-autofocus={i === 0 ? true : undefined}
                className="mt-1 accent-skin-accent"
              />
              <span>
                <span className="block font-medium text-stone-900">{c}</span>
                <span className="block text-xs text-stone-600">{COURIER_INFO[c].speed}</span>
                <span className="block text-xs text-stone-500">{COURIER_INFO[c].rate}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {count === 1 ? (
        <Field
          label="AWB number"
          htmlFor="awb"
          error={error}
          hint="Filled in with a demo number. Change it if you like."
          className="mt-4"
        >
          <input
            id="awb"
            inputMode="numeric"
            value={awb}
            onChange={(e) => {
              setAwb(e.target.value);
              setError("");
            }}
            className={cn(inputClass, "tabular-nums")}
            {...describedBy("awb", { error, hint: true })}
          />
        </Field>
      ) : (
        <p className="mt-4 rounded-lg bg-stone-50 px-3 py-2.5 text-[0.8125rem] text-stone-600">
          Each order gets its own AWB number from {courier}. Only orders that are packed will ship.
        </p>
      )}

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">
          {count === 1 ? "Mark as shipped" : `Ship ${count} orders`}
        </Button>
      </div>
    </form>
  );
}
