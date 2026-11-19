"use client";

import { ArrowLeft, Printer, SearchX } from "lucide-react";
import Link from "next/link";
import { BRAND, SHIPPING } from "@/sites/skincare/data/catalog";
import type { Order } from "@/sites/skincare/data/types";
import { useProducts } from "@/sites/skincare/lib/store";
import {
  Button,
  ButtonLink,
  Card,
  EmptyState,
  PageSkeleton,
} from "@/sites/skincare/admin/components/ui";
import { formatDate, formatINRPaise, PAYMENT_LABEL } from "@/sites/skincare/admin/lib/format";
import {
  amountInWords,
  gstSplit,
  hsnFor,
  invoiceNumber,
  STATE_CODES,
  STORE_DETAILS,
} from "@/sites/skincare/admin/lib/gst";
import { useAdminReady, useOrders } from "@/sites/skincare/admin/lib/hooks";

export default function Invoice({ id }: { id: string }) {
  const ready = useAdminReady();
  const orders = useOrders();
  if (!ready) return <PageSkeleton rows={1} />;
  const order = orders.find((o) => o.id === decodeURIComponent(id));
  if (!order) {
    return (
      <Card>
        <EmptyState
          icon={<SearchX />}
          title="Order not found"
          description="This order is not in the store any more."
          action={<ButtonLink href="/skincare/admin/orders">Back to orders</ButtonLink>}
        />
      </Card>
    );
  }
  return <InvoiceSheet order={order} />;
}

