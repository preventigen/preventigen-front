"use client";

import { useEffect, useMemo, useState } from "react";
import { MenuIcon } from "lucide-react";
import { Container } from "./ui/Container";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollProgress } from "@/components/ui/scroll-progress";

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
      { label: "Preguntas", href: "#preguntas" },
      { label: "Contacto", href: "#contacto" },
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

            {/* Desktop links */}
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

              <Button asChild className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
                <a href="#contacto">Solicitar contacto</a>
              </Button>
            </div>

            {/* Mobile */}
            {mounted ? (
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button
                    className="lg:hidden inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"
                    aria-label="Abrir menú"
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
                      <Button asChild className="w-full">
                        <a href="#contacto" onClick={() => setOpen(false)}>
                          Solicitar contacto
                        </a>
                      </Button>
                      <p className="mt-3 text-xs text-muted-foreground">
                        No es atención de urgencias. Te contactamos para orientarte.
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <button
                className="lg:hidden inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"
                aria-label="Abrir menú"
                type="button"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            )}
          </nav>
        </Container>
      </header>
      <ScrollProgress className="top-16 z-40 h-[2px] bg-gradient-to-r from-primary via-accent to-primary/70" />
    </>
  );
}
