"use client";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BentoGrid } from "@/components/ui/bento-grid";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";

const aiBlocks = [
  {
    title: "Estructuración de información clínica",
    text: "La IA ayuda a ordenar y comprender información relevante para una lectura más clara y completa.",
  },
  {
    title: "Priorización de señales y alertas",
    text: "Identifica patrones y resalta lo importante para apoyar el seguimiento y la prevención.",
  },
  {
    title: "Seguimiento longitudinal",
    text: "Facilita observar cambios a lo largo del tiempo y entender evolución con más contexto.",
  },
];

function SurfaceCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <div className={`lg:hidden rounded-2xl border border-border bg-surface p-6 ${className}`}>
        {children}
      </div>
      <MagicCard
        className={`hidden lg:block rounded-2xl ${className}`}
        gradientFrom="var(--color-accent)"
        gradientTo="var(--color-primary)"
        gradientColor="var(--color-accent)"
        gradientOpacity={0.12}
      >
        <div className="rounded-2xl border border-border bg-surface p-6">{children}</div>
      </MagicCard>
    </>
  );
}

export function AIDataSection() {
  return (
    <section id="ia" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="IA aplicada a tu prevención"
          subtitle="Tecnología diseñada para transformar datos en información útil, con un enfoque clínico y responsable."
        />

        <BentoGrid className="mt-10 grid-cols-1 auto-rows-auto lg:grid-cols-6">
          {aiBlocks.map((block, idx) => (
            <BlurFade key={block.title} inView delay={idx * 0.06} className="lg:col-span-2">
              <SurfaceCard className="lg:col-span-2">
                <h3 className="text-heading font-semibold">{block.title}</h3>
                <p className="mt-2 text-muted leading-relaxed">{block.text}</p>
              </SurfaceCard>
            </BlurFade>
          ))}

          <BlurFade inView delay={0.22} className="lg:col-span-6">
            <SurfaceCard className="lg:col-span-6">
              <h3 className="text-heading font-semibold">Confianza y privacidad</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-foreground">
                <li>• Confidencialidad y cuidado de datos</li>
                <li>• Acceso por roles</li>
                <li>• Trazabilidad de acciones</li>
                <li>• Enfoque de apoyo, no reemplazo clínico</li>
              </ul>
            </SurfaceCard>
          </BlurFade>
        </BentoGrid>
      </Container>
    </section>
  );
}
