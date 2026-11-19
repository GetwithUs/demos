"use client";

import { MessageCircle } from "lucide-react";
import { buttonClass } from "@/sites/skincare/components/ui";
import { useChat } from "@/sites/skincare/shop/chat";

/** Opens the WhatsApp-style chat panel. */
export default function ChatButton({
  label = "Chat on WhatsApp",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const openChat = useChat((s) => s.openChat);
  return (
    <button
      type="button"
      onClick={openChat}
      className={buttonClass(
        "primary",
        "md",
        `bg-skin-wa-ink hover:bg-[#095a31] ${className ?? ""}`,
      )}
    >
      <MessageCircle className="size-4" aria-hidden />
      {label}
    </button>
  );
}
