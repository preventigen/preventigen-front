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
    <section id="como-funciona" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="Cómo funciona"
          subtitle="Un proceso simple, guiado y con acompañamiento profesional."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, idx) => (
            <BlurFade key={step.title} inView delay={idx * 0.08}>
              <Card className="border-border bg-surface shadow-sm">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <step.Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{step.n}</p>
                      <h3 className="mt-2 text-heading font-semibold">{step.title}</h3>
                      <p className="mt-2 text-muted-foreground leading-relaxed">{step.text}</p>
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
