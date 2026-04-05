import { PacienteDetailClient } from "@/src/components/medico/pacientes/PacienteDetailClient";
import { PacienteHeader } from "@/src/components/medico/pacientes/PacienteHeader";
import { PacienteSummaryCard } from "@/src/components/medico/pacientes/PacienteSummaryCard";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { getContexto, getUltimoAnalisis } from "@/src/lib/api/analisis-ia";
import { listConsultasAsistenteByPaciente } from "@/src/lib/api/asistente-medico";
import { listConsultasByPaciente } from "@/src/lib/api/consultas";
import { listDatosMedicosByPaciente } from "@/src/lib/api/datos-medicos";
import { listEstudiosByPaciente } from "@/src/lib/api/estudios-medicos";
import { getGemeloByPaciente, listSimulaciones } from "@/src/lib/api/gemelos-digitales";
import { isApiError } from "@/src/lib/api/http";
import { listNovedadesByPaciente } from "@/src/lib/api/novedades-clinicas";
import { getPacienteById } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";
import type { GemeloDigital, SimulacionTratamiento } from "@/src/lib/api/types";
import { redirect } from "next/navigation";

interface PacienteDetallePageProps {
  params: Promise<{
    id: string;
  }>;
}

function sortByNewest<T extends { createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

async function getGemeloData(
  pacienteId: string,
  token: string
): Promise<{ gemelo: GemeloDigital | null; ultimaSimulacion: SimulacionTratamiento | null }> {
  try {
    const gemelo = await getGemeloByPaciente(pacienteId, token);

    try {
      const simulaciones = await listSimulaciones(gemelo.id, token);
      return {
        gemelo,
        ultimaSimulacion: sortByNewest(simulaciones)[0] ?? null,
      };
    } catch (error) {
      if (isApiError(error) && (error.status === 401 || error.status === 403)) {
        throw error;
      }

      return { gemelo, ultimaSimulacion: null };
    }
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      return { gemelo: null, ultimaSimulacion: null };
    }

    throw error;
  }
}

export default async function PacienteDetallePage({ params }: PacienteDetallePageProps) {
  const { token } = await requireMedicoSession();
  const { id: pacienteId } = await params;

  const pacienteResult = await (async () => {
    try {
      const [
        paciente,
        datosMedicos,
        consultas,
        estudios,
        novedades,
        ultimoAnalisis,
        contextoIa,
        historialAsistente,
        gemeloData,
      ] = await Promise.all([
        getPacienteById(pacienteId, token),
        listDatosMedicosByPaciente(pacienteId, token),
        listConsultasByPaciente(pacienteId, token),
        listEstudiosByPaciente(pacienteId, token),
        listNovedadesByPaciente(pacienteId, token),
        getUltimoAnalisis(pacienteId, token),
        getContexto(pacienteId, token),
        listConsultasAsistenteByPaciente(pacienteId, token),
        getGemeloData(pacienteId, token),
      ]);

      return {
        paciente,
        datosMedicos,
        consultas,
        estudios,
        novedades,
        ultimoAnalisis,
        contextoIa,
        historialAsistente,
        gemelo: gemeloData.gemelo,
        ultimaSimulacion: gemeloData.ultimaSimulacion,
      };
    } catch (error) {
      if (isApiError(error) && (error.status === 401 || error.status === 403)) {
        redirect("/credentials");
      }

      return {
        errorMessage:
          error instanceof Error
            ? error.message
            : "Verifica si el paciente existe e intenta nuevamente.",
      };
    }
  })();

  if ("errorMessage" in pacienteResult) {
    return (
      <ErrorState
        title="No se pudo cargar la ficha del paciente"
        description={pacienteResult.errorMessage ?? "Intenta nuevamente."}
        actionLabel="Volver al listado"
        actionHref="/medico/pacientes"
      />
    );
  }

  const nombreCompleto = `${pacienteResult.paciente.nombre} ${pacienteResult.paciente.apellido}`.trim();

  return (
    <div className="space-y-6">
      <PacienteHeader pacienteId={pacienteResult.paciente.id} nombreCompleto={nombreCompleto} />
      <PacienteSummaryCard paciente={pacienteResult.paciente} />
      <PacienteDetailClient
        token={token}
        paciente={pacienteResult.paciente}
        initialDatosMedicos={pacienteResult.datosMedicos}
        initialConsultas={pacienteResult.consultas}
        initialEstudios={pacienteResult.estudios}
        initialNovedades={pacienteResult.novedades}
        initialUltimoAnalisis={pacienteResult.ultimoAnalisis}
        initialContextoIa={pacienteResult.contextoIa}
        initialHistorialAsistente={pacienteResult.historialAsistente}
        initialGemelo={pacienteResult.gemelo}
        initialUltimaSimulacion={pacienteResult.ultimaSimulacion}
      />
    </div>
  );
}
