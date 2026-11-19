import type { ReactNode } from "react";
import CartDrawer from "@/sites/skincare/components/cart/CartDrawer";
import { ShopEffects, Toaster } from "@/sites/skincare/components/shop/ShopEffects";
import ShopFooter from "@/sites/skincare/components/shop/ShopFooter";
import ShopHeader from "@/sites/skincare/components/shop/ShopHeader";
import WhatsAppChat from "@/sites/skincare/components/shop/WhatsAppChat";

/** The storefront: header, footer, cart drawer and WhatsApp chat around every shop page. */
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-skin-ink px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <ShopEffects />
      <ShopHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <ShopFooter />
      <CartDrawer />
      <WhatsAppChat />
      <Toaster />
    </>
  );
}
