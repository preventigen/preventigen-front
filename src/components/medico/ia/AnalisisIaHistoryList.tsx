import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { Button } from "@/src/components/magic/ui/button";
import { EmptyState } from "@/src/components/medico/states/EmptyState";
import { formatDateTime, textPreview } from "@/src/lib/formatters";
import type { AnalisisIA } from "@/src/lib/api/types";

interface AnalisisIaHistoryListProps {
  pacienteId: string;
  items: AnalisisIA[];
}

export function AnalisisIaHistoryList({ pacienteId, items }: AnalisisIaHistoryListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analisis IA recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="Sin analisis aun"
            description="Cuando ejecutes analisis de IA, apareceran aqui."
            actionLabel="Ir a analisis IA"
            actionHref={`/medico/pacientes/${pacienteId}/analisis`}
          />
        ) : (
          <ul className="space-y-3">
            {items.map((analisis) => (
              <li key={analisis.id} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs uppercase text-muted-foreground">
                    {analisis.tipoPrompt ?? "sistema"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(analisis.createdAt)}
                  </p>
                </div>

                <p className="mt-2 text-sm text-heading">{textPreview(analisis.respuesta, 220)}</p>

                <div className="mt-3">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/medico/pacientes/${pacienteId}/analisis/${analisis.id}`}>
                      Ver detalle
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
