import { Container } from "./ui/Container";

export function Footer() {
  const links = [
    { label: "Qué es", href: "#que-es" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "ECAMM", href: "#ecamm" },
    { label: "Gemelo Digital", href: "#gemelo" },
    { label: "IA aplicada", href: "#ia" },
    { label: "Equipo médico", href: "#equipo" },
    { label: "Preguntas", href: "#preguntas" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-heading font-semibold">PreventiGen</p>
            <p className="mt-2 text-sm text-muted max-w-sm">
              Medicina preventiva y tecnología aplicada.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-foreground hover:text-heading">
                {l.label}
              </a>
            ))}
          </div>

          <div className="text-sm">
            <p className="text-heading font-medium">Legal</p>
            <div className="mt-2 space-y-2">
              <a href="#" className="block text-foreground hover:text-heading">
                Privacidad
              </a>
              <a href="#" className="block text-foreground hover:text-heading">
                Términos
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface-muted p-4 text-sm text-muted">
          La información de este sitio no sustituye una consulta médica.
        </div>

        <p className="mt-6 text-xs text-muted">
          © PreventiGen — Medicina preventiva y tecnología aplicada.
        </p>
      </Container>
    </footer>
  );
}
