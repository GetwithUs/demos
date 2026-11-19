"use client";

import { useDemoStore } from "@/sites/skincare/lib/store";

/* Order steps the dashboard takes, built on the store's actions so the shop sees the same data. */

/** A made-up 12-digit air waybill number. Call from event handlers only. */
export function newAwb(): string {
  return String(Math.floor(100_000_000_000 + Math.random() * 900_000_000_000));
}

/** Confirms (if needed) and packs an order. Returns false if it is past packing. */
export function packOrder(id: string): boolean {
  const s = useDemoStore.getState();
  const order = s.orders.find((o) => o.id === id);
  if (!order || (order.status !== "placed" && order.status !== "confirmed")) return false;
  if (order.status === "placed") s.setOrderStatus(id, "confirmed");
  useDemoStore.getState().setOrderStatus(id, "packed");
  return true;
}

/** Hands a packed order to a courier with its AWB. Returns false if it is not packed. */
export function shipOrder(id: string, courier: string, awb: string): boolean {
  const s = useDemoStore.getState();
  const order = s.orders.find((o) => o.id === id);
  if (!order || order.status !== "packed") return false;
  s.setShipment(id, { courier, awb });
  useDemoStore.getState().setOrderStatus(id, "shipped", `Handed to ${courier}, AWB ${awb}`);
  return true;
}
