import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { formatDate } from "@/src/lib/formatters";
import type { PacienteDetalle } from "@/src/lib/api/types";

interface PacienteSummaryCardProps {
  paciente: PacienteDetalle;
}

function renderValue(value?: string | null) {
  return value?.trim() ? value : "-";
}

export function PacienteSummaryCard({ paciente }: PacienteSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del paciente</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
        <div>
          <p className="text-muted-foreground">Nombre</p>
          <p className="font-medium text-heading">{paciente.nombre}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Apellido</p>
          <p className="font-medium text-heading">{paciente.apellido}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Genero</p>
          <p className="font-medium text-heading">{paciente.genero}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Fecha de nacimiento</p>
          <p className="font-medium text-heading">{formatDate(paciente.fechaNacimiento)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Diagnostico principal</p>
          <p className="font-medium text-heading">
            {renderValue(paciente.diagnosticoPrincipal)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Presion arterial</p>
          <p className="font-medium text-heading">{renderValue(paciente.presionArterial)}</p>
        </div>
        <div className="sm:col-span-2 xl:col-span-3">
          <p className="text-muted-foreground">Alergias</p>
          <p className="font-medium text-heading whitespace-pre-wrap">
            {renderValue(paciente.alergias)}
          </p>
        </div>
        <div className="sm:col-span-2 xl:col-span-3">
          <p className="text-muted-foreground">Antecedentes medicos</p>
          <p className="font-medium text-heading whitespace-pre-wrap">
            {renderValue(paciente.antecedentesMedicos)}
          </p>
        </div>
        <div className="sm:col-span-2 xl:col-span-3">
          <p className="text-muted-foreground">Medicacion actual</p>
          <p className="font-medium text-heading whitespace-pre-wrap">
            {renderValue(paciente.medicacionActual)}
          </p>
        </div>
        <div className="sm:col-span-2 xl:col-span-3">
          <p className="text-muted-foreground">Comentarios</p>
          <p className="font-medium text-heading whitespace-pre-wrap">
            {renderValue(paciente.comentarios)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
