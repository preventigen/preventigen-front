import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { EmptyState } from "@/src/components/medico/states/EmptyState";
import { DatoMedicoItem } from "@/src/components/medico/datos-medicos/DatoMedicoItem";
import type { DatoMedico } from "@/src/lib/api/types";

interface DatosMedicosListProps {
  pacienteId: string;
  items: DatoMedico[];
}

export function DatosMedicosList({ pacienteId, items }: DatosMedicosListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos medicos cargados</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="No hay registros medicos"
            description="Agrega el primer dato medico para comenzar el analisis clinico."
            actionLabel="Agregar dato medico"
            actionHref={`/medico/pacientes/${pacienteId}/datos-medicos/nuevo`}
          />
        ) : (
          <ul className="space-y-3">
            {items.map((dato) => (
              <DatoMedicoItem key={dato.id} pacienteId={pacienteId} dato={dato} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
