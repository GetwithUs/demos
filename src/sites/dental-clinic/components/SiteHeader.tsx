"use client";

import { ArrowRight, Clock, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { CallButton, ChatButton } from "@/sites/dental-clinic/components/ActionButtons";
import Logo from "@/sites/dental-clinic/components/Logo";
import { buttonClasses } from "@/sites/dental-clinic/components/ui";
import { CLINIC, HOURS_SUMMARY } from "@/sites/dental-clinic/content/clinic";
import { MAIN_NAV, MORE_NAV } from "@/sites/dental-clinic/content/nav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname() ?? "";
  const menuRef = useRef<HTMLDialogElement>(null);

  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => menuRef.current?.close();

  return (
    <header className="dental-header-scroll sticky top-0 z-30 border-b border-transparent bg-dental-ivory/88 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[1200px] items-center justify-between gap-6 px-5 sm:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {MAIN_NAV.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3 py-2 text-[0.9375rem] font-medium text-dental-body transition-colors hover:text-dental-ink",
                      "after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-dental-brass after:transition-transform after:duration-300 hover:after:scale-x-100",
                      active && "text-dental-ink after:scale-x-100",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <CallButton
            label={`Call the studio, ${CLINIC.phone} (demo)`}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-[0.9375rem] font-semibold text-dental-ink tabular-nums transition-colors hover:bg-dental-sand xl:inline-flex"
          >
            {CLINIC.phone}
          </CallButton>
          <Link
            href="/dental-clinic/book"
            className={cn(buttonClasses("primary", "md"), "hidden sm:inline-flex")}
          >
            Book appointment
          </Link>
          <button
            type="button"
            onClick={openMenu}
            aria-haspopup="dialog"
            className="grid size-11 place-items-center rounded-full border border-dental-ink/12 bg-dental-paper/70 text-dental-ink transition-colors hover:bg-dental-paper lg:hidden"
          >
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-[min(100vw,26rem)] max-w-none bg-dental-ivory p-0 text-dental-body backdrop:bg-dental-ink/40 backdrop:backdrop-blur-[2px] open:animate-dental-fade"
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pt-4 pb-8">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={closeMenu}
              className="grid size-11 place-items-center rounded-full border border-dental-ink/12 text-dental-ink"
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Main" className="mt-8">
            <ul className="divide-y divide-dental-line/80 border-y border-dental-line/80">
              {MAIN_NAV.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between py-3.5 font-dental-display text-[1.6rem] text-dental-ink",
                        active && "text-dental-spruce italic",
                      )}
                    >
                      {link.label}
                      <ArrowRight aria-hidden="true" className="size-5 text-dental-brass" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-[0.9375rem]">
            {MORE_NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="font-medium text-dental-body underline-offset-4 hover:text-dental-ink hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl bg-dental-paper p-5 shadow-dental-soft">
            <p className="flex items-center gap-2 text-sm font-semibold text-dental-ink">
              <Clock aria-hidden="true" className="size-4 text-dental-brass-deep" />
              Studio timings
            </p>
            <dl className="mt-2 space-y-1 text-sm">
              {HOURS_SUMMARY.map((h) => (
                <div key={h.days} className="flex flex-wrap justify-between gap-x-4">
                  <dt className="text-dental-muted">{h.days}</dt>
                  <dd className="text-dental-ink">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-auto grid gap-2.5 pt-8">
            <Link
              href="/dental-clinic/book"
              onClick={closeMenu}
              className={buttonClasses("primary", "lg")}
            >
              Book an appointment
            </Link>
            <div className="grid grid-cols-2 gap-2.5" onClickCapture={closeMenu}>
              <CallButton className={buttonClasses("secondary", "md")}>Call</CallButton>
              <ChatButton className={buttonClasses("secondary", "md")}>WhatsApp</ChatButton>
            </div>
          </div>
        </div>
      </dialog>
    </header>
  );
}
