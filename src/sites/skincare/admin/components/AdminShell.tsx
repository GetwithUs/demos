"use client";

import {
  Bell,
  Boxes,
  ChartColumn,
  ChevronDown,
  Ellipsis,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Store,
  TicketPercent,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { BRAND } from "@/sites/skincare/data/catalog";
import { formatINR } from "@/sites/skincare/lib/pricing";
import { OWNER_LOGIN, useDemoStore, useProducts } from "@/sites/skincare/lib/store";
import GlobalSearch from "@/sites/skincare/admin/components/GlobalSearch";
import { Overlay, usePopover } from "@/sites/skincare/admin/components/Overlay";
import { ToastProvider } from "@/sites/skincare/admin/components/Toast";
import { StatusBadge } from "@/sites/skincare/admin/components/ui";
import { initials, relativeTime } from "@/sites/skincare/admin/lib/format";
import { STORE_DETAILS } from "@/sites/skincare/admin/lib/gst";
import { useAdminReady, useNow, useOrders } from "@/sites/skincare/admin/lib/hooks";
import { isOpen, LOW_STOCK } from "@/sites/skincare/admin/lib/metrics";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeTone?: "accent" | "warn";
};

const BASE = "/skincare/admin";

function isActive(pathname: string, href: string): boolean {
  return href === BASE ? pathname === BASE : pathname === href || pathname.startsWith(`${href}/`);
}

function useNav(): NavItem[] {
  const orders = useOrders();
  const products = useProducts({ includeInactive: true });
  const open = orders.filter(isOpen).length;
  const low = products.reduce(
    (n, p) => n + p.variants.filter((v) => v.stock < LOW_STOCK).length,
    0,
  );
  return [
    { href: BASE, label: "Overview", icon: LayoutDashboard },
    {
      href: `${BASE}/orders`,
      label: "Orders",
      icon: ShoppingBag,
      badge: open,
      badgeTone: "accent",
    },
    { href: `${BASE}/products`, label: "Products", icon: Package },
    { href: `${BASE}/inventory`, label: "Inventory", icon: Boxes, badge: low, badgeTone: "warn" },
    { href: `${BASE}/customers`, label: "Customers", icon: Users },
    { href: `${BASE}/discounts`, label: "Discounts", icon: TicketPercent },
    { href: `${BASE}/analytics`, label: "Analytics", icon: ChartColumn },
    { href: `${BASE}/settings`, label: "Settings", icon: Settings },
  ];
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-lg bg-skin-accent font-skin-display text-[1.05rem] font-semibold text-white"
      >
        O
      </span>
      <span className={cn("min-w-0 leading-tight", compact && "max-sm:sr-only")}>
        <span className="block truncate font-skin-display text-[0.975rem] font-semibold text-stone-900">
          {BRAND.name}
        </span>
        <span className="block text-[0.6875rem] text-stone-500">Owner dashboard</span>
      </span>
    </span>
  );
}

function NavList({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-skin-accent",
                active
                  ? "bg-stone-900/[0.06] text-stone-900"
                  : "text-stone-600 hover:bg-stone-900/[0.04] hover:text-stone-900",
              )}
            >
              <Icon
                aria-hidden
                className={cn(
                  "size-[1.05rem] shrink-0",
                  active ? "text-skin-accent" : "text-stone-500 group-hover:text-stone-700",
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    "min-w-5 rounded-full px-1.5 py-px text-center text-[0.6875rem] font-semibold tabular-nums",
                    item.badgeTone === "warn"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-skin-accent text-white",
                  )}
                >
                  {item.badge}
                  <span className="sr-only">
                    {item.badgeTone === "warn" ? " sizes low on stock" : " orders need action"}
                  </span>
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function StoreLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div>
      <p className="px-3 pb-1.5 text-[0.6875rem] font-semibold tracking-wide text-stone-500 uppercase">
        Sales channel
      </p>
      <Link
        href="/skincare"
        target="_blank"
        onClick={onNavigate}
        className="group flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-stone-600 hover:bg-stone-900/[0.04] hover:text-stone-900 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-skin-accent"
      >
        <Store aria-hidden className="size-[1.05rem] text-stone-500" />
        <span className="flex-1">Online store</span>
        <ExternalLink aria-hidden className="size-3.5 text-stone-400" />
        <span className="sr-only">(opens in a new tab)</span>
      </Link>
    </div>
  );
}

