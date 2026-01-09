import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

export function WhatIsPreventiGen() {
  return (
    <section id="que-es" className="scroll-mt-24 py-16 sm:py-20 bg-surface-muted/40">
      <Container>
        <SectionHeader
          title="Qué es PreventiGen"
          subtitle="PreventiGen es una plataforma de medicina preventiva que integra datos clínicos y tecnología para identificar señales tempranas, comprender predisposiciones y acompañar un plan de cuidado personalizado."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-heading font-semibold">Beneficios</h3>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-foreground">
              <li>Claridad sobre tu salud con una visión integral.</li>
              <li>Prevención y detección temprana de riesgos.</li>
              <li>Plan personalizado con seguimiento y acompañamiento.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6">
            <h3 className="text-heading font-semibold">Importante</h3>
            <ul className="mt-4 space-y-2 text-foreground">
              <li>• No reemplaza la consulta médica ni el criterio profesional.</li>
              <li>• No realiza diagnósticos automáticos.</li>
              <li>• No brinda atención para emergencias o urgencias.</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
