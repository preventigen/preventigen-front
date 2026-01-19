"use client";

import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";
import { BentoGrid } from "@/components/ui/bento-grid";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";

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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground">
      {children}
    </div>
  );
}

export function DigitalTwinSection() {
  return (
    <section id="gemelo" className="scroll-mt-24 py-16 sm:py-20 bg-surface-muted/40">
      <Container>
        <SectionHeader
          title="Gemelo Digital: un modelo clínico virtual"
          subtitle="Tu gemelo digital es una representación clínica construida a partir de datos relevantes para comprender tu estado de salud y explorar escenarios de forma segura."
        />

        <BentoGrid className="mt-10 grid-cols-1 auto-rows-auto lg:grid-cols-6">
          <BlurFade inView delay={0.05} className="lg:col-span-4">
            <SurfaceCard className="lg:col-span-4">
              <h3 className="text-heading font-semibold">Qué incluye</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Pill>Laboratorios y biomarcadores</Pill>
                <Pill>Historial clínico y antecedentes</Pill>
                <Pill>Medicación y hábitos relevantes</Pill>
                <Pill>Evolución en el tiempo</Pill>
              </div>

              <h3 className="text-heading font-semibold mt-8">Para qué sirve</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Permite simular escenarios y evaluar posibles respuestas de manera informada, sin intervenir
                en el cuerpo, para acompañar una prevención más precisa.
              </p>
            </SurfaceCard>
          </BlurFade>

          <BlurFade inView delay={0.12} className="lg:col-span-2">
            <SurfaceCard className="lg:col-span-2" accent>
              <h3 className="text-heading font-semibold">Aclaración importante</h3>
              <ul className="mt-4 space-y-2 text-foreground">
                <li>• No es una persona digital.</li>
                <li>• No decide por vos.</li>
                <li>• No reemplaza la evaluación médica.</li>
              </ul>

              <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
                <p className="text-xs text-muted-foreground">Diagrama (simple)</p>
                <div className="mt-3 flex flex-col gap-3 text-sm">
                  <div className="rounded-xl border border-border bg-surface-muted p-3">
                    Datos clínicos + biomarcadores + genética
                  </div>
                  <div className="text-center text-muted-foreground">→</div>
                  <div className="rounded-xl border border-border bg-surface-muted p-3">
                    Modelo clínico virtual (gemelo digital)
                  </div>
                  <div className="text-center text-muted-foreground">→</div>
                  <div className="rounded-xl border border-border bg-surface-muted p-3">
                    Escenarios + seguimiento preventivo
                  </div>
                </div>
              </div>
            </SurfaceCard>
          </BlurFade>
        </BentoGrid>
      </Container>
    </section>
  );
}