function Notifications() {
  const { open, setOpen, toggle, triggerRef, panelRef, onPanelKeyDown } = usePopover();
  const orders = useOrders();
  const now = useNow();
  const waiting = orders.filter((o) => o.status === "placed");
  const recent = orders.slice(0, 6);
  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Notifications${waiting.length ? `, ${waiting.length} new orders to confirm` : ""}`}
        className="relative grid size-9 place-items-center rounded-lg text-stone-600 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-skin-accent"
      >
        <Bell aria-hidden className="size-[1.15rem]" />
        {waiting.length ? (
          <span
            aria-hidden
            className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[0.625rem] leading-4 font-semibold text-white ring-2 ring-white"
          >
            {waiting.length > 9 ? "9+" : waiting.length}
          </span>
        ) : null}
      </button>
      {open ? (
        <div
          ref={panelRef}
          onKeyDown={onPanelKeyDown}
          className="fixed inset-x-3 top-16 z-50 rounded-xl border border-stone-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-stone-100 px-4 py-3">
            <p className="text-sm font-semibold text-stone-900">Notifications</p>
            <p className="text-xs text-stone-500">
              {waiting.length ? `${waiting.length} to confirm` : "All caught up"}
            </p>
          </div>
          <ul className="max-h-96 overflow-y-auto py-1">
            {recent.map((o) => (
              <li key={o.id}>
                <Link
                  href={`${BASE}/orders/${o.id}`}
                  data-menu-item
                  onClick={() => setOpen(false)}
                  className="flex gap-3 px-4 py-2.5 hover:bg-stone-50 focus-visible:bg-stone-50 focus-visible:outline-none"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      o.status === "placed" ? "bg-skin-accent" : "bg-transparent",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-stone-900">
                      <span className="font-medium">
                        {o.source === "visitor"
                          ? "New order from this browser"
                          : o.status === "placed"
                            ? "New order"
                            : "Order"}
                      </span>{" "}
                      {o.id} from {o.address.name}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="tabular-nums">{formatINR(o.totals.total)}</span>
                      <span aria-hidden>·</span>
                      <span>{relativeTime(o.createdAt, now)}</span>
                      <StatusBadge status={o.status} />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-stone-100 p-2">
            <Link
              href={`${BASE}/orders`}
              data-menu-item
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-skin-accent hover:bg-stone-50 focus-visible:bg-stone-50 focus-visible:outline-none"
            >
              View all orders
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function UserMenu({ onSignOut }: { onSignOut: () => void }) {
  const { open, setOpen, toggle, triggerRef, panelRef, onPanelKeyDown } = usePopover();
  const owner = STORE_DETAILS.owner;
  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          toggle();
          if (!open)
            requestAnimationFrame(() =>
              panelRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus(),
            );
        }}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${owner.name}`}
        className="flex h-9 items-center gap-2 rounded-lg pr-1.5 pl-1 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-skin-accent"
      >
        <span
          aria-hidden
          className="grid size-7 place-items-center rounded-full bg-skin-saffron-soft text-xs font-semibold text-skin-saffron"
        >
          {initials(owner.name)}
        </span>
        <span className="hidden text-sm font-medium text-stone-800 xl:inline">{owner.name}</span>
        <ChevronDown aria-hidden className="hidden size-3.5 text-stone-500 sm:block" />
      </button>
      {open ? (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Account"
          onKeyDown={onPanelKeyDown}
          className="absolute top-full right-0 z-50 mt-2 w-64 rounded-xl border border-stone-200 bg-white py-1.5 shadow-xl"
        >
          <div className="border-b border-stone-100 px-4 pt-2 pb-3">
            <p className="text-sm font-medium text-stone-900">{owner.name}</p>
            <p className="truncate text-xs text-stone-500">{OWNER_LOGIN.email}</p>
            <p className="mt-0.5 text-xs text-stone-500">
              {owner.role}, {BRAND.name}
            </p>
          </div>
          <div className="py-1">
            <Link
              role="menuitem"
              href={`${BASE}/settings`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 focus-visible:bg-stone-100 focus-visible:outline-none"
            >
              <Settings aria-hidden className="size-4 text-stone-500" />
              Store settings
            </Link>
            <Link
              role="menuitem"
              href="/skincare"
              target="_blank"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 focus-visible:bg-stone-100 focus-visible:outline-none"
            >
              <Store aria-hidden className="size-4 text-stone-500" />
              View store
              <span className="sr-only">(opens in a new tab)</span>
            </Link>
          </div>
          <div className="border-t border-stone-100 pt-1">
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 focus-visible:bg-stone-100 focus-visible:outline-none"
            >
              <LogOut aria-hidden className="size-4 text-stone-500" />
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Splash({ message }: { message: string }) {
  return (
    <div role="status" className="grid min-h-[70dvh] place-items-center bg-[#f6f5f2] px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden
          className="grid size-11 animate-pulse place-items-center rounded-xl bg-skin-accent font-skin-display text-xl font-semibold text-white"
        >
          O
        </span>
        <p className="text-sm text-stone-600">{message}</p>
      </div>
    </div>
  );
}

/** The owner dashboard frame: sidebar, top bar, mobile navigation and the sign-in guard. */
export default function AdminShell({ children }: { children: ReactNode }) {
  const ready = useAdminReady();
  const signedIn = useDemoStore((s) => s.ownerSignedIn);
  const signOut = useDemoStore((s) => s.signOut);
  const router = useRouter();
  const pathname = usePathname();
  const nav = useNav();
  const [drawer, setDrawer] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const signingOut = useRef(false);

  useEffect(() => {
    if (!ready || signedIn) return;
    const next = signingOut.current ? "" : `?next=${encodeURIComponent(pathname)}`;
    router.replace(`${BASE}/login${next}`);
  }, [ready, signedIn, pathname, router]);

  const bottomNav = useMemo(
    () => nav.filter((n) => ["Overview", "Orders", "Products", "Inventory"].includes(n.label)),
    [nav],
  );

  if (!ready) return <Splash message="Loading your dashboard" />;
  if (!signedIn) return <Splash message="Taking you to sign in" />;

  const handleSignOut = () => {
    signingOut.current = true;
    signOut();
  };

  const moreActive = !bottomNav.some((n) => isActive(pathname, n.href));

  return (
    <ToastProvider>
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh bg-[#f6f5f2] font-skin-text text-stone-900">
        <div className="hidden w-60 shrink-0 border-r border-stone-200 bg-[#fbfaf8] lg:block print:hidden">
          <aside className="sticky top-0 flex h-dvh flex-col">
            <div className="flex h-16 items-center px-5">
              <Link
                href={BASE}
                className="rounded-lg focus-visible:outline-2 focus-visible:outline-skin-accent"
                aria-label={`${BRAND.name} dashboard home`}
              >
                <Logo />
              </Link>
            </div>
            <nav aria-label="Dashboard" className="flex-1 overflow-y-auto px-3 py-2">
              <NavList items={nav} pathname={pathname} />
              <div className="mt-6">
                <StoreLinks />
              </div>
            </nav>
            <div className="mx-3 mb-14 rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-xs text-stone-600">
              <p className="font-medium text-stone-800">Demo store</p>
              <p className="mt-0.5">Sample orders and your edits stay in this browser only.</p>
            </div>
          </aside>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur print:hidden">
            <div className="flex h-14 items-center gap-2 px-3 sm:px-5 lg:h-16 lg:px-8">
              <button
                type="button"
                onClick={() => setDrawer(true)}
                aria-label="Open menu"
                className="grid size-9 place-items-center rounded-lg text-stone-700 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-skin-accent lg:hidden"
              >
                <Menu aria-hidden className="size-5" />
              </button>
              <Link
                href={BASE}
                className="rounded-lg focus-visible:outline-2 focus-visible:outline-skin-accent lg:hidden"
                aria-label={`${BRAND.name} dashboard home`}
              >
                <Logo compact />
              </Link>
              <div className="hidden flex-1 md:block lg:max-w-md">
                <GlobalSearch />
              </div>
              <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => setMobileSearch((v) => !v)}
                  aria-expanded={mobileSearch}
                  aria-label={mobileSearch ? "Close search" : "Search"}
                  className="grid size-9 place-items-center rounded-lg text-stone-600 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-skin-accent md:hidden"
                >
                  {mobileSearch ? (
                    <X aria-hidden className="size-[1.15rem]" />
                  ) : (
                    <Search aria-hidden className="size-[1.15rem]" />
                  )}
                </button>
                <Link
                  href="/skincare"
                  target="_blank"
                  className="hidden h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-stone-700 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-skin-accent sm:inline-flex"
                >
                  <Store aria-hidden className="size-4" />
                  View store
                  <span className="sr-only">(opens in a new tab)</span>
                </Link>
                <Notifications />
                <UserMenu onSignOut={handleSignOut} />
              </div>
            </div>
            {mobileSearch ? (
              <div className="border-t border-stone-100 px-3 py-2 md:hidden">
                <GlobalSearch autoFocus onNavigate={() => setMobileSearch(false)} />
              </div>
            ) : null}
          </header>

          <main
            id="admin-main"
            tabIndex={-1}
            className="mx-auto w-full max-w-[1320px] flex-1 px-4 pt-5 pb-28 outline-none sm:px-6 lg:px-8 lg:pt-7 lg:pb-14"
          >
            {children}
          </main>
        </div>
      </div>

      <nav
        aria-label="Dashboard shortcuts"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden print:hidden"
      >
        <ul className="grid grid-cols-5">
          {bottomNav.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-14 flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-skin-accent",
                    active ? "text-skin-accent" : "text-stone-600",
                  )}
                >
                  <Icon aria-hidden className="size-5" />
                  {item.label}
                  {item.badge ? (
                    <span
                      className={cn(
                        "absolute top-1.5 left-1/2 ml-2 min-w-4 rounded-full px-1 text-center text-[0.625rem] leading-4 font-semibold tabular-nums",
                        item.badgeTone === "warn"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-skin-accent text-white",
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-current={moreActive ? "page" : undefined}
              className={cn(
                "flex h-14 w-full flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-skin-accent",
                moreActive ? "text-skin-accent" : "text-stone-600",
              )}
            >
              <Ellipsis aria-hidden className="size-5" />
              More
            </button>
          </li>
        </ul>
      </nav>

      <Overlay
        open={drawer}
        onClose={() => setDrawer(false)}
        kind="drawer-left"
        title={<Logo />}
        bodyClassName="px-3 pt-3"
      >
        <nav aria-label="Dashboard menu">
          <NavList items={nav} pathname={pathname} onNavigate={() => setDrawer(false)} />
          <div className="mt-6">
            <StoreLinks onNavigate={() => setDrawer(false)} />
          </div>
          <div className="mt-6 border-t border-stone-200 pt-3">
            <button
              type="button"
              onClick={() => {
                setDrawer(false);
                handleSignOut();
              }}
              className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              <LogOut aria-hidden className="size-[1.05rem] text-stone-500" />
              Sign out
            </button>
          </div>
        </nav>
      </Overlay>
    </ToastProvider>
  );
}
