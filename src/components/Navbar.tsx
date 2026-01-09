"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "./ui/Container";
import { PrimaryButton } from "./ui/PrimaryButton";

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-heading/90 backdrop-blur">
      <Container className="py-3">
        <nav className="flex items-center justify-between" aria-label="Navegación principal">
          {/* Brand */}
          <a href="#top" className="flex items-center gap-2 text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-accent">
              PG
            </span>
            <span className="font-semibold tracking-tight">PreventiGen</span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 lg:flex">
            <ul className="flex items-center gap-5 text-sm text-white/85">
              {items.map((it) => (
                <li key={it.href}>
                  <a className="hover:text-white transition" href={it.href}>
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>

            <a href="#contacto">
              <PrimaryButton className="h-10 px-4 py-2">Solicitar contacto</PrimaryButton>
            </a>
          </div>

          {/* Mobile */}
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </nav>
      </Container>

      {/* Mobile drawer */}
      {open ? (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed right-0 top-0 z-50 h-full w-[88%] max-w-sm border-l border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <span className="text-heading font-semibold">Menú</span>
              <button
                className="rounded-xl border border-border bg-surface px-3 py-2 text-heading"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
              >
                ✕
              </button>
            </div>

            <div className="px-4 py-4">
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
                <a href="#contacto" onClick={() => setOpen(false)}>
                  <PrimaryButton className="w-full">Solicitar contacto</PrimaryButton>
                </a>
                <p className="mt-3 text-xs text-muted">
                  No es atención de urgencias. Te contactamos para orientarte.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
