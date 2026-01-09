import { Container } from "../ui/Container";
import { Badge } from "../ui/Badge";

export function TrustBar() {
  const items = [
    "Enfoque clínico preventivo",
    "IA aplicada a datos de salud",
    "Interpretación profesional",
    "Seguimiento continuo",
    "Confidencialidad y cuidado de datos",
  ];

  return (
    <section className="border-b border-border bg-background">
      <Container className="py-8">
        <div className="flex flex-wrap gap-2">
          {items.map((t) => (
            <Badge key={t} variant="navy">
              {t}
            </Badge>
          ))}
        </div>
      </Container>
    </section>
  );
}
