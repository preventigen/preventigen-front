"use client";

import type { ReactNode } from "react";
import {
  BrainCircuit,
  Layers,
  Radar,
  ShieldCheck,
  UserCheck,
  Fingerprint,
  Workflow,
} from "lucide-react";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BentoGrid } from "@/components/ui/bento-grid";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";

const aiBlocks = [
  {
    title: "Estructuración de información clínica",
    text: "La IA ayuda a ordenar y comprender información relevante para una lectura más clara y completa.",
    Icon: Layers,
    tag: "Estructura",
  },
  {
    title: "Priorización de señales y alertas",
    text: "Identifica patrones y resalta lo importante para apoyar el seguimiento y la prevención.",
    Icon: Radar,
    tag: "Señales",
  },
  {
    title: "Seguimiento longitudinal",
    text: "Facilita observar cambios a lo largo del tiempo y entender evolución con más contexto.",
    Icon: Workflow,
    tag: "Evolución",
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

function BadgeMini({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function CheckItem({
  icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  const Icon = icon;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/50 p-4">
      <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/20">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <p className="text-sm text-foreground leading-relaxed">{children}</p>
    </div>
  );
}

export function AIDataSection() {
  return (
    <section
      id="ia"
      className="scroll-mt-24 py-16 sm:py-20 relative overflow-hidden"
    >
      {/* Fondo con presencia “IA” (muy sutil) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-surface-muted/35 via-background to-background"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[-10%] h-80 w-80 rounded-full bg-accent/10 blur-3xl -z-10"
      />

      <Container>
        <SectionHeader
          title="IA aplicada a tu prevención"
          subtitle="Tecnología diseñada para transformar datos en información útil, con un enfoque clínico y responsable."
        />

        <BentoGrid className="mt-10 grid-cols-1 auto-rows-auto gap-5 lg:grid-cols-6">
          {/* Cards IA */}
          {aiBlocks.map((block, idx) => (
            <BlurFade
              key={block.title}
              inView
              delay={idx * 0.06}
              className="lg:col-span-2"
            >
              <SurfaceCard className="lg:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/20">
                      <block.Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <BadgeMini>IA • {block.tag}</BadgeMini>
                      <h3 className="mt-3 text-heading font-semibold leading-snug">
                        {block.title}
                      </h3>
                    </div>
                  </div>

                  {/* detalle visual */}
                  <div
                    aria-hidden="true"
                    className="h-10 w-10 rounded-full bg-primary/10 blur-xl"
                  />
                </div>

                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {block.text}
                </p>

                <div className="mt-5 rounded-xl border border-border/70 bg-background/50 px-4 py-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-accent" />
                    Apoyo a la lectura clínica. No reemplaza criterio médico.
                  </span>
                </div>
              </SurfaceCard>
            </BlurFade>
          ))}

          {/* Confianza y privacidad */}
          <BlurFade inView delay={0.22} className="lg:col-span-6">
            <SurfaceCard className="lg:col-span-6" accent>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <BadgeMini>Confianza</BadgeMini>
                  <h3 className="mt-3 text-heading text-lg font-semibold">
                    Confianza y privacidad
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                    Diseñado con cuidado de datos y controles de acceso, para acompañar el seguimiento de forma responsable.
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className="hidden sm:block select-none text-5xl font-semibold tracking-tight text-heading/5"
                >
                  IA
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <CheckItem icon={ShieldCheck}>
                  Confidencialidad y cuidado de datos
                </CheckItem>
                <CheckItem icon={UserCheck}>
                  Acceso por roles
                </CheckItem>
                <CheckItem icon={Fingerprint}>
                  Trazabilidad de acciones
                </CheckItem>
                <CheckItem icon={BrainCircuit}>
                  Enfoque de apoyo, no reemplazo clínico
                </CheckItem>
              </div>
            </SurfaceCard>
          </BlurFade>
        </BentoGrid>
      </Container>
    </section>
  );
}
