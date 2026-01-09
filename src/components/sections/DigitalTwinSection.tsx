import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

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

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-heading font-semibold">Qué incluye</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Pill>Laboratorios y biomarcadores</Pill>
              <Pill>Historial clínico y antecedentes</Pill>
              <Pill>Medicación y hábitos relevantes</Pill>
              <Pill>Evolución en el tiempo</Pill>
            </div>

            <h3 className="text-heading font-semibold mt-8">Para qué sirve</h3>
            <p className="mt-3 text-muted leading-relaxed">
              Permite simular escenarios y evaluar posibles respuestas de manera informada, sin intervenir
              en el cuerpo, para acompañar una prevención más precisa.
            </p>
          </div>

          <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6">
            <h3 className="text-heading font-semibold">Aclaración importante</h3>
            <ul className="mt-4 space-y-2 text-foreground">
              <li>• No es una persona digital.</li>
              <li>• No decide por vos.</li>
              <li>• No reemplaza la evaluación médica.</li>
            </ul>

            {/* Mini diagrama simple */}
            <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs text-muted">Diagrama (simple)</p>
              <div className="mt-3 flex flex-col gap-3 text-sm">
                <div className="rounded-xl border border-border bg-surface-muted p-3">
                  Datos clínicos + biomarcadores + genética
                </div>
                <div className="text-center text-muted">↓</div>
                <div className="rounded-xl border border-border bg-surface-muted p-3">
                  Modelo clínico virtual (gemelo digital)
                </div>
                <div className="text-center text-muted">↓</div>
                <div className="rounded-xl border border-border bg-surface-muted p-3">
                  Escenarios + seguimiento preventivo
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
