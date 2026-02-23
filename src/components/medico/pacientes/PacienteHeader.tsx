import Link from "next/link";
import { ArrowLeft, Brain, FilePlus2, Pencil } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";

interface PacienteHeaderProps {
  pacienteId: string;
  nombre: string;
}

export function PacienteHeader({ pacienteId, nombre }: PacienteHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-1 px-0">
          <Link href="/medico/pacientes">
            <ArrowLeft className="h-4 w-4" />
            Volver a pacientes
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-heading">{nombre}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Resumen clinico del paciente</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={`/medico/pacientes/${pacienteId}/editar`}>
            <Pencil className="h-4 w-4" />
            Editar datos
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/medico/pacientes/${pacienteId}/datos-medicos/nuevo`}>
            <FilePlus2 className="h-4 w-4" />
            Agregar informacion
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href={`/medico/pacientes/${pacienteId}/analisis`}>
            <Brain className="h-4 w-4" />
            Analizar con IA
          </Link>
        </Button>
      </div>
    </div>
  );
}
