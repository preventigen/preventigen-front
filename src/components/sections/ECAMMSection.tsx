"use client";

import type { ReactNode } from "react";
import {
  BellRing,
  ClipboardCheck,
  LineChart,
  Stethoscope,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BentoGrid } from "@/components/ui/bento-grid";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";

const features = [
  {
    title: "Ordena lo importante",
    text: "Convierte información dispersa en un resumen claro y útil.",
    Icon: ClipboardCheck,
  },
  {
    title: "Prioriza señales y alertas",
    text: "Destaca lo que requiere atención para no pasar nada por alto.",
    Icon: BellRing,
  },
  {
    title: "Acompaña el seguimiento",
    text: "Permite ver cambios a lo largo del tiempo y comparar evolución.",
    Icon: LineChart,
  },
  {
    title: "Asiste al profesional",
    text: "Brinda soporte para decidir con más contexto, sin reemplazar el juicio clínico.",
    Icon: Stethoscope,
  },
];

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
      <div className={`lg:hidden ${outer} ${className}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
                     bg-[radial-gradient(34rem_24rem_at_15%_10%,rgba(45,212,191,0.12),transparent_55%)]"
        />
        <div className={panel}>{children}</div>
      </div>

      <MagicCard
        className={`hidden lg:block ${outer} ${className}`}
        gradientFrom="var(--color-accent)"
        gradientTo="var(--color-primary)"
        gradientColor="var(--color-accent)"
        gradientOpacity={accent ? 0.16 : 0.12}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent"
        />
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

function FeatureMiniCard({
  title,
  text,
  Icon,
}: {
  title: string;
  text: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/80 bg-background/55 p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm hover:border-accent/25">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
                   bg-[radial-gradient(22rem_14rem_at_18%_10%,rgba(45,212,191,0.10),transparent_60%)]"
      />
      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/20">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-heading font-medium leading-snug">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ECAMMSection() {
  return (
    <section
      id="ecamm"
      className="scroll-mt-24 py-16 sm:py-20 relative overflow-hidden"
    >
      {/* Fondo leve para que se perciba como sección “producto” */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-surface-muted/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[-8%] h-72 w-72 rounded-full bg-accent/10 blur-3xl -z-10"
      />

      <Container>
        <SectionHeader
          title="ECAMM: asistencia clínica para prevenir mejor"
          subtitle="ECAMM es un sistema de apoyo que ayuda a ordenar información, priorizar alertas y ofrecer una visión clara para que el profesional pueda acompañarte mejor en tu prevención."
        />

        <BentoGrid className="mt-10 grid-cols-1 auto-rows-auto gap-5 lg:grid-cols-6">
          {/* Lo que aporta */}
          <BlurFade inView delay={0.06} className="lg:col-span-3">
            <SurfaceCard className="lg:col-span-3">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-heading font-semibold">Lo que aporta</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Orden, prioridad y seguimiento en un mismo flujo de trabajo.
                  </p>
                </div>

                {/* watermark */}
                <div
                  aria-hidden="true"
                  className="select-none text-5xl font-semibold tracking-tight text-heading/5"
                >
                  EC
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {features.map((f, idx) => (
                  <BlurFade key={f.title} inView delay={0.10 + idx * 0.04}>
                    <FeatureMiniCard {...f} />
                  </BlurFade>
                ))}
              </div>

              <div className="mt-5 h-px w-20 bg-gradient-to-r from-border-strong/70 to-transparent" />
            </SurfaceCard>
          </BlurFade>

          {/* Importante (disclaimer clínico real) */}
          <BlurFade inView delay={0.12} className="lg:col-span-3">
            <SurfaceCard className="lg:col-span-3" accent>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent ring-1 ring-accent/20">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-heading font-semibold">Importante</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Apoyo a la decisión clínica, no reemplazo.
                  </p>
                </div>
              </div>

              <p className="mt-4 text-heading font-medium leading-relaxed">
                La decisión final siempre es médica. ECAMM acompaña, no diagnostica ni
                indica tratamientos.
              </p>

              <div className="mt-5 rounded-xl border border-accent/20 bg-background/45 p-4">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="mt-0.5 h-5 w-5 text-accent" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    La información se presenta para facilitar comprensión y seguimiento,
                    siempre en contexto profesional.
                  </p>
                </div>
              </div>
            </SurfaceCard>
          </BlurFade>

          {/* Mock dashboard: que parezca “producto” */}
          <BlurFade inView delay={0.18} className="lg:col-span-6">
            <SurfaceCard className="lg:col-span-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-heading font-semibold">
                    Vista previa ilustrativa (mock)
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tablero de resumen clínico + alertas + seguimiento.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    Resumen
                  </span>
                  <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    Alertas
                  </span>
                  <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    Evolución
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border/80 bg-background/50 p-4">
                {/* barra superior tipo app */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-border-strong/60" />
                    <span className="h-2 w-2 rounded-full bg-border-strong/60" />
                    <span className="h-2 w-2 rounded-full bg-border-strong/60" />
                  </div>
                  <p className="text-xs text-muted-foreground">ECAMM • Panel</p>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-border bg-surface-muted/60 p-4">
                    <p className="text-xs text-muted-foreground">Alerta</p>
                    <p className="mt-1 font-semibold text-danger">Señal a revisar</p>
                    <div className="mt-3 h-1.5 w-24 rounded-full bg-danger/15" />
                  </div>

                  <div className="rounded-xl border border-border bg-surface-muted/60 p-4">
                    <p className="text-xs text-muted-foreground">Resumen</p>
                    <p className="mt-1 font-semibold text-heading">Información clave</p>
                    <div className="mt-3 h-1.5 w-28 rounded-full bg-accent/15" />
                  </div>

                  <div className="rounded-xl border border-border bg-surface-muted/60 p-4">
                    <p className="text-xs text-muted-foreground">Seguimiento</p>
                    <p className="mt-1 font-semibold text-heading">Evolución</p>
                    <div className="mt-3 flex gap-1">
                      <div className="h-6 w-2 rounded bg-accent/20" />
                      <div className="h-8 w-2 rounded bg-accent/25" />
                      <div className="h-5 w-2 rounded bg-accent/15" />
                      <div className="h-9 w-2 rounded bg-accent/30" />
                      <div className="h-7 w-2 rounded bg-accent/22" />
                    </div>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          </BlurFade>
        </BentoGrid>
      </Container>
    </section>
  );
}
