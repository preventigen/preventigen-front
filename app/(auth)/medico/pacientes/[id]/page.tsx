import { AnalisisIaHistoryList } from "@/src/components/medico/ia/AnalisisIaHistoryList";
import { DatosMedicosList } from "@/src/components/medico/datos-medicos/DatosMedicosList";
import { PacienteGemeloEcammSection } from "@/src/components/medico/pacientes/PacienteGemeloEcammSection";
import { PacienteHeader } from "@/src/components/medico/pacientes/PacienteHeader";
import { PacienteSummaryCard } from "@/src/components/medico/pacientes/PacienteSummaryCard";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { listAnalisisIaByPaciente } from "@/src/lib/api/analisis-ia";
import { listConsultas } from "@/src/lib/api/consultas";
import { listDatosMedicosByPaciente } from "@/src/lib/api/datos-medicos";
import { getGemeloDigitalByPacienteId } from "@/src/lib/api/gemelos-digitales";
import { isApiError } from "@/src/lib/api/http";
import { getPacienteById } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";
import { redirect } from "next/navigation";

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

      const gemeloDigital = await (async () => {
        try {
          return await getGemeloDigitalByPacienteId(pacienteId, token);
        } catch (error) {
          if (isApiError(error) && (error.status === 401 || error.status === 403)) {
            throw error;
          }

          if (isApiError(error) && error.status === 404) {
            return null;
          }

          throw error;
        }
      })();

      const consultasResult = await (async () => {
        try {
          const consultas = await listConsultas(token);
          return { consultas, consultasError: null as string | null };
        } catch (error) {
          if (isApiError(error) && (error.status === 401 || error.status === 403)) {
            throw error;
          }

          return {
            consultas: [],
            consultasError: error instanceof Error ? error.message : "Intenta nuevamente.",
          };
        }
      })();

      console.log("Paciente:", paciente);
      console.log("Datos médicos:", datosMedicos);
      console.log("Análisis IA:", analisis);
      console.log("Gemelo digital:", gemeloDigital);
      console.log("Consultas:", consultasResult.consultas, "Error:", consultasResult.consultasError);

      return {
        paciente,
        datosMedicos: byNewest(datosMedicos),
        analisis: byNewest(analisis).slice(0, 10),
        gemeloDigital,
        consultas: consultasResult.consultas,
        consultasError: consultasResult.consultasError,
      };
    } catch (error) {
      if (isApiError(error) && (error.status === 401 || error.status === 403)) {
        redirect("/credentials");
      }

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

      <PacienteGemeloEcammSection
        token={token}
        pacienteId={pacienteResult.paciente.id}
        gemelo={pacienteResult.gemeloDigital}
        consultas={pacienteResult.consultas}
        consultasError={pacienteResult.consultasError}
        datosMedicos={pacienteResult.datosMedicos}
      />

      <DatosMedicosList pacienteId={pacienteResult.paciente.id} items={pacienteResult.datosMedicos} />

      <AnalisisIaHistoryList
        pacienteId={pacienteResult.paciente.id}
        items={pacienteResult.analisis}
      />
    </div>
  );
}
