"use client";

import { Phone } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { WhatsAppIcon } from "@/sites/dental-clinic/components/icons";
import { useDentalUI } from "@/sites/dental-clinic/lib/ui-store";

/**
 * Looks like a call button but only opens a notice: the demo's phone number is made up and
 * could belong to a real person, so it must never be dialled.
 */
export function CallButton({
  className,
  children,
  showIcon = true,
  label,
}: {
  className?: string;
  children?: ReactNode;
  showIcon?: boolean;
  /** Accessible name when the visible content is only an icon or a number. */
  label?: string;
}) {
  const openCallNotice = useDentalUI((s) => s.openCallNotice);
  return (
    <button
      type="button"
      onClick={openCallNotice}
      aria-label={label}
      aria-haspopup="dialog"
      className={className}
    >
      {showIcon ? (
        <Phone aria-hidden="true" className="size-[1.1em] shrink-0" strokeWidth={1.8} />
      ) : null}
      {children}
    </button>
  );
}

/** Opens the mock WhatsApp chat panel. */
export function ChatButton({
  className,
  children,
  showIcon = true,
  label,
}: {
  className?: string;
  children?: ReactNode;
  showIcon?: boolean;
  label?: string;
}) {
  const openChat = useDentalUI((s) => s.openChat);
  return (
    <button
      type="button"
      onClick={openChat}
      aria-label={label}
      aria-haspopup="dialog"
      className={cn(className)}
    >
      {showIcon ? <WhatsAppIcon className="size-[1.2em] shrink-0" /> : null}
      {children}
    </button>
  );
}
