"use client";

import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Container } from "./container";
import { siteNav, isNavItemActive, type NavItem } from "./site-nav";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

function Logo({ onClick }: Readonly<{ onClick?: () => void }>) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
      aria-label={`${siteConfig.fullName} home`}
    >
      <Image
        src="/logo.png"
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 object-contain"
        priority
      />
      <span className="flex flex-col leading-tight">
        <span className="text-base font-bold tracking-tight text-navy">Scholars</span>
        <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          School & College
        </span>
      </span>
    </Link>
  );
}

function DesktopNavItem({ item, pathname }: Readonly<{ item: NavItem; pathname: string }>) {
  const active = isNavItemActive(pathname, item.href);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active ? "text-navy" : "text-slate-600"
        )}
        aria-current={active ? "page" : undefined}
      >
        {item.label}
      </Link>
    );
  }

  const hasActiveChild = item.children.some((child) => isNavItemActive(pathname, child.href));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active || hasActiveChild ? "text-navy" : "text-slate-600"
          )}
          type="button"
        >
          {item.label}
          <ChevronDown className="h-4 w-4 opacity-60" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        {item.children.map((child) => (
          <DropdownMenuItem key={child.href} asChild>
            <Link href={child.href} className="flex items-start justify-between">
              <span className="whitespace-nowrap">{child.label}</span>
              {child.description ? (
                <span className="ml-auto pl-4 text-right text-xs text-muted-foreground">
                  {child.description}
                </span>
              ) : null}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center lg:flex lg:gap-1">
          {siteNav.map((item) => (
            <DesktopNavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={siteConfig.applyUrl}>Apply Now</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] max-w-sm overflow-y-auto">
              <SheetHeader className="text-left">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Explore Scholar Higher Secondary School</SheetDescription>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-1">
                {siteNav.map((item) => (
                  <div key={item.href} className="border-b border-border pb-2 last:border-b-0">
                    <SheetClose asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                          isNavItemActive(pathname, item.href) ? "text-navy" : "text-slate-700"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                    {item.children ? (
                      <div className="mt-1 border-l-2 border-navy/10 pl-2">
                        {item.children.map((child) => (
                          <SheetClose asChild key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "block rounded-md px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-navy",
                                isNavItemActive(pathname, child.href)
                                  ? "font-semibold text-navy"
                                  : "text-slate-600"
                              )}
                            >
                              <span className="block">{child.label}</span>
                              {child.description ? (
                                <span className="mt-0.5 block text-xs text-muted-foreground">
                                  {child.description}
                                </span>
                              ) : null}
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href={siteConfig.applyUrl}>Apply Now</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
