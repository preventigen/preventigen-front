"use client";

import { Container } from "../ui/Container";
import { Badge } from "@/src/components/magic/ui/badge";
import { BlurFade } from "@/src/components/magic/ui/blur-fade";

export function TrustBar() {
  const items = [
    "Enfoque clínico preventivo",
    "IA aplicada a datos de salud",
    "Interpretación profesional",
    "Seguimiento continuo",
    "Confidencialidad y cuidado de datos",
  ];

  return (
    <section className="relative border-b border-border bg-background">
      {/* Fondo sutil para integrarla con el hero sin “cortar” */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-surface-muted/40"
      />

      <Container className="py-7 sm:py-8">
        {/* Panel: hace que se sienta una sección real */}
        <div className="rounded-2xl border border-border bg-surface/70 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Microcopy (intención + confianza) */}
            <p className="text-sm text-muted-foreground">
              Diseñado con criterio clínico y tecnología aplicada para acompañar tu prevención.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {items.map((t, idx) => (
                <BlurFade key={t} inView delay={idx * 0.05}>
                  <Badge
                    variant="outline"
                    className="border-border bg-background/60 text-foreground shadow-[0_1px_0_rgba(15,23,42,0.04)]
                               transition-colors hover:bg-accent/10 hover:border-accent/30"
                  >
                    {t}
                  </Badge>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
