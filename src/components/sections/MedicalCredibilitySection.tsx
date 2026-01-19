"use client";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BlurFade } from "@/components/ui/blur-fade";

function TeamCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="text-heading font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

export function MedicalCredibilitySection() {
  return (
    <section id="equipo" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="Equipo médico"
          subtitle="Un enfoque clínico orientado a la prevención, con profesionales especializados y una metodología centrada en comprensión, seguimiento y cuidado."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Equipo médico",
              text: "Prevención, evaluación y acompañamiento clínico.",
            },
            {
              title: "Especialistas",
              text: "Interpretación de estudios, biomarcadores y contexto clínico.",
            },
            {
              title: "Acompañamiento",
              text: "Seguimiento y orientación para sostener el plan en el tiempo.",
            },
          ].map((item, idx) => (
            <BlurFade key={item.title} inView delay={idx * 0.06}>
              <TeamCard title={item.title} text={item.text} />
            </BlurFade>
          ))}
        </div>

        <BlurFade inView delay={0.22}>
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-heading font-semibold">Metodología</h3>
            <ul className="mt-4 space-y-2 text-foreground">
              <li>• Evaluación clínica inicial</li>
              <li>• Interpretación de información relevante</li>
              <li>• Seguimiento y ajustes según evolución</li>
            </ul>
          </div>
        </BlurFade>
      </Container>
    </section>
  );
}
