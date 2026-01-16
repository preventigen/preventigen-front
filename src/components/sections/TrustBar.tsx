"use client";

import { Container } from "../ui/Container";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";

export function TrustBar() {
  const items = [
    "Enfoque clínico preventivo",
    "IA aplicada a datos de salud",
    "Interpretación profesional",
    "Seguimiento continuo",
    "Confidencialidad y cuidado de datos",
  ];

  return (
    <section className="border-b border-border bg-background">
      <Container className="py-8">
        <div className="flex flex-wrap gap-2">
          {items.map((t, idx) => (
            <BlurFade key={t} inView delay={idx * 0.05}>
              <Badge variant="outline" className="border-border bg-surface text-foreground">
                {t}
              </Badge>
            </BlurFade>
          ))}
        </div>
      </Container>
    </section>
  );
}
