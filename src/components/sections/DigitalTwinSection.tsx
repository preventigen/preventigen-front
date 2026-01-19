"use client";

import type { ReactNode } from "react";
import {
  Braces,
  BrainCircuit,
  Dna,
  FileText,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BentoGrid } from "@/components/ui/bento-grid";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";

function SurfaceCard({
  children,
  className = "",
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  const base = accent
    ? "rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 via-surface/80 to-primary/5 p-6 shadow-sm backdrop-blur-sm"
    : "rounded-2xl border border-border/80 bg-surface/70 p-6 shadow-sm backdrop-blur-sm";

  return (
    <>
      <div className={`lg:hidden ${base} ${className}`}>{children}</div>
      <MagicCard
        className={`hidden lg:block rounded-2xl ${className}`}
        gradientFrom="var(--color-accent)"
        gradientTo="var(--color-primary)"
        gradientColor="var(--color-accent)"
        gradientOpacity={accent ? 0.16 : 0.12}
      >
        <div className={base}>{children}</div>
      </MagicCard>
    </>
  );
}

function Chip({
  icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="group flex items-center gap-2 rounded-xl border border-border/80 bg-background/60 px-4 py-3 text-sm text-foreground shadow-[0_1px_0_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:bg-accent/5">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/20">
        <Icon className="h-4 w-4" />
      </span>
      <span className="leading-snug">{children}</span>
    </div>
  );
}

function FlowStep({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const Icon = icon;
  return (
    <div className="relative rounded-2xl border border-border/80 bg-background/55 p-4 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/20">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-heading font-medium leading-snug">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export function DigitalTwinSection() {
  return (
    <section
      id="gemelo"
      className="scroll-mt-24 py-16 sm:py-20 relative overflow-hidden"
    >
      {/* Fondo con presencia (sin exagerar) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-surface-muted/45 via-background to-background"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-[-10%] h-80 w-80 rounded-full bg-accent/10 blur-3xl -z-10"
      />

      <Container>
        <SectionHeader
          title="Gemelo Digital: un modelo clínico virtual"
          subtitle="Tu gemelo digital es una representación clínica construida a partir de datos relevantes para comprender tu estado de salud y explorar escenarios de forma segura."
        />

        <BentoGrid className="mt-10 grid-cols-1 auto-rows-auto gap-5 lg:grid-cols-6">
          {/* IZQUIERDA: “Hero card” del concepto */}
          <BlurFade inView delay={0.05} className="lg:col-span-4">
            <SurfaceCard className="lg:col-span-4">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    Modelo clínico con datos relevantes
                  </div>

                  <h3 className="mt-3 text-heading text-xl font-semibold">
                    Una visión integrada para tomar decisiones con más contexto
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    Reúne información clínica y su evolución para ayudarte a comprender tu estado de salud
                    y conversar con un profesional con mayor claridad.
                  </p>
                </div>

                {/* watermark */}
                <div
                  aria-hidden="true"
                  className="hidden sm:block select-none text-6xl font-semibold tracking-tight text-heading/5"
                >
                  GD
                </div>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {/* Qué incluye */}
                <div className="rounded-2xl border border-border/70 bg-background/45 p-5">
                  <p className="text-sm font-semibold text-heading">Qué incluye</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Datos que aportan una lectura clínica más completa.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Chip icon={FileText}>Laboratorios y biomarcadores</Chip>
                    <Chip icon={Braces}>Historial clínico y antecedentes</Chip>
                    <Chip icon={TrendingUp}>Evolución en el tiempo</Chip>
                    <Chip icon={Dna}>Genética (si corresponde)</Chip>
                  </div>
                </div>

                {/* Para qué sirve */}
                <div className="rounded-2xl border border-border/70 bg-background/45 p-5">
                  <p className="text-sm font-semibold text-heading">Para qué sirve</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Un apoyo para prevención y seguimiento, sin intervenir en el cuerpo.
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-border bg-surface-muted/50 p-4">
                      <p className="text-sm font-medium text-heading">
                        Explorar escenarios con criterio clínico
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Simular hipótesis y comprender posibles trayectorias de forma informada.
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface-muted/50 p-4">
                      <p className="text-sm font-medium text-heading">
                        Seguimiento más preciso en el tiempo
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Ver cambios, comparar evolución y sostener un plan preventivo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          </BlurFade>

          {/* DERECHA: flujo protagonista + aclaración */}
          <BlurFade inView delay={0.12} className="lg:col-span-2">
            <SurfaceCard className="lg:col-span-2" accent>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent ring-1 ring-accent/20">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-heading font-semibold">Cómo se construye</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Un flujo simple para convertir datos en una vista clínica útil.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <FlowStep
                  icon={FileText}
                  title="Datos clínicos + biomarcadores"
                  subtitle="Información relevante organizada para lectura clara."
                />
                <div className="text-center text-muted-foreground">→</div>
                <FlowStep
                  icon={BrainCircuit}
                  title="Modelo clínico virtual"
                  subtitle="Representación integrada (gemelo digital)."
                />
                <div className="text-center text-muted-foreground">→</div>
                <FlowStep
                  icon={TrendingUp}
                  title="Escenarios + seguimiento preventivo"
                  subtitle="Comparación en el tiempo y soporte para prevención."
                />
              </div>

              {/* Aclaración clínica (callout real) */}
              <div className="mt-6 rounded-2xl border border-accent/20 bg-background/45 p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-accent" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-heading">
                      Aclaración importante
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li>• No es una persona digital.</li>
                      <li>• No decide por vos.</li>
                      <li>• No reemplaza la evaluación médica.</li>
                    </ul>
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
