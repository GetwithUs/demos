"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { PaymentBadge, StatusBadge, VisitorBadge } from "@/sites/skincare/admin/components/ui";
import { formatDateTime, PAYMENT_SHORT } from "@/sites/skincare/admin/lib/format";

/** A compact list of orders: a table on wide screens, cards on phones. */
export default function OrderList({ orders, caption }: { orders: Order[]; caption: string }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-y border-stone-200 bg-stone-50/70 text-[0.75rem] text-stone-600">
              <th scope="col" className="px-5 py-2 font-medium">
                Order
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Date
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Customer
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Status
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Payment
              </th>
              <th scope="col" className="px-5 py-2 text-right font-medium">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.map((o) => (
              <tr key={o.id} className="group relative hover:bg-stone-50">
                <td className="px-5 py-2.5">
                  <Link
                    href={`/skincare/admin/orders/${o.id}`}
                    className="font-medium text-stone-900 after:absolute after:inset-0 hover:underline focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-skin-accent"
                  >
                    {o.id}
                  </Link>
                  {o.source === "visitor" ? (
                    <span className="ml-2 align-middle">
                      <VisitorBadge order={o} />
                    </span>
                  ) : null}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-stone-600">
                  {formatDateTime(o.createdAt)}
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-stone-900">{o.address.name}</span>
                  <span className="block text-xs text-stone-500">{o.address.city}</span>
                </td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-3 py-2.5">
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-stone-600">
                      {PAYMENT_SHORT[o.payment.method]}
                    </span>
                    <PaymentBadge order={o} />
                  </span>
                </td>
                <td className="px-5 py-2.5 text-right font-medium text-stone-900 tabular-nums">
                  {formatINR(o.totals.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul
        className="divide-y divide-stone-100 border-t border-stone-100 md:hidden"
        aria-label={caption}
      >
        {orders.map((o) => (
          <li key={o.id}>
            <Link
              href={`/skincare/admin/orders/${o.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-stone-900">{o.id}</span>
                  <span className="font-medium text-stone-900 tabular-nums">
                    {formatINR(o.totals.total)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[0.8125rem] text-stone-600">
                  {o.address.name}, {o.address.city} · {formatDateTime(o.createdAt)}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <StatusBadge status={o.status} />
                  <PaymentBadge order={o} />
                  <span className="text-xs text-stone-500">{PAYMENT_SHORT[o.payment.method]}</span>
                  <VisitorBadge order={o} />
                </div>
              </div>
              <ChevronRight aria-hidden className="size-4 shrink-0 text-stone-400" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
