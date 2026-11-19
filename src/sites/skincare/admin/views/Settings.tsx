"use client";

import {
  Banknote,
  CreditCard,
  Landmark,
  RotateCcw,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { BRAND, SHIPPING } from "@/sites/skincare/data/catalog";
import type { PaymentMethod } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { OWNER_LOGIN, useDemoStore } from "@/sites/skincare/lib/store";
import { ConfirmDialog } from "@/sites/skincare/admin/components/Overlay";
import { useToast } from "@/sites/skincare/admin/components/Toast";
import {
  Button,
  Card,
  CardHeader,
  describedBy,
  Field,
  inputClass,
  PageHeader,
  PageSkeleton,
  Toggle,
} from "@/sites/skincare/admin/components/ui";
import { STORE_DETAILS } from "@/sites/skincare/admin/lib/gst";
import { useAdminReady } from "@/sites/skincare/admin/lib/hooks";

type Store = {
  name: string;
  legalName: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  phone: string;
};

const INITIAL: Store = {
  name: BRAND.name,
  legalName: STORE_DETAILS.legalName,
  gstin: STORE_DETAILS.gstin,
  address: STORE_DETAILS.addressLines.join(", "),
  city: STORE_DETAILS.city,
  state: STORE_DETAILS.state,
  pincode: STORE_DETAILS.pincode,
  email: BRAND.supportEmail,
  phone: BRAND.supportPhone,
};

const PAYMENTS: { key: PaymentMethod; label: string; description: string; icon: LucideIcon }[] = [
  {
    key: "upi",
    label: "UPI",
    description: "Google Pay, PhonePe, Paytm and any UPI app",
    icon: Smartphone,
  },
  {
    key: "card",
    label: "Debit and credit cards",
    description: "Visa, Mastercard, RuPay",
    icon: CreditCard,
  },
  {
    key: "netbanking",
    label: "Net banking",
    description: "All major Indian banks",
    icon: Landmark,
  },
  {
    key: "cod",
    label: "Cash on delivery",
    description: `Up to ${formatINR(SHIPPING.codMax)}, with a ${formatINR(SHIPPING.codFee)} fee`,
    icon: Banknote,
  },
];

function validate(s: Store) {
  return {
    name: s.name.trim().length < 2 ? "Enter the store name." : undefined,
    legalName: s.legalName.trim().length < 3 ? "Enter the registered business name." : undefined,
    gstin: !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(s.gstin.trim().toUpperCase())
      ? "A GSTIN has 15 characters, like 05ABCDE1234F1Z5."
      : undefined,
    pincode: !/^[1-9]\d{5}$/.test(s.pincode.trim()) ? "Enter a 6-digit pincode." : undefined,
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())
      ? "Enter a valid email address."
      : undefined,
    phone: s.phone.replace(/\D/g, "").length < 10 ? "Enter a 10-digit phone number." : undefined,
  };
}

