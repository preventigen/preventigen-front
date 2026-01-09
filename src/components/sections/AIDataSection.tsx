import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

function AIBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="text-heading font-semibold">{title}</h3>
      <p className="mt-2 text-muted leading-relaxed">{text}</p>
    </div>
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

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <AIBlock
            title="Estructuración de información clínica"
            text="La IA ayuda a ordenar y comprender información relevante para una lectura más clara y completa."
          />
          <AIBlock
            title="Priorización de señales y alertas"
            text="Identifica patrones y resalta lo importante para apoyar el seguimiento y la prevención."
          />
          <AIBlock
            title="Seguimiento longitudinal"
            text="Facilita observar cambios a lo largo del tiempo y entender evolución con más contexto."
          />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <h3 className="text-heading font-semibold">Confianza y privacidad</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-foreground">
            <li>✓ Confidencialidad y cuidado de datos</li>
            <li>✓ Acceso por roles</li>
            <li>✓ Trazabilidad de acciones</li>
            <li>✓ Enfoque de apoyo, no reemplazo clínico</li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
