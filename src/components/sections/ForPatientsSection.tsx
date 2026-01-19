"use client";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BlurFade } from "@/components/ui/blur-fade";

function BenefitCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="text-heading font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

export function ForPatientsSection() {
  return (
    <section className="py-16 sm:py-20 bg-surface-muted/40">
      <Container>
        <SectionHeader
          title="Pensado para vos"
          subtitle="Más claridad, menos incertidumbre. Prevención con acompañamiento."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Entender tu salud con claridad",
              text: "Una visión integral para tomar mejores decisiones.",
            },
            {
              title: "Anticiparte a riesgos",
              text: "Señales tempranas para actuar antes.",
            },
            {
              title: "Plan personalizado",
              text: "Recomendaciones adaptadas a tu perfil y evolución.",
            },
            {
              title: "Acompañamiento profesional",
              text: "Un enfoque humano, con criterio médico.",
            },
          ].map((item, idx) => (
            <BlurFade key={item.title} inView delay={idx * 0.06}>
              <BenefitCard title={item.title} text={item.text} />
            </BlurFade>
          ))}
        </div>

        <BlurFade inView delay={0.24}>
          <blockquote className="mt-10 rounded-2xl border border-accent/30 bg-accent/10 p-6">
            <p className="text-heading font-medium">
              “La prevención empieza con información clara y decisiones a tiempo.”
            </p>
          </blockquote>
        </BlurFade>
      </Container>
    </section>
  );
}
