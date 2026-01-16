"use client";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BentoGrid } from "@/components/ui/bento-grid";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";

const features = [
  {
    title: "Ordena lo importante",
    text: "Convierte información dispersa en un resumen claro y útil.",
  },
  {
    title: "Prioriza señales y alertas",
    text: "Destaca lo que requiere atención para no pasar nada por alto.",
  },
  {
    title: "Acompaña el seguimiento",
    text: "Permite ver cambios a lo largo del tiempo y comparar evolución.",
  },
  {
    title: "Asiste al profesional",
    text: "Brinda soporte para decidir con más contexto, sin reemplazar el juicio clínico.",
  },
];

function SurfaceCard({
  children,
  className = "",
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  const base = accent
    ? "rounded-2xl border border-accent/30 bg-accent/10 p-6"
    : "rounded-2xl border border-border bg-surface p-6";

  return (
    <>
      <div className={`lg:hidden ${base} ${className}`}>{children}</div>
      <MagicCard
        className={`hidden lg:block rounded-2xl ${className}`}
        gradientFrom="var(--color-accent)"
        gradientTo="var(--color-primary)"
        gradientColor="var(--color-accent)"
        gradientOpacity={0.12}
      >
        <div className={base}>{children}</div>
      </MagicCard>
    </>
  );
}

export function ECAMMSection() {
  return (
    <section id="ecamm" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="ECAMM: asistencia clínica para prevenir mejor"
          subtitle="ECAMM es un sistema de apoyo que ayuda a ordenar información, priorizar alertas y ofrecer una visión clara para que el profesional pueda acompañarte mejor en tu prevención."
        />

        <BentoGrid className="mt-10 grid-cols-1 auto-rows-auto lg:grid-cols-6">
          <BlurFade inView delay={0.05} className="lg:col-span-3">
            <SurfaceCard className="lg:col-span-3">
              <h3 className="text-heading font-semibold">Lo que aporta</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {features.map((feature, idx) => (
                  <BlurFade key={feature.title} inView delay={0.08 + idx * 0.04}>
                    <div className="rounded-xl border border-border bg-surface-muted p-4">
                      <p className="text-heading font-medium">{feature.title}</p>
                      <p className="mt-2 text-sm text-muted">{feature.text}</p>
                    </div>
                  </BlurFade>
                ))}
              </div>
            </SurfaceCard>
          </BlurFade>

          <BlurFade inView delay={0.12} className="lg:col-span-3">
            <SurfaceCard className="lg:col-span-3" accent>
              <h3 className="text-heading font-semibold">Importante</h3>
              <p className="mt-3 text-heading font-medium">
                La decisión final siempre es médica. ECAMM acompaña, no diagnostica ni indica tratamientos.
              </p>
            </SurfaceCard>
          </BlurFade>

          <BlurFade inView delay={0.18} className="lg:col-span-6">
            <SurfaceCard className="lg:col-span-6">
              <p className="text-sm text-muted">
                Vista previa ilustrativa (mock): tablero de resumen clínico + alertas + seguimiento.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                  <p className="text-xs text-muted">Alerta</p>
                  <p className="mt-1 font-semibold text-danger">Señal a revisar</p>
                </div>
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                  <p className="text-xs text-muted">Resumen</p>
                  <p className="mt-1 font-semibold text-heading">Información clave</p>
                </div>
                <div className="rounded-xl border border-border bg-surface-muted p-4">
                  <p className="text-xs text-muted">Seguimiento</p>
                  <p className="mt-1 font-semibold text-heading">Evolución</p>
                </div>
              </div>
            </SurfaceCard>
          </BlurFade>
        </BentoGrid>
      </Container>
    </section>
  );
}
