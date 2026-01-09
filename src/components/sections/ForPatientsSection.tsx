import { Container } from "../ui/Container";
import { SectionHeader } from "../ui/SectionHeader";

function BenefitCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="text-heading font-semibold">{title}</h3>
      <p className="mt-2 text-muted leading-relaxed">{text}</p>
    </div>
  );
}

export function ForPatientsSection() {
  return (
    <section className="py-16 sm:py-20 bg-surface-muted/40">
      <Container>
        <SectionHeader
          title="Pensado para vos"
          subtitle="Más claridad, menos incertidumbre. Prevención con acompañamiento."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <BenefitCard
            title="Entender tu salud con claridad"
            text="Una visión integral para tomar mejores decisiones."
          />
          <BenefitCard
            title="Anticiparte a riesgos"
            text="Señales tempranas para actuar antes."
          />
          <BenefitCard
            title="Plan personalizado"
            text="Recomendaciones adaptadas a tu perfil y evolución."
          />
          <BenefitCard
            title="Acompañamiento profesional"
            text="Un enfoque humano, con criterio médico."
          />
        </div>

        <blockquote className="mt-10 rounded-2xl border border-accent/30 bg-accent/10 p-6">
          <p className="text-heading font-medium">
            “La prevención empieza con información clara y decisiones a tiempo.”
          </p>
        </blockquote>
      </Container>
    </section>
  );
}
