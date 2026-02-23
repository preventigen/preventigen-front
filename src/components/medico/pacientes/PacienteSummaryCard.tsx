import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { formatDate } from "@/src/lib/formatters";
import type { Paciente } from "@/src/lib/api/types";

interface PacienteSummaryCardProps {
  paciente: Paciente;
}

function renderList(values: string[]) {
  if (values.length === 0) return "-";
  return values.join(", ");
}

export function PacienteSummaryCard({ paciente }: PacienteSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del paciente</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground">Nombre</p>
          <p className="font-medium text-heading">{paciente.nombre}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Edad</p>
          <p className="font-medium text-heading">{paciente.edad ?? "-"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium text-heading">{paciente.email ?? "-"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Telefono</p>
          <p className="font-medium text-heading">{paciente.telefono ?? "-"}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-muted-foreground">Alergias</p>
          <p className="font-medium text-heading">{renderList(paciente.alergias)}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-muted-foreground">Enfermedades cronicas</p>
          <p className="font-medium text-heading">{renderList(paciente.enfermedadesCronicas)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Fecha de alta</p>
          <p className="font-medium text-heading">{formatDate(paciente.createdAt)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
