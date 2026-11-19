"use client";

import { ArrowLeft, ChevronDown, Heart, Lock, Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import ProductVisual from "@/sites/skincare/components/ProductVisual";
import AnnouncementBar from "@/sites/skincare/components/shop/AnnouncementBar";
import { Logo } from "@/sites/skincare/components/shop/Brand";
import MobileMenu from "@/sites/skincare/components/shop/MobileMenu";
import SearchDialog from "@/sites/skincare/components/shop/SearchDialog";
import { CATEGORIES, CONCERNS } from "@/sites/skincare/data/catalog";
import { productBySlug } from "@/sites/skincare/data/products";
import { INGREDIENTS } from "@/sites/skincare/content/ingredients";
import { MEGA_FEATURES, PRIMARY_NAV } from "@/sites/skincare/content/nav";
import { useDemoStore, useStoreHydrated } from "@/sites/skincare/lib/store";
import { useCartCount } from "@/sites/skincare/shop/cart";
import { useShopUI } from "@/sites/skincare/shop/ui";

const iconBtn =
  "relative grid size-10 place-items-center rounded-full text-skin-ink transition hover:bg-skin-sand focus-visible:outline-2 focus-visible:outline-skin-accent";

export default function ShopHeader() {
  const pathname = usePathname();
  const checkout = pathname.startsWith("/skincare/checkout");
  return checkout ? <CheckoutHeader /> : <FullHeader />;
}

function CheckoutHeader() {
  return (
    <header className="border-b border-skin-line bg-skin-bg">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link
          href="/skincare/cart"
          className="inline-flex items-center gap-1.5 text-sm text-skin-body hover:text-skin-ink"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Back to cart</span>
          <span className="sm:hidden">Cart</span>
        </Link>
        <Logo />
        <p className="inline-flex items-center gap-1.5 text-sm font-medium text-skin-accent">
          <Lock className="size-4" aria-hidden />
          <span className="hidden sm:inline">Secure checkout</span>
          <span className="sm:hidden">Secure</span>
        </p>
      </div>
    </header>
  );
}

function FullHeader() {
  const openPanel = useShopUI((s) => s.open);
  const panel = useShopUI((s) => s.panel);
  const close = useShopUI((s) => s.close);
  const count = useCartCount();
  const wishCount = useDemoStore((s) => s.wishlist.length);
  const hydrated = useStoreHydrated();

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 border-b border-skin-line bg-skin-bg/95 backdrop-blur supports-[backdrop-filter]:bg-skin-bg/85">
        <div className="mx-auto grid h-16 max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-2 sm:px-6 lg:flex lg:h-[4.5rem] lg:gap-8 lg:px-10">
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className={iconBtn}
              aria-label="Open menu"
              onClick={() => openPanel("menu")}
            >
              <Menu className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              className={iconBtn}
              aria-label="Search products"
              onClick={() => openPanel("search")}
            >
              <Search className="size-5" aria-hidden />
            </button>
          </div>

          <Logo className="justify-self-center" />

          <nav aria-label="Main" className="hidden flex-1 lg:block">
            <ul className="flex items-center gap-1">
              <li>
                <MegaMenu />
              </li>
              {PRIMARY_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full px-3 py-2 text-[0.92rem] text-skin-ink transition hover:bg-skin-sand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-0.5">
            <button
              type="button"
              onClick={() => openPanel("search")}
              className="mr-2 hidden h-10 w-56 items-center gap-2 rounded-full border border-skin-line bg-white px-4 text-left text-sm text-skin-subtle transition hover:border-skin-ink/40 xl:flex"
            >
              <Search className="size-4" aria-hidden />
              Search serums, acne, SPF
            </button>
            <button
              type="button"
              className={cn(iconBtn, "hidden lg:grid xl:hidden")}
              aria-label="Search products"
              onClick={() => openPanel("search")}
            >
              <Search className="size-5" aria-hidden />
            </button>
            <AccountMenu />
            <Link
              href="/skincare/wishlist"
              className={cn(iconBtn, "hidden sm:grid")}
              aria-label={`Wishlist${hydrated && wishCount ? `, ${wishCount} saved` : ""}`}
            >
              <Heart className="size-5" strokeWidth={1.8} aria-hidden />
              {hydrated && wishCount > 0 ? (
                <span
                  className="absolute top-1.5 right-1.5 size-2 rounded-full bg-skin-rose"
                  aria-hidden
                />
              ) : null}
            </Link>
            <button
              type="button"
              className={iconBtn}
              aria-label={`Cart, ${hydrated ? count : 0} ${count === 1 ? "item" : "items"}`}
              onClick={() => openPanel("cart")}
            >
              <ShoppingBag className="size-5" strokeWidth={1.8} aria-hidden />
              {hydrated && count > 0 ? (
                <span
                  key={count}
                  className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 animate-skin-pop place-items-center rounded-full bg-skin-accent px-1 text-[0.68rem] font-semibold text-white"
                  aria-hidden
                >
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>
      <SearchDialog open={panel === "search"} onClose={close} />
      <MobileMenu open={panel === "menu"} onClose={close} />
    </>
  );
}

function useDisclosure() {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return { open, setOpen, wrapper, trigger };
}

/** "Shop" mega menu: by concern, category and ingredient, plus featured collections. */
function MegaMenu() {
  const { open, setOpen, wrapper, trigger } = useDisclosure();
  const panelId = useId();
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const hover = (next: boolean) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(next), next ? 90 : 160);
  };
  const shut = () => setOpen(false);

  return (
    <div
      ref={wrapper}
      onMouseEnter={() => hover(true)}
      onMouseLeave={() => hover(false)}
      onBlur={(e) => {
        if (!wrapper.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          clearTimeout(hoverTimer.current);
          setOpen(!open);
        }}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-2 text-[0.92rem] font-medium text-skin-ink transition hover:bg-skin-sand",
          open && "bg-skin-sand",
        )}
      >
        Shop
        <ChevronDown className={cn("size-4 transition", open && "rotate-180")} aria-hidden />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full animate-skin-fade-in border-y border-skin-line bg-skin-bg shadow-[0_24px_40px_-30px_rgba(31,36,32,0.5)]"
      >
        <div className="mx-auto grid max-w-[1320px] grid-cols-[1fr_1fr_1fr_1.6fr] gap-10 px-10 py-9">
          <MenuColumn
            title="Shop by concern"
            links={Object.entries(CONCERNS).map(([id, c]) => ({
              label: c.label,
              href: `/skincare/concerns/${id}`,
            }))}
            onNavigate={shut}
          />
          <MenuColumn
            title="Shop by category"
            links={Object.entries(CATEGORIES).map(([id, c]) => ({
              label: c.plural,
              href: `/skincare/categories/${id}`,
            }))}
            onNavigate={shut}
          />
          <MenuColumn
            title="Shop by ingredient"
            links={[
              ...INGREDIENTS.slice(0, 8).map((i) => ({
                label: i.name,
                href: `/skincare/shop?ingredient=${i.id}`,
              })),
              { label: "All ingredients", href: "/skincare/ingredients" },
            ]}
            onNavigate={shut}
          />
          <div className="grid grid-cols-3 gap-4">
            {MEGA_FEATURES.map((f) => {
              const p = productBySlug(f.slug);
              return (
                <Link key={f.title} href={f.href} onClick={shut} className="group block">
                  <div
                    className="overflow-hidden rounded-2xl px-4 pt-3"
                    style={{ background: p?.visual.tint ?? "#f1ebe1" }}
                  >
                    {p ? (
                      <ProductVisual
                        spec={p.visual}
                        name={p.name}
                        className="transition duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <p className="mt-3 font-skin-display text-lg leading-tight group-hover:underline">
                    {f.title}
                  </p>
                  <p className="mt-1 text-[0.8rem] leading-snug text-skin-subtle">{f.text}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuColumn({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.16em] text-skin-subtle uppercase">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              onClick={onNavigate}
              className="text-[0.92rem] text-skin-ink hover:text-skin-accent hover:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AccountMenu() {
  const { open, setOpen, wrapper, trigger } = useDisclosure();
  const menuId = useId();
  const shut = () => setOpen(false);
  const item = "block rounded-lg px-3 py-2 text-sm text-skin-ink hover:bg-skin-sand";
  return (
    <div
      ref={wrapper}
      className="relative"
      onBlur={(e) => {
        if (!wrapper.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={iconBtn}
        aria-label="Account"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        <User className="size-5" strokeWidth={1.8} aria-hidden />
      </button>
      <div
        id={menuId}
        hidden={!open}
        className="absolute top-full right-0 z-50 mt-2 w-60 animate-skin-fade-in rounded-2xl border border-skin-line bg-white p-2 shadow-xl"
      >
        <p className="px-3 pt-2 pb-1 text-xs text-skin-subtle">Saved in this browser</p>
        <ul>
          <li>
            <Link href="/skincare/account" onClick={shut} className={item}>
              My account
            </Link>
          </li>
          <li>
            <Link href="/skincare/account#orders" onClick={shut} className={item}>
              My orders
            </Link>
          </li>
          <li>
            <Link href="/skincare/track" onClick={shut} className={item}>
              Track an order
            </Link>
          </li>
          <li>
            <Link href="/skincare/wishlist" onClick={shut} className={item}>
              Wishlist
            </Link>
          </li>
        </ul>
        <div className="mt-1 border-t border-skin-line pt-1">
          <Link
            href="/skincare/admin"
            onClick={shut}
            className="block rounded-lg px-3 py-2 text-[0.8rem] text-skin-subtle hover:bg-skin-sand hover:text-skin-ink"
          >
            Owner dashboard
            <span className="block text-[0.72rem]">For the shop owner (demo login)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
