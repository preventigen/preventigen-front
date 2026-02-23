import Link from "next/link";
import { Brain } from "lucide-react";
import { Badge } from "@/src/components/magic/ui/badge";
import { Button } from "@/src/components/magic/ui/button";
import { formatDateTime, textPreview } from "@/src/lib/formatters";
import type { DatoMedico } from "@/src/lib/api/types";

interface DatoMedicoItemProps {
  pacienteId: string;
  dato: DatoMedico;
}

export function DatoMedicoItem({ pacienteId, dato }: DatoMedicoItemProps) {
  return (
    <li className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="outline" className="uppercase">
          {dato.tipo}
        </Badge>
        <p className="text-xs text-muted-foreground">{formatDateTime(dato.createdAt)}</p>
      </div>

      <p className="mt-3 text-sm text-heading">{textPreview(dato.contenido, 220)}</p>

      <details className="mt-3">
        <summary className="cursor-pointer text-xs text-primary">Ver completo</summary>
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{dato.contenido}</p>
      </details>

      <div className="mt-3 flex items-center justify-end">
        <Button asChild size="sm" variant="outline">
          <Link href={`/medico/pacientes/${pacienteId}/analisis?datoMedicoId=${dato.id}`}>
            <Brain className="h-4 w-4" />
            Analizar con IA
          </Link>
        </Button>
      </div>
    </li>
  );
}
