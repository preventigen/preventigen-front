import { AnalisisIaForm } from "@/src/components/medico/ia/AnalisisIaForm";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { listAnalisisIaByPaciente } from "@/src/lib/api/analisis-ia";
import { listDatosMedicosByPaciente } from "@/src/lib/api/datos-medicos";
import { getPacienteById } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";

interface AnalisisPacientePageProps {
   params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    datoMedicoId?: string | string[];
  }>;
}

function byNewest<T extends { createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

export default async function AnalisisPacientePage({
  params,
  searchParams,
}: AnalisisPacientePageProps) {
    const { token } = await requireMedicoSession();
  const { id: pacienteId } = await params;

  const rawDatoMedicoId = (await searchParams)?.datoMedicoId;
  const initialDatoMedicoId = Array.isArray(rawDatoMedicoId)
    ? rawDatoMedicoId[0]
    : rawDatoMedicoId;

  const analisisResult = await (async () => {
    try {
      const [paciente, datosMedicos, analisis] = await Promise.all([
        getPacienteById(pacienteId, token),
        listDatosMedicosByPaciente(pacienteId, token),
        listAnalisisIaByPaciente(pacienteId, token),
      ]);

      return {
        paciente,
        datosMedicos: byNewest(datosMedicos),
        analisis: byNewest(analisis),
      };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Intenta nuevamente.",
      };
    }
  })();

  if ("errorMessage" in analisisResult) {
    return (
      <ErrorState
        title="No se pudo cargar la vista de analisis IA"
        description={analisisResult.errorMessage ?? "Intenta nuevamente."}
        actionLabel="Volver al paciente"
        actionHref={`/medico/pacientes/${pacienteId}`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Analisis IA</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ejecuta analisis sobre los datos del paciente y revisa resultados guardados.
        </p>
      </div>

      <AnalisisIaForm
        token={token}
        paciente={analisisResult.paciente}
        datosMedicos={analisisResult.datosMedicos}
        analisisRecientes={analisisResult.analisis}
        initialDatoMedicoId={initialDatoMedicoId}
      />
    </div>
  );
}

