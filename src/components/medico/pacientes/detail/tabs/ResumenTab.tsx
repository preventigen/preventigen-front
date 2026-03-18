import { Badge } from "@/src/components/magic/ui/badge";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { formatDateTime, textPreview } from "@/src/lib/formatters";
import type {
  AnalisisIA,
  Consulta,
  GemeloDigital,
  SimulacionTratamiento,
} from "@/src/lib/api/types";
import type { DetailTabValue } from "@/src/components/medico/pacientes/detail/shared/utils";

interface ResumenTabProps {
  activeConsulta: Consulta | null;
  ultimoAnalisis: AnalisisIA | null;
  gemelo: GemeloDigital | null;
  ultimaSimulacion: SimulacionTratamiento | null;
  onGoToTab: (tab: DetailTabValue) => void;
}

export function ResumenTab({
  activeConsulta,
  ultimoAnalisis,
  gemelo,
  ultimaSimulacion,
  onGoToTab,
}: ResumenTabProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Consulta activa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeConsulta ? (
            <>
              <div className="space-y-2">
                <Badge variant="outline">{activeConsulta.estado}</Badge>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(activeConsulta.createdAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {textPreview(activeConsulta.detalles ?? "Sin detalles cargados.", 140)}
                </p>
              </div>
              <Button type="button" onClick={() => onGoToTab("consultas")}>
                Ir a Consultas
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                No hay una consulta borrador activa para este paciente.
              </p>
              <Button type="button" variant="outline" onClick={() => onGoToTab("consultas")}>
                Ver Consultas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ultimo analisis IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ultimoAnalisis ? (
            <>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(ultimoAnalisis.fechaGeneracion ?? undefined)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {textPreview(ultimoAnalisis.respuestaIA, 180)}
                </p>
              </div>
              <Button type="button" onClick={() => onGoToTab("ia")}>
                Ir a IA
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Todavia no hay analisis generados para este paciente.
              </p>
              <Button type="button" variant="outline" onClick={() => onGoToTab("ia")}>
                Ver IA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gemelo digital</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {gemelo ? (
            <>
              <div className="space-y-2">
                <Badge variant="outline">{gemelo.estado}</Badge>
                <p className="text-sm text-muted-foreground">
                  Ultima actualizacion: {formatDateTime(gemelo.updatedAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ultimaSimulacion
                    ? `Ultima simulacion: ${ultimaSimulacion.tratamientoPropuesto}`
                    : "Sin simulaciones registradas todavia."}
                </p>
              </div>
              <Button type="button" onClick={() => onGoToTab("gemelo")}>
                Ir a Gemelo
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Este paciente aun no tiene gemelo digital asociado.
              </p>
              <Button type="button" variant="outline" onClick={() => onGoToTab("gemelo")}>
                Ver Gemelo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
