"use client";

import { CheckCheck, Copy, MessageCircle } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/sites/skincare/data/catalog";
import type { Order } from "@/sites/skincare/data/types";
import { Overlay } from "@/sites/skincare/admin/components/Overlay";
import { Button } from "@/sites/skincare/admin/components/ui";
import { formatTime, initials } from "@/sites/skincare/admin/lib/format";
import { whatsappMessage } from "@/sites/skincare/admin/lib/messages";

/** A mock WhatsApp chat showing the update the customer would get. Nothing is sent. */
export default function WhatsAppPreview({
  order,
  open,
  onClose,
  now,
}: {
  order: Order;
  open: boolean;
  onClose: () => void;
  now: number;
}) {
  const [copied, setCopied] = useState(false);
  const message = whatsappMessage(order);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Overlay
      open={open}
      onClose={onClose}
      title="Notify customer on WhatsApp"
      description={`Preview of the message ${order.address.name} would get for this order's status.`}
      footer={
        <>
          <Button onClick={copy}>
            {copied ? (
              <CheckCheck aria-hidden className="size-4" />
            ) : (
              <Copy aria-hidden className="size-4" />
            )}
            {copied ? "Copied" : "Copy message"}
          </Button>
          <Button variant="primary" onClick={onClose} data-autofocus>
            Done
          </Button>
        </>
      }
    >
      <div className="overflow-hidden rounded-xl border border-stone-200">
        <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-full bg-white/20 text-sm font-semibold"
          >
            {initials(order.address.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{order.address.name}</p>
            <p className="text-xs text-white/80">{order.address.phone}</p>
          </div>
        </div>
        <div className="bg-[#efeae2] px-3 py-4">
          <p className="mx-auto mb-3 w-fit rounded-md bg-white/80 px-2 py-0.5 text-[0.6875rem] text-stone-600">
            Today
          </p>
          <div className="ml-auto max-w-[88%] rounded-lg rounded-tr-none bg-[#d9fdd3] px-3 py-2 text-sm text-stone-900 shadow-sm">
            <p className="mb-1 text-xs font-semibold text-[#06705f]">{BRAND.name}</p>
            <p className="leading-relaxed whitespace-pre-line">{message}</p>
            <p className="mt-1 flex items-center justify-end gap-1 text-[0.6875rem] text-stone-500">
              {formatTime(now)}
              <CheckCheck aria-hidden className="size-3.5 text-sky-600" />
            </p>
          </div>
        </div>
      </div>
      <p className="mt-3 flex items-start gap-2 text-[0.8125rem] text-stone-600">
        <MessageCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-stone-500" />
        Preview only. Nothing is sent from this demo. A live store would send this through the
        WhatsApp Business API when the status changes.
      </p>
    </Overlay>
  );
}
