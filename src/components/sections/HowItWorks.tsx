import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

function StepCard({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent font-semibold">
          {n}
        </div>
        <div>
          <h3 className="text-heading font-semibold">{title}</h3>
          <p className="mt-2 text-muted leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-24 py-16 sm:py-20">
      <Container>
        <SectionHeader
          title="Cómo funciona"
          subtitle="Un proceso simple, guiado y con acompañamiento profesional."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StepCard
            n="1"
            title="Solicitás contacto"
            text="Te orientamos y coordinamos una evaluación inicial."
          />
          <StepCard
            n="2"
            title="Reunimos información relevante"
            text="Historial clínico, biomarcadores y genética si aplica, para una visión completa."
          />
          <StepCard
            n="3"
            title="Recibís un informe claro + plan"
            text="Resultados comprensibles, recomendaciones personalizadas y seguimiento."
          />
        </div>
      </Container>
    </section>
  );
}
