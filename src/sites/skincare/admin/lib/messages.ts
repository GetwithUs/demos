import { BRAND } from "@/sites/skincare/data/catalog";
import type { Order } from "@/sites/skincare/data/types";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { firstName, PAYMENT_LABEL } from "@/sites/skincare/admin/lib/format";

/** The WhatsApp update an owner would send for the order's current status (preview only). */
export function whatsappMessage(order: Order): string {
  const name = firstName(order.address.name);
  const total = formatINR(order.totals.total);
  const items = order.items.length === 1 ? order.items[0].name : `${order.items.length} products`;
  const hello = `Hi ${name}, this is ${BRAND.name}.`;
  switch (order.status) {
    case "placed":
    case "confirmed":
      return `${hello} Thank you for your order ${order.id} (${items}, ${total}). It is confirmed and we will pack it within 24 hours.${
        order.payment.method === "cod" ? ` Please keep ${total} ready to pay on delivery.` : ""
      }`;
    case "packed":
      return `${hello} Your order ${order.id} is packed and will be handed to our courier today. We will share the tracking number as soon as it ships.`;
    case "shipped":
      return `${hello} Your order ${order.id} has shipped with ${order.courier ?? "our courier"}. AWB number: ${
        order.awb ?? "to follow"
      }. It should reach ${order.address.city} in 2 to 5 days.`;
    case "out-for-delivery":
      return `${hello} Your order ${order.id} is out for delivery today with ${order.courier ?? "our courier"}.${
        order.payment.method === "cod" ? ` Please keep ${total} ready.` : ""
      }`;
    case "delivered":
      return `${hello} Your order ${order.id} has been delivered. We hope you love it! Reply here if you need help building your routine.`;
    case "cancelled":
      return order.payment.method === "cod"
        ? `${hello} Your order ${order.id} has been cancelled. No payment was taken. Reply here if you would like to order again.`
        : `${hello} Your order ${order.id} has been cancelled. A refund of ${total} to your ${PAYMENT_LABEL[order.payment.method]} account will reach you in 5 to 7 working days.`;
    case "returned":
      return `${hello} We have received your return for order ${order.id}.${
        order.payment.method === "cod"
          ? " Our team will call you to arrange the refund."
          : ` A refund of ${total} to your ${PAYMENT_LABEL[order.payment.method]} account will reach you in 5 to 7 working days.`
      }`;
  }
}
