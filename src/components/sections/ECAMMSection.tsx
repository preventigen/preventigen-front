import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="text-heading font-semibold">{title}</h3>
      <p className="mt-2 text-muted leading-relaxed">{text}</p>
    </div>
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

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <FeatureCard
            title="Ordena lo importante"
            text="Convierte información dispersa en un resumen claro y útil."
          />
          <FeatureCard
            title="Prioriza señales y alertas"
            text="Destaca lo que requiere atención para no pasar nada por alto."
          />
          <FeatureCard
            title="Acompaña el seguimiento"
            text="Permite ver cambios a lo largo del tiempo y comparar evolución."
          />
          <FeatureCard
            title="Asiste al profesional"
            text="Brinda soporte para decidir con más contexto, sin reemplazar el juicio clínico."
          />
        </div>

        <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 p-5">
          <p className="text-heading font-medium">
            La decisión final siempre es médica. ECAMM acompaña, no diagnostica ni indica tratamientos.
          </p>
        </div>

        {/* Preview mock (placeholder visual) */}
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
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
        </div>
      </Container>
    </section>
  );
}
