"use client";

import { useMemo, useState } from "react";
import { MenuIcon } from "lucide-react";
import { Container } from "./ui/Container";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/src/components/magic/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/magic/ui/sheet";
import { ScrollProgress } from "@/src/components/magic/ui/scroll-progress";
import { ShimmerButton } from "@/src/components/magic/ui/shimmer-button";

type NavItem = { label: string; href: string };

export function Navbar() {
  const items: NavItem[] = useMemo(
    () => [
      { label: "Qué es", href: "#que-es" },
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "ECAMM", href: "#ecamm" },
      { label: "Gemelo Digital", href: "#gemelo" },
      { label: "IA aplicada", href: "#ia" },
      { label: "Equipo médico", href: "#equipo" },
      { label: "Preguntas", href: "#preguntas" }
    ],
    []
  );

  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-heading/90 backdrop-blur">
        <Container className="flex h-16 items-center">
          <nav className="flex w-full items-center justify-between" aria-label="Navegación principal">
            {/* Brand */}
            <a href="#top" className="flex items-center gap-2 text-white">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-accent">
                PG
              </span>
              <span className="font-semibold tracking-tight">PreventiGen</span>
            </a>

            {/* Desktop */}
            <div className="hidden items-center gap-4 lg:flex">
              <NavigationMenu viewport={false} className="text-white">
                <NavigationMenuList className="gap-1">
                  {items.map((it) => (
                    <NavigationMenuItem key={it.href}>
                      <NavigationMenuLink
                        href={it.href}
                        className="rounded-md px-3 py-2 text-sm text-white/80 transition hover:text-white focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-heading"
                      >
                        {it.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              {/* CTA (igual al Hero) */}
              <a href="#contacto" className="shrink-0">
                <ShimmerButton
                  shimmerColor="rgba(255, 255, 255, 0.35)"
                  shimmerDuration="4.5s"
                  shimmerSize="0.12em"
                  borderRadius="14px"
                  background="var(--color-primary)"
                  className="h-10 px-5 text-sm font-medium text-primary-foreground shadow-sm"
                >
                  Solicitar contacto
                </ShimmerButton>
              </a>
            </div>

            {/* Mobile */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"
                  aria-label="Abrir menú"
                  type="button"
                >
                  <MenuIcon className="h-5 w-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="right" className="border-border bg-surface">
                <SheetHeader>
                  <SheetTitle className="text-heading">Menú</SheetTitle>
                </SheetHeader>

                <div className="px-4 pb-6">
                  <ul className="flex flex-col gap-3">
                    {items.map((it) => (
                      <li key={it.href}>
                        <a
                          href={it.href}
                          className="block rounded-xl px-3 py-2 text-foreground hover:bg-surface-muted"
                          onClick={() => setOpen(false)}
                        >
                          {it.label}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <a href="#contacto" onClick={() => setOpen(false)} className="block w-full">
                      <ShimmerButton
                        shimmerColor="rgba(255, 255, 255, 0.35)"
                        shimmerDuration="4.5s"
                        shimmerSize="0.12em"
                        borderRadius="14px"
                        background="var(--color-primary)"
                        className="h-11 w-full px-6 text-sm font-medium text-primary-foreground shadow-sm"
                      >
                        Solicitar contacto
                      </ShimmerButton>
                    </a>

                    <p className="mt-3 text-xs text-muted-foreground">
                      No es atención de urgencias. Te contactamos para orientarte.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </Container>
      </header>

      <ScrollProgress className="top-16 z-40 h-[2px] bg-gradient-to-r from-primary via-accent to-primary/70" />
    </>
  );
}
