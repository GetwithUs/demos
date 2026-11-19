"use client";

import { ChevronDown, Search, X } from "lucide-react";
import Link from "next/link";
import Dialog from "@/sites/skincare/components/Dialog";
import { Logo } from "@/sites/skincare/components/shop/Brand";
import { CATEGORIES, CONCERNS } from "@/sites/skincare/data/catalog";
import { INGREDIENTS } from "@/sites/skincare/content/ingredients";
import { HELP_LINKS, PRIMARY_NAV } from "@/sites/skincare/content/nav";
import { useShopUI } from "@/sites/skincare/shop/ui";

/** Slide-in menu for phones and tablets. */
export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const openPanel = useShopUI((s) => s.open);
  const link = "block py-2.5 text-[0.95rem] text-skin-ink";
  const groups = [
    {
      title: "Shop by concern",
      links: Object.entries(CONCERNS).map(([id, c]) => ({
        label: c.label,
        href: `/skincare/concerns/${id}`,
      })),
    },
    {
      title: "Shop by category",
      links: Object.entries(CATEGORIES).map(([id, c]) => ({
        label: c.plural,
        href: `/skincare/categories/${id}`,
      })),
    },
    {
      title: "Shop by ingredient",
      links: [
        ...INGREDIENTS.slice(0, 8).map((i) => ({
          label: i.name,
          href: `/skincare/shop?ingredient=${i.id}`,
        })),
        { label: "Ingredient glossary", href: "/skincare/ingredients" },
      ],
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} side="left" label="Menu" className="w-[min(88vw,380px)]">
      <div className="flex h-full flex-col bg-skin-bg">
        <div className="flex h-16 items-center justify-between border-b border-skin-line px-4">
          <Logo onClick={onClose} />
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full hover:bg-skin-sand"
            aria-label="Close menu"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-8">
          <button
            type="button"
            onClick={() => openPanel("search")}
            className="mt-4 flex h-11 w-full items-center gap-2 rounded-full border border-skin-line bg-white px-4 text-sm text-skin-subtle"
          >
            <Search className="size-4" aria-hidden />
            Search products
          </button>
          <nav aria-label="Mobile" className="mt-4">
            <Link
              href="/skincare/shop"
              onClick={onClose}
              className="block py-3 font-skin-display text-xl text-skin-ink"
            >
              Shop all
            </Link>
            {groups.map((g) => (
              <details key={g.title} className="group border-t border-skin-line">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-skin-display text-xl text-skin-ink [&::-webkit-details-marker]:hidden">
                  {g.title}
                  <ChevronDown className="size-5 transition group-open:rotate-180" aria-hidden />
                </summary>
                <ul className="pb-3 pl-1">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} onClick={onClose} className={link}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            <ul className="border-t border-skin-line pt-2">
              {PRIMARY_NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className="block py-2.5 font-skin-display text-xl text-skin-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/skincare/about"
                  onClick={onClose}
                  className="block py-2.5 font-skin-display text-xl text-skin-ink"
                >
                  Our story
                </Link>
              </li>
            </ul>
          </nav>
          <div className="mt-6 rounded-2xl bg-white p-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-skin-subtle uppercase">
              Help
            </p>
            <ul className="mt-2">
              {[
                { label: "My account", href: "/skincare/account" },
                { label: "Wishlist", href: "/skincare/wishlist" },
                ...HELP_LINKS,
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className="block py-2 text-sm text-skin-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/skincare/admin"
            onClick={onClose}
            className="mt-5 block text-center text-xs text-skin-subtle underline"
          >
            Owner dashboard (for the shop owner)
          </Link>
        </div>
      </div>
    </Dialog>
  );
}
