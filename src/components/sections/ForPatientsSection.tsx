"use client";

import type { ReactNode } from "react";
import {
  HeartPulse,
  ShieldCheck,
  Route,
  UserRoundCheck,
  Sparkles,
  Check,
} from "lucide-react";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BlurFade } from "@/src/components/magic/ui/blur-fade";
import { MagicCard } from "@/src/components/magic/ui/magic-card";

type Benefit = {
  title: string;
  text: string;
  Icon: React.ComponentType<{ className?: string }>;
  tag: string;
};

const benefits: Benefit[] = [
  {
    title: "Entender tu salud con claridad",
    text: "Una visión integral para tomar decisiones con más confianza.",
    Icon: Sparkles,
    tag: "Claridad",
  },
  {
    title: "Anticiparte a riesgos",
    text: "Señales tempranas para actuar antes, con orientación profesional.",
    Icon: Route,
    tag: "Prevención",
  },
  {
    title: "Plan personalizado",
    text: "Recomendaciones adaptadas a tu perfil y evolución en el tiempo.",
    Icon: HeartPulse,
    tag: "Plan",
  },
  {
    title: "Acompañamiento profesional",
    text: "Un enfoque humano, con criterio médico y seguimiento.",
    Icon: UserRoundCheck,
    tag: "Acompañamiento",
  },
];

function BadgeMini({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function BenefitCard({ item }: { item: Benefit }) {
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
          <Check className="h-4 w-4 text-accent" />
          Orientación clara, sin urgencias
        </div>
      </div>
    </MagicCard>
  );
}

export function ForPatientsSection() {
  return (
    <section className="py-16 sm:py-20 relative overflow-hidden bg-surface-muted/40">
      {/* Fondo sutil para que se sienta “sección de conversión” */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-surface-muted/40 via-background to-background"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-[-10%] h-80 w-80 rounded-full bg-accent/10 blur-3xl -z-10"
      />

      <Container>
        <SectionHeader
          title="Pensado para vos"
          subtitle="Más claridad, menos incertidumbre. Prevención con acompañamiento."
        />

        {/* Layout con panel protagonista + grid */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* Panel protagonista (impacto marketing) */}
          <BlurFade inView delay={0.04} className="lg:col-span-5">
            <MagicCard
              className="rounded-3xl"
              gradientFrom="var(--color-accent)"
              gradientTo="var(--color-primary)"
              gradientColor="var(--color-accent)"
              gradientOpacity={0.16}
            >
              <div className="rounded-3xl border border-border/80 bg-surface/70 p-7 shadow-sm backdrop-blur-sm">
                <BadgeMini>Paciente • Prevención</BadgeMini>

                <h3 className="mt-4 text-heading text-2xl font-semibold leading-tight">
                  Una forma más simple de entender tu salud y tomar decisiones a tiempo.
                </h3>

                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Combinamos información clínica y tecnología para darte una visión clara,
                  con acompañamiento profesional durante el proceso.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/50 p-4">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/20">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-heading">Confidencialidad</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Cuidado de datos y acceso por roles.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/50 p-4">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/12 text-accent ring-1 ring-accent/20">
                      <HeartPulse className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-heading">Criterio médico</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Apoyo tecnológico, decisión clínica.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Callout tipo “mini quote” integrado */}
                <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/10 p-5">
                  <p className="text-heading font-medium">
                    “La prevención empieza con información clara y decisiones a tiempo.”
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Te orientamos en el primer paso. No es atención de urgencias.
                  </p>
                </div>
              </div>
            </MagicCard>
          </BlurFade>

          {/* Grid beneficios */}
          <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
            {benefits.map((item, idx) => (
              <BlurFade key={item.title} inView delay={0.08 + idx * 0.06}>
                <BenefitCard item={item} />
              </BlurFade>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
