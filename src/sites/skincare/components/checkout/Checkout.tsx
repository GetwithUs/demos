"use client";

import {
  Banknote,
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Info,
  Landmark,
  LoaderCircle,
  Lock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CouponBox, TotalsList } from "@/sites/skincare/components/cart/CartParts";
import UpiQr from "@/sites/skincare/components/checkout/UpiQr";
import CopyCode from "@/sites/skincare/components/CopyCode";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import { Container, buttonClass } from "@/sites/skincare/components/ui";
import { SHIPPING } from "@/sites/skincare/data/catalog";
import type { Address, PaymentMethod } from "@/sites/skincare/data/types";
import {
  BANKS,
  DEMO_CARD,
  DEMO_NOTICE,
  PROCESSING_STEPS,
  STATES,
  UPI_APPS,
  UPI_ID,
} from "@/sites/skincare/content/checkout";
import { checkPincode } from "@/sites/skincare/lib/pincode";
import { codAllowed, computeTotals, formatINR } from "@/sites/skincare/lib/pricing";
import { useDemoStore, useStoreHydrated } from "@/sites/skincare/lib/store";
import { useCart } from "@/sites/skincare/shop/cart";
import { useShopPrefs, type SavedAddress } from "@/sites/skincare/shop/prefs";
import { useShopUI } from "@/sites/skincare/shop/ui";

type Step = "address" | "payment";
type Form = Omit<Address, "email"> & { email: string; label: SavedAddress["label"] };
type Errors = Partial<Record<keyof Form | "stock", string>>;

const EMPTY: Form = {
  name: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  label: "Home",
};

const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function cleanPhone(p: string) {
  return p.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
}

