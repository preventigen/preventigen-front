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

export function WhatIsPreventiGen() {
  return (
    <section id="que-es" className="scroll-mt-24 py-16 sm:py-20 bg-surface-muted/40">
      <Container>
        <SectionHeader
          title="Qué es PreventiGen"
          subtitle="PreventiGen es una plataforma de medicina preventiva que integra datos clínicos y tecnología para identificar señales tempranas, comprender predisposiciones y acompañar un plan de cuidado personalizado."
        />

        <BentoGrid className="mt-10 grid-cols-1 auto-rows-auto lg:grid-cols-6">
          <BlurFade inView delay={0.05} className="lg:col-span-4">
            <SurfaceCard className="lg:col-span-4">
              <h3 className="text-heading font-semibold">Beneficios</h3>
              <ul className="mt-4 list-disc pl-5 space-y-2 text-foreground">
                <li>Claridad sobre tu salud con una visión integral.</li>
                <li>Prevención y detección temprana de riesgos.</li>
                <li>Plan personalizado con seguimiento y acompañamiento.</li>
              </ul>
            </SurfaceCard>
          </BlurFade>

          <BlurFade inView delay={0.12} className="lg:col-span-2">
            <SurfaceCard className="lg:col-span-2" accent>
              <h3 className="text-heading font-semibold">Importante</h3>
              <ul className="mt-4 space-y-2 text-foreground">
                <li>• No reemplaza la consulta médica ni el criterio profesional.</li>
                <li>• No realiza diagnósticos automáticos.</li>
                <li>• No brinda atención para emergencias o urgencias.</li>
              </ul>
            </SurfaceCard>
          </BlurFade>
        </BentoGrid>
      </Container>
    </section>
  );
}
