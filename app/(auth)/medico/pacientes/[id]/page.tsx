import { AnalisisIaHistoryList } from "@/src/components/medico/ia/AnalisisIaHistoryList";
import { DatosMedicosList } from "@/src/components/medico/datos-medicos/DatosMedicosList";
import { PacienteHeader } from "@/src/components/medico/pacientes/PacienteHeader";
import { PacienteSummaryCard } from "@/src/components/medico/pacientes/PacienteSummaryCard";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { listAnalisisIaByPaciente } from "@/src/lib/api/analisis-ia";
import { listDatosMedicosByPaciente } from "@/src/lib/api/datos-medicos";
import { getPacienteById } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";

interface PacienteDetallePageProps {
  params: Promise<{
    id: string;
  }>;
}

function byNewest<T extends { createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

export default async function PacienteDetallePage({ params }: PacienteDetallePageProps) {
  const { token } = await requireMedicoSession();
  const { id: pacienteId } = await params;

  const pacienteResult = await (async () => {
    try {
      const [paciente, datosMedicos, analisis] = await Promise.all([
        getPacienteById(pacienteId, token),
        listDatosMedicosByPaciente(pacienteId, token),
        listAnalisisIaByPaciente(pacienteId, token),
      ]);

      return {
        paciente,
        datosMedicos: byNewest(datosMedicos),
        analisis: byNewest(analisis).slice(0, 10),
      };
    } catch (error) {
      return {
        errorMessage:
          error instanceof Error
            ? error.message
            : "Verifica si el paciente existe e intenta de nuevo.",
      };
    }
  })();

  if ("errorMessage" in pacienteResult) {
    return (
      <ErrorState
        title="No se pudo cargar el detalle del paciente"
        description={pacienteResult.errorMessage ?? "Intenta nuevamente."}
        actionLabel="Volver al listado"
        actionHref="/medico/pacientes"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PacienteHeader pacienteId={pacienteResult.paciente.id} nombre={pacienteResult.paciente.nombre} />

      <PacienteSummaryCard paciente={pacienteResult.paciente} />

      <DatosMedicosList pacienteId={pacienteResult.paciente.id} items={pacienteResult.datosMedicos} />

      <AnalisisIaHistoryList
        pacienteId={pacienteResult.paciente.id}
        items={pacienteResult.analisis}
      />
    </div>
  );
}