/** Two-step checkout: contact and address, then a simulated payment. */
export default function Checkout() {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const placeOrder = useDemoStore((s) => s.placeOrder);
  const orders = useDemoStore((s) => s.orders);
  const savedAddresses = useShopPrefs((s) => s.addresses);
  const saveAddress = useShopPrefs((s) => s.saveAddress);
  const setWhatsapp = useShopPrefs((s) => s.setWhatsappUpdates);
  const rememberedPin = useShopUI((s) => s.pincode);

  const [step, setStep] = useState<Step>("address");
  // Start from the pincode checked on a product page, with its city and state filled in.
  const [form, setForm] = useState<Form>(() => {
    const r = rememberedPin ? checkPincode(rememberedPin) : undefined;
    return {
      ...EMPTY,
      pincode: rememberedPin,
      city: r?.ok ? (r.city ?? "") : "",
      state: r?.ok ? (r.state ?? "") : "",
    };
  });
  const [choice, setChoice] = useState<string | undefined>();
  const [save, setSave] = useState(true);
  const [whatsapp, setWhatsappLocal] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [bank, setBank] = useState(BANKS[0]);
  const [processing, setProcessing] = useState<{ stage: number } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const cart = useCart(step === "payment" ? method : undefined);
  const { items, lines, totals, coupon } = cart;

  // Saved addresses plus any address used on an earlier order in this browser.
  const known = useMemo(() => {
    const list: SavedAddress[] = [...savedAddresses];
    for (const o of orders.filter((x) => x.source === "visitor")) {
      if (!list.some((a) => a.line1 === o.address.line1 && a.pincode === o.address.pincode)) {
        list.push({ ...o.address, id: `order-${o.id}`, label: "Home" });
      }
    }
    return list.slice(0, 4);
  }, [savedAddresses, orders]);
  const selectedId = choice ?? known[0]?.id ?? "new";
  const selected = known.find((a) => a.id === selectedId);

  const address: Form = selected
    ? {
        ...EMPTY,
        ...selected,
        email: selected.email ?? form.email,
        phone: selected.phone,
        landmark: selected.landmark ?? "",
        line2: selected.line2 ?? "",
      }
    : form;
  const pin = address.pincode.length === 6 ? checkPincode(address.pincode) : undefined;
  const codTotals = computeTotals(items, { coupon, payment: "cod" });
  const codOk = pin?.ok ? codAllowed(codTotals.total, pin.cod) : false;
  const codReason = !pin?.ok
    ? "Enter your pincode to check cash on delivery."
    : !pin.cod
      ? "Cash on delivery is not available for this pincode."
      : `Cash on delivery is available up to ${formatINR(SHIPPING.codMax)}.`;

  const set = (k: keyof Form, v: string) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "pincode" && v.length === 6) {
        const r = checkPincode(v);
        if (r.ok && r.city) {
          next.city = r.city;
          next.state = r.state ?? f.state;
        }
      }
      return next;
    });
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): Errors => {
    const a = address;
    const e: Errors = {};
    if (!PHONE.test(cleanPhone(a.phone))) e.phone = "Enter a 10-digit Indian mobile number.";
    if (a.email && !EMAIL.test(a.email)) e.email = "Enter a valid email, or leave it empty.";
    if (a.name.trim().length < 2) e.name = "Enter the name of the person receiving the order.";
    const r = checkPincode(a.pincode);
    if (!r.ok) e.pincode = r.message;
    if (a.line1.trim().length < 3) e.line1 = "Enter your flat or house number and building.";
    else if (!/\d/.test(a.line1))
      e.line1 = "Add your house or flat number so the courier can find you.";
    if (a.line2 && a.line2.length > 0 && a.line2.trim().length < 3)
      e.line2 = "Add a little more detail.";
    if (!a.city.trim()) e.city = "Enter your city.";
    if (!a.state) e.state = "Choose your state.";
    return e;
  };

  const toPayment = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      if (selected && first !== "phone" && first !== "email") setChoice("new");
      requestAnimationFrame(() => document.getElementById(`co-${first}`)?.focus());
      return;
    }
    setStep("payment");
    if (!codOk && method === "cod") setMethod("upi");
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pay = () => {
    const tooMany = lines.find((l) => l.item.qty > l.variant.stock);
    if (tooMany) {
      setErrors({
        stock: `Only ${tooMany.variant.stock} left of ${tooMany.product.name}. Please update your cart.`,
      });
      return;
    }
    if (method === "cod" && !codOk) return;
    const finalAddress: Address = {
      name: address.name.trim(),
      phone: cleanPhone(address.phone),
      email: address.email.trim() || undefined,
      line1: address.line1.trim(),
      line2: address.line2?.trim() || undefined,
      landmark: address.landmark?.trim() || undefined,
      city: address.city.trim(),
      state: address.state,
      pincode: address.pincode,
    };
    const snapshot = { items, totals };
    setProcessing({ stage: 0 });
    const delays =
      method === "cod" ? [700, 700, 700] : method === "upi" ? [1600, 900, 800] : [1100, 1000, 800];
    let t = 0;
    delays.forEach((d, i) => {
      t += d;
      setTimeout(() => {
        if (i < delays.length - 1) {
          setProcessing({ stage: i + 1 });
          return;
        }
        if (save && !selected) saveAddress({ ...finalAddress, label: form.label });
        setWhatsapp(whatsapp);
        const order = placeOrder({ ...snapshot, address: finalAddress, payment: method });
        router.push(`/skincare/orders/${order.id}?placed=1`);
      }, t);
    });
  };

  if (processing)
    return <Processing method={method} stage={processing.stage} total={totals.total} bank={bank} />;

  if (!hydrated) {
    return (
      <Container className="py-10" aria-busy="true">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] [&>*]:min-w-0">
          <div className="h-[520px] skin-skeleton rounded-3xl" />
          <div className="h-80 skin-skeleton rounded-3xl" />
        </div>
      </Container>
    );
  }

  if (!lines.length) {
    return (
      <Container className="py-20 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-skin-sand">
          <ShoppingBag className="size-7 text-skin-subtle" strokeWidth={1.5} aria-hidden />
        </span>
        <h1 className="mt-4 font-skin-display text-3xl text-skin-ink">Your cart is empty</h1>
        <p className="mt-2 text-skin-subtle">Add a product or two before checking out.</p>
        <Link href="/skincare/shop" className={buttonClass("primary", "md", "mt-6")}>
          Continue shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="pt-6 pb-16">
      <div ref={topRef} className="scroll-mt-4" />
      <Stepper step={step} onAddress={() => setStep("address")} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12 [&>*]:min-w-0">
        <div className="order-2 lg:order-1">
          {step === "address" ? (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                toPayment();
              }}
              className="space-y-6"
            >
              <Card title="Contact" icon={<Smartphone className="size-5" aria-hidden />}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="co-phone"
                    label="Mobile number"
                    error={errors.phone}
                    hint="For delivery updates. We never call for OTPs."
                  >
                    <div className="flex">
                      <span className="grid h-12 place-items-center rounded-l-xl border border-r-0 border-skin-line bg-skin-sand px-3 text-sm text-skin-body">
                        +91
                      </span>
                      <input
                        id="co-phone"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        maxLength={11}
                        value={selected ? address.phone : form.phone}
                        onChange={(e) => {
                          if (selected) setChoice("new");
                          set("phone", e.target.value.replace(/[^\d ]/g, ""));
                        }}
                        className={cn(inputCls, "rounded-l-none")}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby="co-phone-msg"
                        placeholder="98765 43210"
                      />
                    </div>
                  </Field>
                  <Field
                    id="co-email"
                    label="Email (optional)"
                    error={errors.email}
                    hint="For your invoice."
                  >
                    <input
                      id="co-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className={inputCls}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby="co-email-msg"
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>
                <label className="mt-4 flex items-start gap-3 text-sm text-skin-body">
                  <input
                    type="checkbox"
                    checked={whatsapp}
                    onChange={(e) => setWhatsappLocal(e.target.checked)}
                    className="mt-0.5 size-4 accent-skin-accent"
                  />
                  <span>
                    Send me order updates on WhatsApp (confirmation, shipping and delivery). You can
                    stop them any time.
                  </span>
                </label>
              </Card>

              <Card title="Delivery address" icon={<MapPin className="size-5" aria-hidden />}>
                {known.length ? (
                  <fieldset className="mb-5">
                    <legend className="mb-3 text-sm font-medium text-skin-ink">
                      Saved addresses
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {known.map((a) => (
                        <label
                          key={a.id}
                          className={cn(
                            "cursor-pointer rounded-2xl border p-4 text-sm transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
                            selectedId === a.id
                              ? "border-skin-ink ring-1 ring-skin-ink"
                              : "border-skin-line hover:border-skin-ink/40",
                          )}
                        >
                          <input
                            type="radio"
                            name="saved"
                            className="sr-only"
                            checked={selectedId === a.id}
                            onChange={() => setChoice(a.id)}
                          />
                          <span className="flex items-center justify-between">
                            <span className="font-medium text-skin-ink">{a.name}</span>
                            <span className="rounded-full bg-skin-sand px-2 py-0.5 text-[0.7rem] font-medium text-skin-subtle">
                              {a.label}
                            </span>
                          </span>
                          <span className="mt-1 block text-skin-body">
                            {a.line1}
                            {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.pincode}
                          </span>
                          <span className="mt-1 block text-xs text-skin-subtle">+91 {a.phone}</span>
                        </label>
                      ))}
                      <label
                        className={cn(
                          "grid cursor-pointer place-items-center rounded-2xl border border-dashed p-4 text-sm font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
                          selectedId === "new"
                            ? "border-skin-ink text-skin-ink ring-1 ring-skin-ink"
                            : "border-skin-line text-skin-subtle hover:border-skin-ink/40",
                        )}
                      >
                        <input
                          type="radio"
                          name="saved"
                          className="sr-only"
                          checked={selectedId === "new"}
                          onChange={() => setChoice("new")}
                        />
                        + Add a new address
                      </label>
                    </div>
                  </fieldset>
                ) : null}

                {!selected ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id="co-name"
                      label="Full name"
                      error={errors.name}
                      className="sm:col-span-2"
                    >
                      <input
                        id="co-name"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className={inputCls}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby="co-name-msg"
                      />
                    </Field>
                    <Field
                      id="co-pincode"
                      label="Pincode"
                      error={errors.pincode}
                      hint={
                        pin?.ok
                          ? `${pin.city ? `${pin.city}: ` : ""}${pin.message}`
                          : "We fill in your city and state."
                      }
                    >
                      <input
                        id="co-pincode"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        maxLength={6}
                        value={form.pincode}
                        onChange={(e) =>
                          set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        className={inputCls}
                        aria-invalid={Boolean(errors.pincode)}
                        aria-describedby="co-pincode-msg"
                        placeholder="248001"
                      />
                    </Field>
                    <Field id="co-city" label="City" error={errors.city}>
                      <input
                        id="co-city"
                        autoComplete="address-level2"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        className={inputCls}
                        aria-invalid={Boolean(errors.city)}
                        aria-describedby="co-city-msg"
                      />
                    </Field>
                    <Field
                      id="co-line1"
                      label="Flat, house number, building"
                      error={errors.line1}
                      className="sm:col-span-2"
                    >
                      <input
                        id="co-line1"
                        autoComplete="address-line1"
                        value={form.line1}
                        onChange={(e) => set("line1", e.target.value)}
                        className={inputCls}
                        aria-invalid={Boolean(errors.line1)}
                        aria-describedby="co-line1-msg"
                        placeholder="Flat 302, Green Avenue"
                      />
                    </Field>
                    <Field
                      id="co-line2"
                      label="Area, street, sector"
                      error={errors.line2}
                      className="sm:col-span-2"
                    >
                      <input
                        id="co-line2"
                        autoComplete="address-line2"
                        value={form.line2}
                        onChange={(e) => set("line2", e.target.value)}
                        className={inputCls}
                        aria-describedby="co-line2-msg"
                        placeholder="Rajpur Road"
                      />
                    </Field>
                    <Field id="co-landmark" label="Landmark (optional)">
                      <input
                        id="co-landmark"
                        value={form.landmark}
                        onChange={(e) => set("landmark", e.target.value)}
                        className={inputCls}
                        placeholder="Near Clock Tower"
                      />
                    </Field>
                    <Field id="co-state" label="State" error={errors.state}>
                      <div className="relative">
                        <select
                          id="co-state"
                          autoComplete="address-level1"
                          value={form.state}
                          onChange={(e) => set("state", e.target.value)}
                          className={cn(inputCls, "appearance-none pr-10")}
                          aria-invalid={Boolean(errors.state)}
                          aria-describedby="co-state-msg"
                        >
                          <option value="">Choose state</option>
                          {STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-skin-subtle"
                          aria-hidden
                        />
                      </div>
                    </Field>
                    <fieldset className="sm:col-span-2">
                      <legend className="text-sm font-medium text-skin-ink">Save as</legend>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {(["Home", "Work", "Other"] as const).map((l) => (
                          <label
                            key={l}
                            className={cn(
                              "cursor-pointer rounded-full border px-4 py-1.5 text-sm transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
                              form.label === l
                                ? "border-skin-ink bg-skin-ink text-white"
                                : "border-skin-line bg-white text-skin-ink",
                            )}
                          >
                            <input
                              type="radio"
                              name="label"
                              className="sr-only"
                              checked={form.label === l}
                              onChange={() => setForm((f) => ({ ...f, label: l }))}
                            />
                            {l}
                          </label>
                        ))}
                        <label className="ml-auto flex items-center gap-2 text-sm text-skin-body">
                          <input
                            type="checkbox"
                            checked={save}
                            onChange={(e) => setSave(e.target.checked)}
                            className="size-4 accent-skin-accent"
                          />
                          Save for next time
                        </label>
                      </div>
                    </fieldset>
                  </div>
                ) : null}

                {pin?.ok ? (
                  <p className="mt-5 flex items-center gap-2 rounded-xl bg-skin-accent-soft px-4 py-3 text-sm text-skin-ink">
                    <Truck className="size-4 shrink-0 text-skin-accent" aria-hidden />
                    <span>
                      <strong>{pin.message.split(".")[0]}</strong>
                      {pin.cod
                        ? ". Cash on delivery available."
                        : ". Prepaid only for this pincode."}
                    </span>
                  </p>
                ) : null}
              </Card>

              <button type="submit" className={buttonClass("primary", "lg", "w-full")}>
                Continue to payment
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <Card
                title="Deliver to"
                icon={<MapPin className="size-5" aria-hidden />}
                action={
                  <button
                    type="button"
                    onClick={() => setStep("address")}
                    className="text-sm font-medium text-skin-accent underline"
                  >
                    Change
                  </button>
                }
              >
                <p className="text-sm text-skin-ink">
                  <strong>{address.name}</strong>, +91 {cleanPhone(address.phone)}
                </p>
                <p className="mt-1 text-sm text-skin-body">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                  {address.landmark ? `, near ${address.landmark}` : ""}, {address.city},{" "}
                  {address.state} {address.pincode}
                </p>
                {pin?.ok ? (
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-skin-success">
                    <Truck className="size-4" aria-hidden />
                    {pin.message.split(".")[0]}
                  </p>
                ) : null}
              </Card>

              <p
                role="note"
                className="flex items-center gap-3 rounded-2xl border border-skin-saffron/40 bg-skin-saffron-soft px-4 py-3 text-sm font-medium text-skin-saffron-ink"
              >
                <Info className="size-5 shrink-0" aria-hidden />
                {DEMO_NOTICE} No card or bank details are collected on this demo.
              </p>

              <fieldset className="space-y-3">
                <legend className="mb-1 font-skin-display text-2xl text-skin-ink">
                  Payment method
                </legend>
                <PayOption
                  value="upi"
                  method={method}
                  onSelect={setMethod}
                  icon={<Smartphone className="size-5" aria-hidden />}
                  title="UPI"
                  note="Google Pay, PhonePe, Paytm or any UPI app"
                  tag={`Save ${formatINR(computeTotals(items, { coupon, payment: "upi" }).prepaidDiscount)}`}
                >
                  <div className="grid items-center gap-5 sm:grid-cols-[auto_1fr]">
                    <div className="mx-auto rounded-2xl bg-white p-3 ring-1 ring-skin-line">
                      <UpiQr seed={`${UPI_ID}:${totals.total}`} />
                      <p className="mt-1 text-center text-[0.7rem] text-skin-subtle">
                        Demo QR, cannot be paid
                      </p>
                    </div>
                    <div className="text-sm text-skin-body">
                      <p className="font-medium text-skin-ink">Scan with any UPI app, or pay to</p>
                      <CopyCode code={UPI_ID} className="mt-2 px-3 py-1.5 text-sm normal-case" />
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label="UPI apps">
                        {UPI_APPS.map((a) => (
                          <li
                            key={a.name}
                            className="flex items-center gap-1.5 rounded-full border border-skin-line bg-white py-1 pr-3 pl-1 text-xs text-skin-ink"
                          >
                            <span
                              className="grid size-6 place-items-center rounded-full text-[0.62rem] font-bold text-white"
                              style={{ background: a.colour }}
                              aria-hidden
                            >
                              {a.short}
                            </span>
                            {a.name}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs text-skin-subtle">
                        Tap Pay and we will simulate the approval in your UPI app.
                      </p>
                    </div>
                  </div>
                </PayOption>
                <PayOption
                  value="card"
                  method={method}
                  onSelect={setMethod}
                  icon={<CreditCard className="size-5" aria-hidden />}
                  title="Credit or debit card"
                  note="Visa, Mastercard, RuPay"
                  tag={`Save ${formatINR(computeTotals(items, { coupon, payment: "card" }).prepaidDiscount)}`}
                >
                  <div className="max-w-sm rounded-2xl bg-gradient-to-br from-skin-forest to-[#3f6f61] p-5 text-white shadow-lg">
                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded bg-white/15 px-2 py-0.5 font-semibold tracking-wider">
                        TEST CARD
                      </span>
                      <span className="font-bold tracking-widest italic">{DEMO_CARD.network}</span>
                    </div>
                    <p className="mt-6 font-mono text-lg tracking-[0.18em]">{DEMO_CARD.number}</p>
                    <div className="mt-4 flex justify-between text-xs">
                      <span>
                        <span className="block text-white/60">Name</span>
                        {DEMO_CARD.name}
                      </span>
                      <span>
                        <span className="block text-white/60">Expiry</span>
                        {DEMO_CARD.expiry}
                      </span>
                      <span>
                        <span className="block text-white/60">CVV</span>
                        •••
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 grid max-w-sm grid-cols-2 gap-3">
                    <label className="col-span-2 text-xs text-skin-subtle">
                      Card number
                      <input
                        readOnly
                        value={DEMO_CARD.number}
                        className={cn(inputCls, "mt-1 h-10 bg-skin-sand/60 font-mono")}
                      />
                    </label>
                    <label className="text-xs text-skin-subtle">
                      Expiry
                      <input
                        readOnly
                        value={DEMO_CARD.expiry}
                        className={cn(inputCls, "mt-1 h-10 bg-skin-sand/60 font-mono")}
                      />
                    </label>
                    <label className="text-xs text-skin-subtle">
                      CVV
                      <input
                        readOnly
                        type="password"
                        value={DEMO_CARD.cvv}
                        className={cn(inputCls, "mt-1 h-10 bg-skin-sand/60 font-mono")}
                      />
                    </label>
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-xs text-skin-subtle">
                    <Lock className="size-3.5" aria-hidden />
                    Test card filled in for you and locked, so real card details are never typed
                    into a demo.
                  </p>
                </PayOption>
                <PayOption
                  value="netbanking"
                  method={method}
                  onSelect={setMethod}
                  icon={<Landmark className="size-5" aria-hidden />}
                  title="Net banking"
                  note="All major Indian banks"
                  tag={`Save ${formatINR(computeTotals(items, { coupon, payment: "netbanking" }).prepaidDiscount)}`}
                >
                  <fieldset>
                    <legend className="mb-2 text-sm font-medium text-skin-ink">
                      Choose your bank
                    </legend>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {BANKS.map((b) => (
                        <label
                          key={b}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs leading-snug transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-skin-accent",
                            bank === b
                              ? "border-skin-ink bg-white ring-1 ring-skin-ink"
                              : "border-skin-line bg-white hover:border-skin-ink/40",
                          )}
                        >
                          <input
                            type="radio"
                            name="bank"
                            className="sr-only"
                            checked={bank === b}
                            onChange={() => setBank(b)}
                          />
                          <span
                            className="grid size-7 shrink-0 place-items-center rounded-full bg-skin-sand text-[0.62rem] font-bold text-skin-ink"
                            aria-hidden
                          >
                            {b
                              .split(" ")
                              .filter((w) => w !== "of")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 3)}
                          </span>
                          {b}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </PayOption>
                <PayOption
                  value="cod"
                  method={method}
                  onSelect={setMethod}
                  icon={<Banknote className="size-5" aria-hidden />}
                  title="Cash on delivery"
                  note={
                    codOk
                      ? `+${formatINR(SHIPPING.codFee)} cash handling fee. No prepaid discount.`
                      : codReason
                  }
                  disabled={!codOk}
                >
                  <p className="text-sm text-skin-body">
                    Pay {formatINR(codTotals.total)} in cash or by UPI to the delivery partner. We
                    will ask you to confirm the order on WhatsApp.
                  </p>
                </PayOption>
              </fieldset>

              {errors.stock ? (
                <p
                  role="alert"
                  className="rounded-xl bg-skin-rose-soft px-4 py-3 text-sm text-skin-rose-ink"
                >
                  {errors.stock}{" "}
                  <Link href="/skincare/cart" className="font-medium underline">
                    Update cart
                  </Link>
                </p>
              ) : null}

              <div className="sticky bottom-0 -mx-4 border-t border-skin-line bg-skin-bg/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
                <button
                  type="button"
                  onClick={pay}
                  disabled={method === "cod" && !codOk}
                  className={buttonClass("primary", "lg", "w-full")}
                >
                  <Lock className="size-4" aria-hidden />
                  {method === "cod"
                    ? `Place order, pay ${formatINR(totals.total)} on delivery`
                    : `Pay ${formatINR(totals.total)}`}
                </button>
                <p className="mt-2 text-center text-xs text-skin-subtle">{DEMO_NOTICE}</p>
              </div>
            </div>
          )}
        </div>

        <aside
          className="order-1 lg:sticky lg:top-6 lg:order-2 lg:self-start"
          aria-label="Order summary"
        >
          <details className="group rounded-3xl bg-white ring-1 ring-skin-line lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2 font-medium text-skin-ink">
                <ShoppingBag className="size-4" aria-hidden />
                <span className="group-open:hidden">Show order summary</span>
                <span className="hidden group-open:inline">Hide order summary</span>
                <ChevronDown className="size-4 transition group-open:rotate-180" aria-hidden />
              </span>
              <span className="font-semibold text-skin-ink">{formatINR(totals.total)}</span>
            </summary>
            <div className="border-t border-skin-line px-5 pt-4 pb-5">
              <Summary cart={cart} step={step} />
            </div>
          </details>
          <div className="hidden rounded-3xl bg-white p-6 ring-1 ring-skin-line lg:block">
            <h2 className="font-skin-display text-2xl text-skin-ink">Order summary</h2>
            <div className="mt-4">
              <Summary cart={cart} step={step} />
            </div>
          </div>
          <ul className="mt-4 hidden gap-2 text-xs text-skin-subtle lg:grid">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-skin-accent" aria-hidden /> 100% secure, encrypted
              checkout
            </li>
            <li className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-skin-accent" aria-hidden /> Genuine products,
              shipped from our own warehouse
            </li>
          </ul>
        </aside>
      </div>
    </Container>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-skin-line bg-white px-3.5 text-[0.95rem] text-skin-ink placeholder:text-skin-subtle/70 focus:border-skin-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-skin-accent/25 aria-[invalid=true]:border-skin-danger";

function Field({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-skin-ink">
        {label}
      </label>
      {children}
      <p
        id={`${id}-msg`}
        className={cn("mt-1.5 text-xs", error ? "text-skin-danger" : "text-skin-subtle")}
        role={error ? "alert" : undefined}
      >
        {error ?? hint ?? ""}
      </p>
    </div>
  );
}

function Card({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-5 ring-1 ring-skin-line sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-skin-display text-2xl text-skin-ink">
          <span className="text-skin-accent">{icon}</span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function PayOption({
  value,
  method,
  onSelect,
  icon,
  title,
  note,
  tag,
  disabled,
  children,
}: {
  value: PaymentMethod;
  method: PaymentMethod;
  onSelect: (m: PaymentMethod) => void;
  icon: ReactNode;
  title: string;
  note: string;
  tag?: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  const active = method === value;
  const id = useId();
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-white transition",
        active ? "border-skin-ink ring-1 ring-skin-ink" : "border-skin-line",
        disabled && "opacity-60",
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-center gap-4 p-4 sm:p-5",
          disabled && "cursor-not-allowed",
        )}
      >
        <input
          id={id}
          type="radio"
          name="payment"
          value={value}
          checked={active}
          disabled={disabled}
          onChange={() => onSelect(value)}
          className="size-4 accent-skin-accent"
        />
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-skin-sand text-skin-ink">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-skin-ink">{title}</span>
          <span className="block text-xs text-skin-subtle">{note}</span>
        </span>
        {tag && !disabled ? (
          <span className="shrink-0 rounded-full bg-skin-success/10 px-2.5 py-1 text-xs font-semibold text-skin-success">
            {tag}
          </span>
        ) : null}
      </label>
      {active && !disabled ? (
        <div className="animate-skin-fade-in border-t border-skin-line bg-skin-bg/60 p-4 sm:p-5">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function Stepper({ step, onAddress }: { step: Step; onAddress: () => void }) {
  const steps = [
    { label: "Cart", done: true, href: "/skincare/cart" },
    { label: "Address", done: step === "payment", current: step === "address" },
    { label: "Payment", done: false, current: step === "payment" },
  ];
  return (
    <ol
      className="flex items-center justify-center gap-2 text-sm sm:gap-3"
      aria-label="Checkout steps"
    >
      {steps.map((s, i) => (
        <li key={s.label} className="flex items-center gap-2 sm:gap-3">
          {i > 0 ? <span className="h-px w-6 bg-skin-line sm:w-12" aria-hidden /> : null}
          {s.href ? (
            <Link
              href={s.href}
              className="flex items-center gap-2 text-skin-subtle hover:text-skin-ink"
            >
              <Dot done />
              {s.label}
            </Link>
          ) : s.label === "Address" && s.done ? (
            <button
              type="button"
              onClick={onAddress}
              className="flex items-center gap-2 text-skin-subtle hover:text-skin-ink"
            >
              <Dot done />
              {s.label}
            </button>
          ) : (
            <span
              className={cn(
                "flex items-center gap-2",
                s.current ? "font-medium text-skin-ink" : "text-skin-subtle",
              )}
              aria-current={s.current ? "step" : undefined}
            >
              <Dot current={s.current} n={i + 1} />
              {s.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function Dot({ done, current, n }: { done?: boolean; current?: boolean; n?: number }) {
  return (
    <span
      className={cn(
        "grid size-6 place-items-center rounded-full text-xs font-semibold",
        done
          ? "bg-skin-accent text-white"
          : current
            ? "bg-skin-ink text-white"
            : "bg-skin-sand text-skin-subtle",
      )}
      aria-hidden
    >
      {done ? <Check className="size-3.5" strokeWidth={3} /> : n}
    </span>
  );
}

function Summary({ cart, step }: { cart: ReturnType<typeof useCart>; step: Step }) {
  return (
    <div>
      <ul className="space-y-3">
        {cart.lines.map((l) => (
          <li key={`${l.item.slug}-${l.item.variantId}`} className="flex items-center gap-3">
            <span
              className="relative w-12 shrink-0 rounded-lg px-1 pt-1"
              style={{ background: l.product.visual.tint }}
            >
              <ProductVisual spec={l.product.visual} name={l.product.name} />
              <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-skin-ink text-[0.65rem] font-semibold text-white">
                {l.item.qty}
              </span>
            </span>
            <span className="min-w-0 flex-1 text-sm">
              <span className="block truncate font-medium text-skin-ink">{l.product.name}</span>
              <span className="text-xs text-skin-subtle">{l.variant.size}</span>
            </span>
            <span className="text-sm font-medium text-skin-ink tabular-nums">
              {formatINR(l.item.price * l.item.qty)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <CouponBox cart={cart} compact />
      </div>
      <TotalsList totals={cart.totals} className="mt-5" />
      {step === "address" ? (
        <p className="mt-3 text-center text-xs text-skin-subtle">
          Pay online on the next step for an extra {SHIPPING.prepaidPercent}% off.
        </p>
      ) : null}
    </div>
  );
}

function Processing({
  method,
  stage,
  total,
  bank,
}: {
  method: PaymentMethod;
  stage: number;
  total: number;
  bank: string;
}) {
  const steps = PROCESSING_STEPS[method];
  return (
    <Container className="grid min-h-[70vh] place-items-center py-16">
      <div
        className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-[0_30px_80px_-40px_rgba(31,36,32,0.5)] ring-1 ring-skin-line"
        role="status"
        aria-live="polite"
      >
        <LoaderCircle className="mx-auto size-12 animate-skin-spin text-skin-accent" aria-hidden />
        <p className="mt-5 font-skin-display text-2xl text-skin-ink">
          {method === "cod" ? "Placing your order" : `Processing ${formatINR(total)}`}
        </p>
        <p className="mt-1 text-sm text-skin-subtle">
          {method === "netbanking"
            ? bank
            : method === "upi"
              ? UPI_ID
              : method === "card"
                ? DEMO_CARD.number.slice(-4).padStart(9, "•")
                : "Cash on delivery"}
        </p>
        <ol className="mt-7 space-y-3 text-left">
          {steps.map((s, i) => (
            <li
              key={s}
              className={cn(
                "flex items-center gap-3 text-sm transition",
                i <= stage ? "text-skin-ink" : "text-skin-subtle/60",
              )}
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full",
                  i < stage
                    ? "bg-skin-success text-white"
                    : i === stage
                      ? "bg-skin-accent-soft text-skin-accent"
                      : "bg-skin-sand",
                )}
              >
                {i < stage ? (
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                ) : i === stage ? (
                  <LoaderCircle className="size-3.5 animate-skin-spin" aria-hidden />
                ) : null}
              </span>
              {s}
            </li>
          ))}
        </ol>
        <p className="mt-7 rounded-xl bg-skin-saffron-soft px-3 py-2 text-xs font-medium text-skin-saffron-ink">
          {DEMO_NOTICE}
        </p>
        <p className="mt-3 text-xs text-skin-subtle">Please do not close or refresh this page.</p>
      </div>
    </Container>
  );
}