export default function Settings() {
  const ready = useAdminReady();
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const signIn = useDemoStore((s) => s.signIn);
  const toast = useToast();
  const [store, setStore] = useState<Store>(INITIAL);
  const [saved, setSaved] = useState<Store>(INITIAL);
  const [show, setShow] = useState(false);
  const [payments, setPayments] = useState<Record<PaymentMethod, boolean>>({
    upi: true,
    card: true,
    netbanking: true,
    cod: true,
  });
  const [whatsapp, setWhatsapp] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!ready) return <PageSkeleton rows={2} />;

  const errors = validate(store);
  const shown = show ? errors : ({} as Partial<ReturnType<typeof validate>>);
  const dirty = JSON.stringify(store) !== JSON.stringify(saved);

  const save = (e: FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some(Boolean)) {
      setShow(true);
      return;
    }
    setSaved(store);
    setShow(false);
    toast({ title: "Store details saved", description: "Demo: kept on this page only." });
  };

  const field = (
    key: keyof Store,
    label: string,
    opts: { hint?: string; type?: string; className?: string; mono?: boolean } = {},
  ) => (
    <Field
      label={label}
      htmlFor={`s-${key}`}
      error={shown[key as keyof typeof shown]}
      hint={opts.hint}
      className={opts.className}
    >
      <input
        id={`s-${key}`}
        type={opts.type ?? "text"}
        value={store[key]}
        onChange={(e) => setStore((s) => ({ ...s, [key]: e.target.value }))}
        className={cn(inputClass, opts.mono && "font-mono uppercase")}
        {...describedBy(`s-${key}`, {
          error: shown[key as keyof typeof shown],
          hint: Boolean(opts.hint),
        })}
      />
    </Field>
  );

  const enabled = Object.values(payments).filter(Boolean).length;

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Store details, delivery rules and payment options."
      />

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <form onSubmit={save} noValidate>
              <CardHeader
                title="Store details"
                description="Shown on invoices, emails and the shop footer."
              />
              <div className="grid gap-4 border-t border-stone-100 px-5 py-5 sm:grid-cols-2">
                {field("name", "Store name")}
                {field("legalName", "Registered business name")}
                {field("gstin", "GSTIN", {
                  hint: "Uttarakhand registration (state code 05)",
                  mono: true,
                })}
                {field("email", "Support email", { type: "email" })}
                {field("address", "Address", { className: "sm:col-span-2" })}
                {field("city", "City")}
                {field("state", "State")}
                {field("pincode", "Pincode")}
                {field("phone", "Support phone", { hint: "Shown as text in the shop" })}
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-stone-100 bg-stone-50/70 px-5 py-3">
                <Button
                  disabled={!dirty}
                  onClick={() => {
                    setStore(saved);
                    setShow(false);
                  }}
                >
                  Discard
                </Button>
                <Button type="submit" variant="primary" disabled={!dirty}>
                  Save details
                </Button>
              </div>
            </form>
          </Card>

          <Card>
            <CardHeader
              title="Delivery and returns"
              description="The rules the shop's cart and checkout use. Read-only in this demo."
            />
            <dl className="grid border-t border-stone-100 sm:grid-cols-2">
              {[
                {
                  label: "Free delivery",
                  value: `Orders of ${formatINR(SHIPPING.freeAbove)} or more`,
                },
                {
                  label: "Delivery fee",
                  value: `${formatINR(SHIPPING.fee)} below ${formatINR(SHIPPING.freeAbove)}`,
                },
                { label: "Cash on delivery fee", value: formatINR(SHIPPING.codFee) },
                { label: "Cash on delivery limit", value: `Up to ${formatINR(SHIPPING.codMax)}` },
                {
                  label: "Prepaid discount",
                  value: `${SHIPPING.prepaidPercent}% off, up to ${formatINR(SHIPPING.prepaidMax)}`,
                },
                { label: "Returns", value: `${SHIPPING.returnDays} days, unopened products` },
                { label: "Ships from", value: `${STORE_DETAILS.city}, ${STORE_DETAILS.state}` },
                { label: "Couriers", value: "Delhivery, Blue Dart, Ekart, Xpressbees" },
              ].map((r, i) => (
                <div
                  key={r.label}
                  className={`flex flex-col gap-0.5 px-5 py-3 ${i % 2 === 0 ? "sm:border-r sm:border-stone-100" : ""} border-b border-stone-100`}
                >
                  <dt className="text-xs text-stone-500">{r.label}</dt>
                  <dd className="text-sm text-stone-900">{r.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader
              title="Payment methods"
              description={`${enabled} of 4 turned on. Demo switches, the checkout is not changed.`}
            />
            <ul className="divide-y divide-stone-100 border-t border-stone-100">
              {PAYMENTS.map((p) => (
                <li key={p.key} className="flex items-start gap-3 px-5 py-3.5">
                  <span
                    aria-hidden
                    className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-stone-100 text-stone-600"
                  >
                    <p.icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Toggle
                      id={`pay-${p.key}`}
                      checked={payments[p.key]}
                      onChange={(v) => {
                        if (!v && enabled === 1) {
                          toast({ title: "Keep at least one payment method on", tone: "info" });
                          return;
                        }
                        setPayments((x) => ({ ...x, [p.key]: v }));
                        toast({
                          title: `${p.label} turned ${v ? "on" : "off"}`,
                          description: "Demo only.",
                          tone: "info",
                        });
                      }}
                      label={p.label}
                      description={p.description}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Notifications" />
            <div className="space-y-4 border-t border-stone-100 px-5 py-4">
              <Toggle
                id="n-whatsapp"
                checked={whatsapp}
                onChange={setWhatsapp}
                label="WhatsApp updates to customers"
                description="Order confirmed, shipped with AWB, out for delivery and delivered."
              />
              <Toggle
                id="n-email"
                checked={emailAlerts}
                onChange={setEmailAlerts}
                label="Email me new orders"
                description={OWNER_LOGIN.email}
              />
            </div>
          </Card>

          <Card className="border-red-200">
            <CardHeader
              title="Reset demo data"
              description="Brings back the original products, prices, stock and sample orders. Orders placed from this browser are removed."
            />
            <div className="border-t border-red-100 px-5 py-4">
              <Button variant="danger-soft" onClick={() => setConfirmReset(true)}>
                <RotateCcw aria-hidden className="size-4" />
                Reset demo data
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        danger
        title="Reset all demo data?"
        confirmLabel="Reset demo data"
        description="Product edits, added products, stock changes, order updates and orders from this browser will be cleared. The shop's cart and wishlist are emptied too. You stay signed in."
        onConfirm={() => {
          resetDemo();
          signIn(OWNER_LOGIN.email, OWNER_LOGIN.password);
          toast({
            title: "Demo data reset",
            description: "Everything is back to the starting point.",
          });
        }}
      />
    </div>
  );
}
