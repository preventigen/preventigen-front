"use client";

import type { ReactNode } from "react";
import {
  Stethoscope,
  Users,
  HeartHandshake,
  CheckCircle2,
  ShieldCheck,
  ClipboardList,
  FileSearch,
  LineChart,
} from "lucide-react";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BlurFade } from "@/components/ui/blur-fade";
import { MagicCard } from "@/components/ui/magic-card";

type Pillar = {
  title: string;
  text: string;
  Icon: React.ComponentType<{ className?: string }>;
  tag: string;
};

const pillars: Pillar[] = [
  {
    title: "Equipo médico",
    text: "Prevención, evaluación y acompañamiento clínico.",
    Icon: Stethoscope,
    tag: "Clínica",
  },
  {
    title: "Especialistas",
    text: "Interpretación de estudios, biomarcadores y contexto clínico.",
    Icon: Users,
    tag: "Expertise",
  },
  {
    title: "Acompañamiento",
    text: "Seguimiento y orientación para sostener el plan en el tiempo.",
    Icon: HeartHandshake,
    tag: "Seguimiento",
  },
];

type Step = {
  title: string;
  text: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const methodology: Step[] = [
  {
    title: "Evaluación clínica inicial",
    text: "Relevamos antecedentes, síntomas, objetivos y contexto para enfocar el plan.",
    Icon: ClipboardList,
  },
  {
    title: "Interpretación de información relevante",
    text: "Leemos estudios, biomarcadores y tendencias para priorizar lo importante.",
    Icon: FileSearch,
  },
  {
    title: "Seguimiento y ajustes",
    text: "Monitoreo longitudinal y ajustes según evolución, con criterio profesional.",
    Icon: LineChart,
  },
];

function BadgeMini({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function PillarCard({ item }: { item: Pillar }) {
  const Icon = item.Icon;

  return (
    <MagicCard
      className="rounded-2xl"
      gradientFrom="var(--color-accent)"
      gradientTo="var(--color-primary)"
      gradientColor="var(--color-accent)"
      gradientOpacity={0.12}
    >
      <div className="group rounded-2xl border border-border/80 bg-surface/70 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/20">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <BadgeMini>{item.tag}</BadgeMini>
              <h3 className="mt-3 text-heading font-semibold leading-snug">
                {item.title}
              </h3>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="h-10 w-10 rounded-full bg-primary/10 blur-xl opacity-0 transition group-hover:opacity-100"
          />
        </div>

        <p className="mt-3 text-muted-foreground leading-relaxed">{item.text}</p>

        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          Enfoque clínico y preventivo
        </div>
      </div>
    </MagicCard>
  );
}

function TimelineStep({ step, idx }: { step: Step; idx: number }) {
  const Icon = step.Icon;

  return (
    <div className="relative flex gap-4">
      {/* Line */}
      <div className="relative flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/20">
          <Icon className="h-5 w-5" />
        </div>
        <div className="mt-2 h-full w-px bg-border" />
      </div>

      {/* Content */}
      <div className="pb-8">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Paso {String(idx + 1).padStart(2, "0")}
        </p>
        <h4 className="mt-2 text-heading font-semibold">{step.title}</h4>
        <p className="mt-2 text-muted-foreground leading-relaxed">{step.text}</p>
      </div>
    </div>
  );
}

export function MedicalCredibilitySection() {
  return (
    <section id="equipo" className="scroll-mt-24 py-16 sm:py-20 relative overflow-hidden">
      {/* Fondo sutil para darle identidad de “confianza” */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-surface-muted/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-[-10%] h-72 w-72 rounded-full bg-accent/10 blur-3xl -z-10"
      />

      <Container>
        <SectionHeader
          title="Equipo médico"
          subtitle="Un enfoque clínico orientado a la prevención, con profesionales especializados y una metodología centrada en comprensión, seguimiento y cuidado."
        />

        {/* 3 pilares */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {pillars.map((item, idx) => (
            <BlurFade key={item.title} inView delay={idx * 0.06}>
              <PillarCard item={item} />
            </BlurFade>
          ))}
        </div>

        {/* Bloque inferior: metodología + confianza */}
        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          {/* Metodología como timeline */}
          <BlurFade inView delay={0.18} className="lg:col-span-8">
            <MagicCard
              className="rounded-3xl"
              gradientFrom="var(--color-accent)"
              gradientTo="var(--color-primary)"
              gradientColor="var(--color-accent)"
              gradientOpacity={0.12}
            >
              <div className="rounded-3xl border border-border/80 bg-surface/70 p-7 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <BadgeMini>Cómo trabajamos</BadgeMini>
                    <h3 className="mt-3 text-heading text-xl font-semibold">
                      Metodología clara, paso a paso
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Para que sepas qué esperar en cada etapa del proceso.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  {methodology.map((step, idx) => (
                    <BlurFade key={step.title} inView delay={0.22 + idx * 0.06}>
                      <TimelineStep step={step} idx={idx} />
                    </BlurFade>
                  ))}
                </div>
              </div>
            </MagicCard>
          </BlurFade>

          {/* Trust callout (clave en medicina) */}
          <BlurFade inView delay={0.26} className="lg:col-span-4">
            <MagicCard
              className="rounded-3xl"
              gradientFrom="var(--color-accent)"
              gradientTo="var(--color-primary)"
              gradientColor="var(--color-accent)"
              gradientOpacity={0.16}
            >
              <div className="rounded-3xl border border-accent/25 bg-accent/10 p-7 shadow-sm backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-background/60 text-accent ring-1 ring-accent/20">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <BadgeMini>Confianza</BadgeMini>
                    <h3 className="mt-3 text-heading text-lg font-semibold">
                      Decisión médica, apoyo tecnológico
                    </h3>
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-sm text-foreground">
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-accent">•</span>
                    La decisión final siempre es clínica.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-accent">•</span>
                    No reemplaza la consulta médica.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-0.5 text-accent">•</span>
                    No es atención de urgencias.
                  </li>
                </ul>

                <div className="mt-6 rounded-2xl border border-border/70 bg-background/50 p-4">
                  <p className="text-xs text-muted-foreground">
                    Objetivo
                  </p>
                  <p className="mt-1 text-heading font-medium">
                    Claridad, seguimiento y acompañamiento preventivo.
                  </p>
                </div>
              </div>
            </MagicCard>
          </BlurFade>
        </div>
      </Container>
    </section>
  );
}
