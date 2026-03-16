import Link from "next/link";
import { ArrowLeft, FilePlus2, Pencil } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";

interface PacienteHeaderProps {
  pacienteId: string;
  nombreCompleto: string;
}

export function PacienteHeader({ pacienteId, nombreCompleto }: PacienteHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-1 px-0">
          <Link href="/medico/pacientes">
            <ArrowLeft className="h-4 w-4" />
            Volver a pacientes
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-heading">{nombreCompleto}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ficha clinica integral del paciente.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/medico/pacientes/${pacienteId}/editar`}>
            <Pencil className="h-4 w-4" />
            Editar paciente
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/medico/pacientes/${pacienteId}#consultas`}>
            <FilePlus2 className="h-4 w-4" />
            Ir a consultas
          </Link>
        </Button>
      </div>
    </div>
  );
}