function InvoiceSheet({ order }: { order: Order }) {
  const products = useProducts({ includeInactive: true });
  const t = order.totals;
  const gst = gstSplit(order);
  const placeCode = STATE_CODES[order.address.state] ?? "";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href={`/skincare/admin/orders/${order.id}`}
          className="inline-flex items-center gap-1 rounded text-[0.8125rem] font-medium text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Back to {order.id}
        </Link>
        <Button variant="primary" onClick={() => window.print()}>
          <Printer aria-hidden className="size-4" />
          Print or save as PDF
        </Button>
      </div>

      <article
        aria-label={`Tax invoice for order ${order.id}`}
        className="mx-auto max-w-[820px] rounded-xl border border-stone-200 bg-white p-5 text-[0.8125rem] text-stone-800 shadow-sm sm:p-10 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none"
      >
        <header className="flex flex-col gap-6 border-b border-stone-300 pb-6 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-lg bg-skin-accent font-skin-display text-lg font-semibold text-white print:border print:border-skin-accent"
              >
                O
              </span>
              <span className="font-skin-display text-xl font-semibold text-stone-900">
                {BRAND.name}
              </span>
            </div>
            <p className="mt-3 font-medium text-stone-900">{STORE_DETAILS.legalName}</p>
            <p className="text-stone-600">
              {STORE_DETAILS.addressLines.join(", ")}
              <br />
              {STORE_DETAILS.state} {STORE_DETAILS.pincode}
            </p>
            <p className="mt-1 text-stone-600">
              GSTIN <span className="font-mono text-stone-900">{STORE_DETAILS.gstin}</span> · PAN{" "}
              <span className="font-mono text-stone-900">{STORE_DETAILS.pan}</span>
            </p>
            <p className="text-stone-600">
              {BRAND.supportEmail} · {BRAND.supportPhone}
            </p>
          </div>
          <div className="sm:text-right">
            <h1 className="text-lg font-semibold tracking-wide text-stone-900 uppercase">
              Tax invoice
            </h1>
            <p className="text-xs text-stone-500">Original for recipient</p>
            <dl className="mt-3 grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 sm:justify-end">
              <dt className="text-stone-500">Invoice no.</dt>
              <dd className="font-medium text-stone-900 tabular-nums">{invoiceNumber(order)}</dd>
              <dt className="text-stone-500">Invoice date</dt>
              <dd className="text-stone-900">{formatDate(order.createdAt)}</dd>
              <dt className="text-stone-500">Order</dt>
              <dd className="text-stone-900">{order.id}</dd>
              <dt className="text-stone-500">Payment</dt>
              <dd className="text-stone-900">{PAYMENT_LABEL[order.payment.method]}</dd>
            </dl>
          </div>
        </header>

        <section className="grid gap-6 border-b border-stone-300 py-5 sm:grid-cols-3">
          <div>
            <h2 className="mb-1 text-[0.6875rem] font-semibold tracking-wide text-stone-500 uppercase">
              Bill to
            </h2>
            <p className="font-medium text-stone-900">{order.address.name}</p>
            <p className="text-stone-600">{order.address.phone}</p>
            {order.address.email ? <p className="text-stone-600">{order.address.email}</p> : null}
          </div>
          <div>
            <h2 className="mb-1 text-[0.6875rem] font-semibold tracking-wide text-stone-500 uppercase">
              Ship to
            </h2>
            <address className="text-stone-700 not-italic">
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
            </address>
          </div>
          <div>
            <h2 className="mb-1 text-[0.6875rem] font-semibold tracking-wide text-stone-500 uppercase">
              Place of supply
            </h2>
            <p className="text-stone-900">
              {order.address.state}
              {placeCode ? ` (${placeCode})` : ""}
            </p>
            <p className="text-stone-600">
              {gst.kind === "intra"
                ? "Within Uttarakhand: CGST + SGST"
                : "Outside Uttarakhand: IGST"}
            </p>
          </div>
        </section>

        <div className="overflow-x-auto">
          <table className="mt-5 w-full text-left tabular-nums">
            <thead>
              <tr className="border-y border-stone-300 bg-stone-50 text-[0.75rem] text-stone-600 print:bg-transparent">
                <th scope="col" className="py-2 pr-2 pl-2 font-medium">
                  #
                </th>
                <th scope="col" className="px-2 py-2 font-medium">
                  Item
                </th>
                <th
                  scope="col"
                  className="hidden px-2 py-2 font-medium sm:table-cell print:table-cell"
                >
                  HSN
                </th>
                <th scope="col" className="px-2 py-2 text-right font-medium">
                  Qty
                </th>
                <th
                  scope="col"
                  className="hidden px-2 py-2 text-right font-medium sm:table-cell print:table-cell"
                >
                  Rate
                </th>
                <th scope="col" className="py-2 pr-2 pl-2 text-right font-medium">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {order.items.map((item, i) => {
                const category = products.find((p) => p.slug === item.slug)?.category;
                return (
                  <tr key={`${item.slug}-${item.variantId}`}>
                    <td className="py-2.5 pr-2 pl-2 text-stone-500">{i + 1}</td>
                    <td className="px-2 py-2.5">
                      <span className="text-stone-900">{item.name}</span>
                      <span className="block text-xs text-stone-500">
                        {item.size}
                        <span className="sm:hidden print:hidden">
                          {" "}
                          · HSN {hsnFor(category)} · {formatINRPaise(item.price)} each
                        </span>
                      </span>
                    </td>
                    <td className="hidden px-2 py-2.5 text-stone-700 sm:table-cell print:table-cell">
                      {hsnFor(category)}
                    </td>
                    <td className="px-2 py-2.5 text-right">{item.qty}</td>
                    <td className="hidden px-2 py-2.5 text-right sm:table-cell print:table-cell">
                      {formatINRPaise(item.price)}
                    </td>
                    <td className="py-2.5 pr-2 pl-2 text-right text-stone-900">
                      {formatINRPaise(item.price * item.qty)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-6 border-t border-stone-300 pt-4 sm:flex-row sm:justify-between">
          <div className="sm:max-w-[52%]">
            <h2 className="mb-2 text-[0.6875rem] font-semibold tracking-wide text-stone-500 uppercase">
              Tax summary
            </h2>
            <table className="w-full text-left tabular-nums">
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <th scope="row" className="py-1.5 pr-4 font-normal text-stone-600">
                    Taxable value
                  </th>
                  <td className="py-1.5 text-right">{formatINRPaise(gst.taxable)}</td>
                </tr>
                {gst.kind === "intra" ? (
                  <>
                    <tr>
                      <th scope="row" className="py-1.5 pr-4 font-normal text-stone-600">
                        CGST at 9%
                      </th>
                      <td className="py-1.5 text-right">{formatINRPaise(gst.cgst)}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-1.5 pr-4 font-normal text-stone-600">
                        SGST at 9%
                      </th>
                      <td className="py-1.5 text-right">{formatINRPaise(gst.sgst)}</td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <th scope="row" className="py-1.5 pr-4 font-normal text-stone-600">
                      IGST at 18%
                    </th>
                    <td className="py-1.5 text-right">{formatINRPaise(gst.igst)}</td>
                  </tr>
                )}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-stone-500">
              Prices include GST at 18%. Discounts, delivery and the cash on delivery fee are taxed
              at the same rate.
            </p>
          </div>
          <dl className="w-full space-y-1.5 tabular-nums sm:w-72">
            <div className="flex justify-between gap-4">
              <dt className="text-stone-600">Item total</dt>
              <dd>{formatINRPaise(t.subtotal)}</dd>
            </div>
            {t.couponDiscount ? (
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600">Coupon {t.couponCode}</dt>
                <dd>-{formatINRPaise(t.couponDiscount)}</dd>
              </div>
            ) : null}
            {t.prepaidDiscount ? (
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600">Prepaid discount ({SHIPPING.prepaidPercent}%)</dt>
                <dd>-{formatINRPaise(t.prepaidDiscount)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-stone-600">Delivery</dt>
              <dd>{t.shipping ? formatINRPaise(t.shipping) : "Free"}</dd>
            </div>
            {t.codFee ? (
              <div className="flex justify-between gap-4">
                <dt className="text-stone-600">Cash on delivery fee</dt>
                <dd>{formatINRPaise(t.codFee)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4 border-t border-stone-300 pt-2 text-[0.9375rem] font-semibold text-stone-900">
              <dt>Total (incl. GST)</dt>
              <dd>{formatINRPaise(t.total)}</dd>
            </div>
          </dl>
        </div>

        <p className="mt-5 rounded-lg bg-stone-50 px-3 py-2.5 text-stone-700 print:bg-transparent print:px-0">
          <span className="text-stone-500">Amount in words: </span>
          {amountInWords(t.total)}
        </p>

        <footer className="mt-8 flex flex-col gap-6 text-xs text-stone-600 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md space-y-1">
            <p>
              Unopened products can be returned within {SHIPPING.returnDays} days of delivery. Write
              to {BRAND.supportEmail}.
            </p>
            <p>This is a computer generated invoice and needs no signature.</p>
            <p className="font-medium text-stone-700">
              Demo invoice for a made-up business. It is not a valid tax document.
            </p>
          </div>
          <div className="text-right">
            <p className="text-stone-500">For {STORE_DETAILS.legalName}</p>
            <p className="mt-6 border-t border-stone-300 pt-1 text-stone-700">
              Authorised signatory
            </p>
          </div>
        </footer>
      </article>
    </div>
  );
}
