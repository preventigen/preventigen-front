"use client";

import { ClipboardList, FileCheck2, LineChart } from "lucide-react";
import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BlurFade } from "@/components/ui/blur-fade";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    n: "01",
    title: "Solicitás contacto",
    text: "Te orientamos y coordinamos una evaluación inicial.",
    Icon: ClipboardList,
  },
  {
    n: "02",
    title: "Reunimos información relevante",
    text: "Historial clínico, biomarcadores y genética si aplica, para una visión completa.",
    Icon: LineChart,
  },
  {
    n: "03",
    title: "Recibís un informe claro + plan",
    text: "Resultados comprensibles, recomendaciones personalizadas y seguimiento.",
    Icon: FileCheck2,
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 py-16 sm:py-20 relative overflow-hidden"
    >
      {/* Fondo sutil para que no sea “plano” (sobrio, médico) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-accent/5 via-background to-background"
      />

      <Container>
        <SectionHeader
          title="Cómo funciona"
          subtitle="Un proceso simple, guiado y con acompañamiento profesional."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, idx) => (
            <BlurFade key={step.title} inView delay={idx * 0.08}>
              <Card className="group relative h-full overflow-hidden border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-accent/30">
                {/* Hairline premium arriba */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
                />

                {/* Glow sutil en hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
                             bg-[radial-gradient(38rem_28rem_at_20%_10%,rgba(45,212,191,0.14),transparent_55%)]"
                />

                {/* Número watermark */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-5 select-none text-5xl font-semibold tracking-tight text-heading/5"
                >
                  {step.n}
                </div>

                <CardContent className="relative pt-0">
                  <div className="flex items-start gap-4">
                    {/* Icon container con look tech sobrio */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl
                                    bg-gradient-to-br from-accent/15 to-primary/10
                                    text-accent ring-1 ring-accent/20
                                    transition-transform duration-300 group-hover:scale-[1.03]">
                      <step.Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Paso {step.n}
                      </p>

                      <h3 className="mt-2 text-heading font-semibold leading-snug">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-muted-foreground leading-relaxed">
                        {step.text}
                      </p>

                      {/* Micro detalle: separador suave para “estructura” */}
                      <div className="mt-4 h-px w-16 bg-gradient-to-r from-border-strong/70 to-transparent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      </Container>
    </section>
  );
}
