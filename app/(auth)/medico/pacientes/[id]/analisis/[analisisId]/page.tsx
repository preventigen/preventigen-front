import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { AnalisisIaResult } from "@/src/components/medico/ia/AnalisisIaResult";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { getAnalisisIaById, listAnalisisIaByPaciente } from "@/src/lib/api/analisis-ia";
import { getPacienteById } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";
import { formatDateTime } from "@/src/lib/formatters";

interface AnalisisDetallePageProps {
  params: {
    id: string;
    analisisId: string;
  };
}

export default async function AnalisisDetallePage({ params }: AnalisisDetallePageProps) {
  const { token } = await requireMedicoSession();
  const pacienteId = params.id;
  const analisisId = params.analisisId;

  const analisisResult = await (async () => {
    try {
      const paciente = await getPacienteById(pacienteId, token);

      let analisis;
      try {
        analisis = await getAnalisisIaById(analisisId, token);
      } catch {
        const historial = await listAnalisisIaByPaciente(pacienteId, token);
        analisis = historial.find((item) => item.id === analisisId);
      }

      if (!analisis) {
        return { notFound: true as const };
      }

      return { paciente, analisis };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Intenta nuevamente.",
      };
    }
  })();

  if ("errorMessage" in analisisResult) {
    return (
      <ErrorState
        title="No se pudo cargar el analisis"
        description={analisisResult.errorMessage ?? "Intenta nuevamente."}
        actionLabel="Volver al paciente"
        actionHref={`/medico/pacientes/${pacienteId}`}
      />
    );
  }

  if ("notFound" in analisisResult) {
    return (
      <ErrorState
        title="Analisis no encontrado"
        description="No encontramos ese analisis para el paciente seleccionado."
        actionLabel="Volver al historial"
        actionHref={`/medico/pacientes/${pacienteId}/analisis`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-heading">Detalle del analisis</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paciente: {analisisResult.paciente.nombre} ·{" "}
            {formatDateTime(analisisResult.analisis.createdAt)}
          </p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href={`/medico/pacientes/${pacienteId}/analisis`}>
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metadatos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Tipo prompt:</span>{" "}
            <span className="font-medium text-heading">
              {analisisResult.analisis.tipoPrompt ?? "-"}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Dato medico vinculado:</span>{" "}
            <span className="font-medium text-heading">
              {analisisResult.analisis.datoMedicoId ?? "-"}
            </span>
          </p>
        </CardContent>
      </Card>

      <AnalisisIaResult analisis={analisisResult.analisis} />
    </div>
  );
}

