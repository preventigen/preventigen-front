"use client";

import type { ReactNode } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BentoGrid } from "@/src/components/magic/ui/bento-grid";
import { MagicCard } from "@/src/components/magic/ui/magic-card";
import { BlurFade } from "@/src/components/magic/ui/blur-fade";

function SurfaceCard({
  children,
  className = "",
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  const panel = accent
    ? "rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 via-surface/80 to-primary/5 p-6 shadow-sm backdrop-blur-sm"
    : "rounded-2xl border border-border/80 bg-surface/70 p-6 shadow-sm backdrop-blur-sm";

  const outer =
    "group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md";

  return (
    <>
      {/* Mobile / tablet */}
      <div className={`lg:hidden ${outer} ${className}`}>
        {/* hairline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
        />
        {/* glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
                     bg-[radial-gradient(34rem_24rem_at_15%_10%,rgba(45,212,191,0.12),transparent_55%)]"
        />
        <div className={panel}>{children}</div>
      </div>

      {/* Desktop */}
      <MagicCard
        className={`hidden lg:block ${outer} ${className}`}
        gradientFrom="var(--color-accent)"
        gradientTo="var(--color-primary)"
        gradientColor="var(--color-accent)"
        gradientOpacity={accent ? 0.16 : 0.12}
      >
        {/* hairline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
        />
        {/* glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
                     bg-[radial-gradient(34rem_24rem_at_15%_10%,rgba(45,212,191,0.12),transparent_55%)]"
        />
        <div className={panel}>{children}</div>
      </MagicCard>
    </>
  );
}

export function WhatIsPreventiGen() {
  return (
    <section
      id="que-es"
      className="scroll-mt-24 py-16 sm:py-20 relative overflow-hidden"
    >
      {/* Fondo suave para que sea sección “real” y no plana */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-surface-muted/45 via-background to-background"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-accent/10 blur-3xl -z-10"
      />

      <Container>
        <SectionHeader
          title="Qué es PreventiGen"
          subtitle="PreventiGen es una plataforma de medicina preventiva que integra datos clínicos y tecnología para identificar señales tempranas, comprender predisposiciones y acompañar un plan de cuidado personalizado."
        />

        <BentoGrid className="mt-10 grid-cols-1 auto-rows-auto gap-5 lg:grid-cols-6">
          {/* Beneficios */}
          <BlurFade inView delay={0.06} className="lg:col-span-4">
            <SurfaceCard className="lg:col-span-4">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-heading font-semibold">Beneficios</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Claridad para decidir con más información y acompañamiento.
                  </p>
                </div>

                {/* watermark sutil */}
                <div
                  aria-hidden="true"
                  className="select-none text-6xl font-semibold tracking-tight text-heading/5"
                >
                  PG
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  "Claridad sobre tu salud con una visión integral.",
                  "Prevención y detección temprana de riesgos.",
                  "Plan personalizado con seguimiento y acompañamiento.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
                    <p className="text-foreground leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-5 h-px w-20 bg-gradient-to-r from-border-strong/70 to-transparent" />
            </SurfaceCard>
          </BlurFade>

          {/* Importante */}
          <BlurFade inView delay={0.12} className="lg:col-span-2">
            <SurfaceCard className="lg:col-span-2" accent>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent ring-1 ring-accent/20">
                  <ShieldAlert className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-heading font-semibold">Importante</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tecnología de apoyo, con criterio clínico.
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {[
                  "No reemplaza la consulta médica ni el criterio profesional.",
                  "No realiza diagnósticos automáticos.",
                  "No brinda atención para emergencias o urgencias.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent/70" />
                    <p className="text-foreground leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl border border-accent/20 bg-background/40 p-3 text-sm text-muted-foreground">
                Ante una urgencia, acudí a un servicio médico o de emergencias.
              </div>
            </SurfaceCard>
          </BlurFade>
        </BentoGrid>
      </Container>
    </section>
  );
}
