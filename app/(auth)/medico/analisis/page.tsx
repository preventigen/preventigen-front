import Link from "next/link";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { EmptyState } from "@/src/components/medico/states/EmptyState";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { listAnalisisIaByPaciente } from "@/src/lib/api/analisis-ia";
import { listPacientes } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";
import { formatDateTime, textPreview } from "@/src/lib/formatters";

interface AnalisisWithPaciente {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  tipoPrompt?: string | null;
  respuesta: string;
  createdAt?: string;
}

export default async function AnalisisGeneralPage() {
  const { token } = await requireMedicoSession();

  const dataResult = await (async () => {
    try {
      const pacientes = await listPacientes(token);

      const analisisGrouped = await Promise.all(
        pacientes.map(async (paciente) => {
          try {
            const analisis = await listAnalisisIaByPaciente(paciente.id, token);
            return analisis.map((item) => ({
              id: item.id,
              pacienteId: item.pacienteId,
              pacienteNombre: paciente.nombre,
              tipoPrompt: item.tipoPrompt,
              respuesta: item.respuesta,
              createdAt: item.createdAt,
            }));
          } catch {
            return [] as AnalisisWithPaciente[];
          }
        })
      );

      const analisis = analisisGrouped
        .flat()
        .sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, 30);

      return { analisis };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Intenta nuevamente.",
      };
    }
  })();

  if ("errorMessage" in dataResult) {
    return (
      <ErrorState
        title="No se pudo cargar el historial IA"
        description={dataResult.errorMessage ?? "Intenta nuevamente."}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Analisis IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Historial reciente de analisis generados en pacientes.
        </p>
      </div>

      {dataResult.analisis.length === 0 ? (
        <EmptyState
          title="No hay analisis todavia"
          description="Ve al detalle de un paciente para ejecutar el primer analisis IA."
          actionLabel="Ir a pacientes"
          actionHref="/medico/pacientes"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Ultimos analisis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {dataResult.analisis.map((item) => (
                <li key={item.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-heading">{item.pacienteNombre}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</p>
                  </div>
                  <p className="mt-1 text-xs uppercase text-muted-foreground">
                    {item.tipoPrompt ?? "sistema"}
                  </p>
                  <p className="mt-2 text-sm text-heading">{textPreview(item.respuesta, 180)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/medico/pacientes/${item.pacienteId}/analisis/${item.id}`}>
                        Ver detalle
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/medico/pacientes/${item.pacienteId}`}>Ir al paciente</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
