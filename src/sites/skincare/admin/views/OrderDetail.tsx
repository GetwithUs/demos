"use client";

import {
  Ban,
  Check,
  CircleCheck,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  ReceiptIndianRupee,
  SearchX,
  Truck,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { CATEGORIES } from "@/sites/skincare/data/catalog";
import type { Order, OrderStatus } from "@/sites/skincare/data/types";
import { checkPincode } from "@/sites/skincare/lib/pincode";
import { formatINR, discountPercent } from "@/sites/skincare/lib/pricing";
import { STATUS_FLOW } from "@/sites/skincare/lib/seed";
import { useDemoStore, useProducts } from "@/sites/skincare/lib/store";
import { ConfirmDialog } from "@/sites/skincare/admin/components/Overlay";
import ProductThumb from "@/sites/skincare/admin/components/ProductThumb";
import ShipDialog from "@/sites/skincare/admin/components/ShipDialog";
import { useToast } from "@/sites/skincare/admin/components/Toast";
import {
  Button,
  ButtonLink,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  PageSkeleton,
  PaymentBadge,
  StatusBadge,
  VisitorBadge,
} from "@/sites/skincare/admin/components/ui";
import WhatsAppPreview from "@/sites/skincare/admin/components/WhatsAppPreview";
import {
  formatDateTimeYear,
  formatDateTime,
  PAYMENT_LABEL,
  paymentStatusLabel,
  plural,
  STATUS_LABEL,
} from "@/sites/skincare/admin/lib/format";
import { useAdminReady, useNow, useOrders } from "@/sites/skincare/admin/lib/hooks";
import { customerKey } from "@/sites/skincare/admin/lib/metrics";
import { newAwb, packOrder, shipOrder } from "@/sites/skincare/admin/lib/order-actions";
import { SHIPPING } from "@/sites/skincare/data/catalog";

export default function OrderDetail({ id }: { id: string }) {
  const ready = useAdminReady();
  const now = useNow();
  const orders = useOrders();
  if (!ready || !now) return <PageSkeleton rows={2} />;
  const order = orders.find((o) => o.id === decodeURIComponent(id));
  if (!order) {
    return (
      <Card>
        <EmptyState
          icon={<SearchX />}
          title="Order not found"
          description={`There is no order ${decodeURIComponent(id)} in this store. It may have been removed when the demo was reset.`}
          action={<ButtonLink href="/skincare/admin/orders">Back to orders</ButtonLink>}
        />
      </Card>
    );
  }
  const customerOrders = orders.filter(
    (o) => customerKey(o.address) === customerKey(order.address),
  ).length;
  return <OrderView order={order} now={now} customerOrders={customerOrders} />;
}

function Stepper({ order }: { order: Order }) {
  const index = STATUS_FLOW.indexOf(order.status);
  const at = (s: OrderStatus) => order.history.findLast((h) => h.status === s)?.at;
  return (
    <ol className="grid grid-cols-6 gap-1" aria-label="Order progress">
      {STATUS_FLOW.map((s, i) => {
        const done = i <= index;
        const current = i === index;
        const time = at(s);
        return (
          <li key={s} className="min-w-0" aria-current={current ? "step" : undefined}>
            <div className={cn("h-1.5 rounded-full", done ? "bg-skin-accent" : "bg-stone-200")} />
            <p
              className={cn(
                "mt-2 truncate text-xs",
                current
                  ? "font-semibold text-stone-900"
                  : done
                    ? "text-stone-700"
                    : "text-stone-500",
                !current && "max-sm:sr-only",
              )}
            >
              {STATUS_LABEL[s]}
              <span className="sr-only">
                {done ? (current ? ", current step" : ", done") : ", to do"}
              </span>
            </p>
            {time ? (
              <p className={cn("hidden truncate text-[0.6875rem] text-stone-500 sm:block")}>
                {formatDateTime(time)}
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function OrderView({
  order,
  now,
  customerOrders,
}: {
  order: Order;
  now: number;
  customerOrders: number;
}) {
  const products = useProducts({ includeInactive: true });
  const setOrderStatus = useDemoStore((s) => s.setOrderStatus);
  const toast = useToast();
  const [shipOpen, setShipOpen] = useState(false);
  const [shipAwb, setShipAwb] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [waOpen, setWaOpen] = useState(false);

  const t = order.totals;
  const prepaid = order.payment.method !== "cod";
  const closed = order.status === "cancelled" || order.status === "returned";
  const canCancel = ["placed", "confirmed", "packed"].includes(order.status);
  const zone = checkPincode(order.address.pincode, new Date(order.createdAt));

  const step = (status: OrderStatus, title: string, note?: string) => {
    setOrderStatus(order.id, status, note);
    toast({ title, description: "Use Notify customer to preview the WhatsApp update." });
  };

  const next: { label: string; icon: typeof Check; run: () => void } | null =
    order.status === "placed"
      ? {
          label: "Confirm order",
          icon: Check,
          run: () => step("confirmed", `${order.id} confirmed`),
        }
      : order.status === "confirmed"
        ? {
            label: "Mark as packed",
            icon: PackageCheck,
            run: () => {
              packOrder(order.id);
              toast({
                title: `${order.id} packed`,
                description: "Ready to hand over to the courier.",
              });
            },
          }
        : order.status === "packed"
          ? {
              label: "Ship order",
              icon: Truck,
              run: () => {
                setShipAwb(newAwb());
                setShipOpen(true);
              },
            }
          : order.status === "shipped"
            ? {
                label: "Mark out for delivery",
                icon: Truck,
                run: () => step("out-for-delivery", `${order.id} is out for delivery`),
              }
            : order.status === "out-for-delivery"
              ? {
                  label: "Mark as delivered",
                  icon: CircleCheck,
                  run: () =>
                    step(
                      "delivered",
                      `${order.id} delivered`,
                      prepaid ? undefined : `Cash ${formatINR(t.total)} collected by courier`,
                    ),
                }
              : null;

  const nextHint: Record<OrderStatus, string> = {
    placed: "Check the address and phone, then confirm so the customer knows it is coming.",
    confirmed: "Pick the items, pack them with the invoice and mark the order as packed.",
    packed: "Choose a courier and add the AWB number to hand the parcel over.",
    shipped: "The parcel is with the courier. Update it when it is out for delivery.",
    "out-for-delivery": prepaid
      ? "The courier is delivering today."
      : `The courier collects ${formatINR(t.total)} in cash on delivery.`,
    delivered: prepaid
      ? "Delivered and paid. You can refund it if the customer returns it."
      : "Delivered and cash collected.",
    cancelled: prepaid
      ? "Cancelled. The payment has been refunded."
      : "Cancelled. No payment was taken.",
    returned: prepaid
      ? "Returned and refunded to the customer."
      : "Returned. Settle the refund with the customer directly.",
  };

  return (
    <div>
      <PageHeader
        back={{ href: "/skincare/admin/orders", label: "Orders" }}
        title={order.id}
        meta={
          <span className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={order.status} />
            <PaymentBadge order={order} />
            <VisitorBadge order={order} />
          </span>
        }
        description={`Placed ${formatDateTimeYear(order.createdAt)} · ${order.source === "visitor" ? "ordered in the shop from this browser" : "sample order"}`}
        actions={
          <>
            <Button onClick={() => setWaOpen(true)}>
              <MessageCircle aria-hidden className="size-4" />
              Notify customer
            </Button>
            <ButtonLink href={`/skincare/admin/orders/${order.id}/invoice`}>
              <FileText aria-hidden className="size-4" />
              Invoice
            </ButtonLink>
          </>
        }
      />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4 sm:space-y-6">
          <Card className="p-5">
            {closed ? (
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full",
                    order.status === "returned"
                      ? "bg-rose-50 text-rose-700"
                      : "bg-stone-100 text-stone-600",
                  )}
                >
                  {order.status === "returned" ? (
                    <Undo2 className="size-4.5" />
                  ) : (
                    <Ban className="size-4.5" />
                  )}
                </span>
                <div>
                  <h2 className="font-semibold text-stone-900">
                    Order {STATUS_LABEL[order.status].toLowerCase()}
                  </h2>
                  <p className="mt-0.5 text-sm text-stone-600">{nextHint[order.status]}</p>
                </div>
              </div>
            ) : (
              <>
                <Stepper order={order} />
                <div className="mt-5 flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-stone-900">
                      {next ? "Next step" : "All done"}
                    </h2>
                    <p className="mt-0.5 text-sm text-stone-600">{nextHint[order.status]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {canCancel ? (
                      <Button variant="danger-soft" onClick={() => setCancelOpen(true)}>
                        Cancel order
                      </Button>
                    ) : null}
                    {order.status === "shipped" ? (
                      <Button
                        onClick={() =>
                          step(
                            "delivered",
                            `${order.id} delivered`,
                            prepaid ? undefined : `Cash ${formatINR(t.total)} collected by courier`,
                          )
                        }
                      >
                        Mark as delivered
                      </Button>
                    ) : null}
                    {order.status === "delivered" && prepaid && order.payment.status === "paid" ? (
                      <Button variant="danger-soft" onClick={() => setRefundOpen(true)}>
                        <Undo2 aria-hidden className="size-4" />
                        Refund and mark returned
                      </Button>
                    ) : null}
                    {next ? (
                      <Button variant="primary" onClick={next.run}>
                        <next.icon aria-hidden className="size-4" />
                        {next.label}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Items"
              description={`${plural(t.itemCount, "item")} in this order`}
            />
            <ul className="divide-y divide-stone-100 border-t border-stone-100">
              {order.items.map((item) => {
                const product = products.find((p) => p.slug === item.slug);
                const off = discountPercent(item.price, item.mrp);
                return (
                  <li
                    key={`${item.slug}-${item.variantId}`}
                    className="flex items-center gap-3.5 px-5 py-3.5"
                  >
                    <ProductThumb spec={product?.visual} name={item.name} size="md" />
                    <div className="min-w-0 flex-1">
                      {product ? (
                        <Link
                          href={`/skincare/admin/products/${item.slug}`}
                          className="text-sm font-medium text-stone-900 hover:underline"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-stone-900">{item.name}</p>
                      )}
                      <p className="text-xs text-stone-500">
                        {item.size}
                        {product ? ` · ${CATEGORIES[product.category].label}` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-600 tabular-nums">
                        {formatINR(item.price)} x {item.qty}
                        {off ? (
                          <>
                            {" "}
                            <span className="text-stone-500 line-through">
                              {formatINR(item.mrp)}
                            </span>{" "}
                            <span className="text-emerald-800">{off}% off</span>
                          </>
                        ) : null}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-stone-900 tabular-nums">
                      {formatINR(item.price * item.qty)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Payment summary" description="Prices include GST" />
            <dl className="space-y-2 border-t border-stone-100 px-5 py-4 text-sm tabular-nums">
              <Row
                label={`Subtotal (${plural(t.itemCount, "item")})`}
                value={formatINR(t.subtotal)}
              />
              {t.productSavings > 0 ? (
                <Row
                  label="Saved against MRP"
                  value={`${formatINR(t.mrpTotal)} MRP, ${formatINR(t.productSavings)} off`}
                  muted
                />
              ) : null}
              {t.couponDiscount > 0 ? (
                <Row
                  label={`Coupon ${t.couponCode ?? ""}`}
                  value={`-${formatINR(t.couponDiscount)}`}
                  positive
                />
              ) : null}
              {t.prepaidDiscount > 0 ? (
                <Row
                  label={`Prepaid discount (${SHIPPING.prepaidPercent}%)`}
                  value={`-${formatINR(t.prepaidDiscount)}`}
                  positive
                />
              ) : null}
              <Row label="Delivery" value={t.shipping ? formatINR(t.shipping) : "Free"} />
              {t.codFee > 0 ? (
                <Row label="Cash on delivery fee" value={formatINR(t.codFee)} />
              ) : null}
              <div className="flex items-baseline justify-between border-t border-stone-200 pt-3">
                <dt className="font-semibold text-stone-900">Total</dt>
                <dd className="text-base font-semibold text-stone-900">{formatINR(t.total)}</dd>
              </div>
              <Row label="GST included (18%)" value={formatINR(t.gstIncluded)} muted />
            </dl>
            <div className="flex items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/70 px-5 py-3 text-sm">
              <span className="text-stone-700">
                {PAYMENT_LABEL[order.payment.method]}: {paymentStatusLabel(order).toLowerCase()}
              </span>
              <span className="font-medium text-stone-900 tabular-nums">
                {order.payment.status === "paid"
                  ? `${formatINR(t.total)} received`
                  : order.payment.status === "refunded"
                    ? `${formatINR(t.total)} refunded`
                    : closed
                      ? "Nothing to collect"
                      : `${formatINR(t.total)} on delivery`}
              </span>
            </div>
          </Card>

          <Card>
            <CardHeader title="Timeline" description="Newest first" />
            <ol className="border-t border-stone-100 px-5 py-4">
              {[...order.history].reverse().map((h, i, list) => (
                <li key={`${h.status}-${h.at}-${i}`} className="relative flex gap-3 pb-5 last:pb-0">
                  {i < list.length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute top-5 left-[7px] h-full w-px bg-stone-200"
                    />
                  ) : null}
                  <span
                    aria-hidden
                    className={cn(
                      "relative mt-1 size-[15px] shrink-0 rounded-full border-2 border-white ring-1",
                      i === 0 ? "bg-skin-accent ring-skin-accent" : "bg-stone-300 ring-stone-300",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-stone-900">
                      <span className="font-medium">{STATUS_LABEL[h.status]}</span>
                      {h.status === "placed" ? ` by ${order.address.name}` : ""}
                    </p>
                    {h.note ? <p className="text-[0.8125rem] text-stone-600">{h.note}</p> : null}
                    <p className="text-xs text-stone-500">{formatDateTimeYear(h.at)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader
              title="Customer"
              action={
                <Link
                  href={`/skincare/admin/customers?c=${encodeURIComponent(customerKey(order.address))}`}
                  className="text-[0.8125rem] font-medium text-skin-accent hover:underline"
                >
                  View
                </Link>
              }
            />
            <div className="space-y-4 border-t border-stone-100 px-5 py-4 text-sm">
              <div>
                <p className="font-medium text-stone-900">{order.address.name}</p>
                <p className="text-[0.8125rem] text-stone-600">
                  {customerOrders > 1
                    ? `${plural(customerOrders, "order")}, returning customer`
                    : "First order"}
                </p>
              </div>
              <div className="space-y-1.5 text-stone-700">
                <p className="flex items-center gap-2">
                  <Phone aria-hidden className="size-4 text-stone-500" />
                  <span className="tabular-nums">{order.address.phone}</span>
                </p>
                {order.address.email ? (
                  <p className="flex items-center gap-2 break-all">
                    <Mail aria-hidden className="size-4 shrink-0 text-stone-500" />
                    {order.address.email}
                  </p>
                ) : null}
              </div>
              <div>
                <h3 className="mb-1 text-xs font-semibold tracking-wide text-stone-500 uppercase">
                  Shipping address
                </h3>
                <address className="flex gap-2 text-stone-700 not-italic">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-stone-500" />
                  <span>
                    {order.address.line1}
                    {order.address.line2 ? (
                      <>
                        <br />
                        {order.address.line2}
                      </>
                    ) : null}
                    {order.address.landmark ? (
                      <>
                        <br />
                        Near {order.address.landmark}
                      </>
                    ) : null}
                    <br />
                    {order.address.city}, {order.address.state} {order.address.pincode}
                  </span>
                </address>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Payment" />
            <dl className="space-y-2 border-t border-stone-100 px-5 py-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-stone-600">Method</dt>
                <dd className="flex items-center gap-1.5 text-stone-900">
                  <CreditCard aria-hidden className="size-4 text-stone-500" />
                  {PAYMENT_LABEL[order.payment.method]}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-600">Status</dt>
                <dd>
                  <PaymentBadge order={order} />
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-600">Reference</dt>
                <dd className="truncate font-mono text-xs text-stone-800">
                  {order.payment.ref ?? "Collected in cash"}
                </dd>
              </div>
            </dl>
            <p className="border-t border-stone-100 px-5 py-3 text-xs text-stone-500">
              {prepaid
                ? "Demo payment reference. No real money moved."
                : "Cash on delivery: the courier remits cash to you after delivery."}
            </p>
          </Card>

          <Card>
            <CardHeader title="Shipping" />
            <dl className="space-y-2 border-t border-stone-100 px-5 py-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-stone-600">Courier</dt>
                <dd className="text-stone-900">{order.courier ?? "Not shipped yet"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-600">AWB</dt>
                <dd className="font-mono text-xs text-stone-800">
                  {order.awb ?? "Added when shipped"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-stone-600">Ships from</dt>
                <dd className="text-stone-900">Dehradun</dd>
              </div>
              {zone.ok ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-stone-600">Delivery time</dt>
                  <dd className="text-stone-900">
                    {zone.minDays === zone.maxDays
                      ? `${zone.maxDays} day`
                      : `${zone.minDays} to ${zone.maxDays} days`}
                  </dd>
                </div>
              ) : null}
            </dl>
          </Card>

          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"
              >
                <ReceiptIndianRupee className="size-4.5" />
              </span>
              <div className="min-w-0 text-sm">
                <p className="font-medium text-stone-900">GST invoice</p>
                <p className="mt-0.5 text-stone-600">
                  Print it or save as PDF to put in the parcel.
                </p>
                <Link
                  href={`/skincare/admin/orders/${order.id}/invoice`}
                  className="mt-2 inline-block font-medium text-skin-accent hover:underline"
                >
                  Open invoice
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ShipDialog
        open={shipOpen}
        onClose={() => setShipOpen(false)}
        count={1}
        initialAwb={shipAwb}
        onShip={(courier, awb) => {
          shipOrder(order.id, courier, awb ?? newAwb());
          setShipOpen(false);
          toast({
            title: `${order.id} handed to ${courier}`,
            description: `AWB ${awb}. Let the customer know on WhatsApp.`,
          });
        }}
      />
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        danger
        title={`Cancel ${order.id}?`}
        confirmLabel="Cancel order"
        description={
          prepaid
            ? `${formatINR(t.total)} will be refunded to the customer's ${PAYMENT_LABEL[order.payment.method]} account (demo, no money moves).`
            : "No payment was taken, so there is nothing to refund."
        }
        onConfirm={() => {
          setOrderStatus(order.id, "cancelled", "Cancelled by the store");
          toast({
            title: `${order.id} cancelled`,
            description: prepaid ? `Refund of ${formatINR(t.total)} started.` : undefined,
          });
        }}
      />
      <ConfirmDialog
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        danger
        title={`Refund ${order.id}?`}
        confirmLabel={`Refund ${formatINR(t.total)}`}
        description={`Marks the order as returned and refunds ${formatINR(t.total)} to the customer's ${PAYMENT_LABEL[order.payment.method]} account (demo, no money moves).`}
        onConfirm={() => {
          setOrderStatus(
            order.id,
            "returned",
            `Refund of ${formatINR(t.total)} sent to ${PAYMENT_LABEL[order.payment.method]}`,
          );
          toast({ title: `${order.id} refunded`, description: "The order is marked as returned." });
        }}
      />
      <WhatsAppPreview order={order} open={waOpen} onClose={() => setWaOpen(false)} now={now} />
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  positive,
}: {
  label: string;
  value: string;
  muted?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={cn(muted ? "text-stone-500" : "text-stone-600")}>{label}</dt>
      <dd
        className={cn(
          "text-right",
          muted ? "text-stone-500" : positive ? "text-emerald-800" : "text-stone-900",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
