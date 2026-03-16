import { apiRequest } from "@/src/lib/api/http";
import { asRecord, pickArrayCandidate, toArray, toNumberValue, toOptionalString, toStringArray, toStringValue } from "@/src/lib/api/parsers";
import type {
  ActualizarGemeloDigitalDto,
  CreateGemeloDigitalDto,
  GemeloDigital,
  HistorialGemeloDigital,
  SimulacionAnalisisIA,
  SimulacionPrediccionRespuesta,
  SimulacionTratamiento,
  SimularTratamientoDto,
} from "@/src/lib/api/types";

function mapHistorialItem(raw: unknown): HistorialGemeloDigital {
  const record = asRecord(raw);
  if (!record) {
    return {};
  }

  return {
    fecha: toOptionalString(record.fecha),
    consultaId: toOptionalString(record.consultaId ?? record.consulta_id),
    cambios: toOptionalString(record.cambios),
    datosMedicos: asRecord(record.datosMedicos ?? record.datos_medicos),
  };
}

function mapAnalisisIA(raw: unknown): SimulacionAnalisisIA | null {
  const record = asRecord(raw);
  if (!record) return null;

  return {
    efectividadEstimada: toNumberValue(record.efectividadEstimada ?? record.efectividad_estimada) ?? null,
    riesgos: toStringArray(record.riesgos),
    beneficios: toStringArray(record.beneficios),
    contraindicaciones: toStringArray(record.contraindicaciones),
    interaccionesMedicamentosas: toStringArray(
      record.interaccionesMedicamentosas ?? record.interacciones_medicamentosas
    ),
    efectosSecundariosProbables: toStringArray(
      record.efectosSecundariosProbables ?? record.efectos_secundarios_probables
    ),
    recomendaciones: toStringArray(record.recomendaciones),
    ajustesDosis: toOptionalString(record.ajustesDosis ?? record.ajustes_dosis),
    monitoreoCritico: toStringArray(record.monitoreoCritico ?? record.monitoreo_critico),
    alternativasSugeridas: Array.isArray(record.alternativasSugeridas)
      ? record.alternativasSugeridas.map((item) => {
          const alternative = asRecord(item);
          return {
            medicamento: toOptionalString(alternative?.medicamento),
            razon: toOptionalString(alternative?.razon),
          };
        })
      : undefined,
  };
}

function mapPrediccion(raw: unknown): SimulacionPrediccionRespuesta | null {
  const record = asRecord(raw);
  if (!record) return null;

  return {
    tiempoMejoriaEstimado: toOptionalString(
      record.tiempoMejoriaEstimado ?? record.tiempo_mejoria_estimado
    ),
    probabilidadExito: toNumberValue(record.probabilidadExito ?? record.probabilidad_exito) ?? null,
    factoresRiesgo: toStringArray(record.factoresRiesgo ?? record.factores_riesgo),
    parametrosMonitoreo: toStringArray(
      record.parametrosMonitoreo ?? record.parametros_monitoreo
    ),
  };
}

function mapSimulacion(raw: unknown): SimulacionTratamiento {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Simulacion invalida recibida desde backend.");
  }

  return {
    id: toStringValue(record.id) ?? "",
    gemeloDigitalId: toStringValue(record.gemeloDigitalId ?? record.gemelo_digital_id) ?? "",
    tratamientoPropuesto: toStringValue(
      record.tratamientoPropuesto ?? record.tratamiento_propuesto
    ) ?? "",
    dosisYDuracion: toOptionalString(record.dosisYDuracion ?? record.dosis_y_duracion),
    analisisIA: mapAnalisisIA(record.analisisIA ?? record.analisis_ia),
    prediccionRespuesta: mapPrediccion(
      record.prediccionRespuesta ?? record.prediccion_respuesta
    ),
    promptEnviado: toOptionalString(record.promptEnviado ?? record.prompt_enviado),
    respuestaCompletaIA: toOptionalString(
      record.respuestaCompletaIA ?? record.respuesta_completa_ia
    ),
    modeloIAUtilizado: toOptionalString(record.modeloIAUtilizado ?? record.modelo_ia_utilizado),
    createdAt: toOptionalString(record.createdAt ?? record.created_at) ?? undefined,
  };
}

function mapGemelo(raw: unknown): GemeloDigital {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Gemelo digital invalido recibido desde backend.");
  }

  const estado = record.estado;

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    medicoId: toOptionalString(record.medicoId ?? record.medico_id),
    historialActualizaciones: toArray(
      record.historialActualizaciones ?? record.historial_actualizaciones,
      mapHistorialItem
    ),
    estado:
      estado === "activo" || estado === "desactualizado" || estado === "actualizado"
        ? estado
        : "actualizado",
    createdAt: toOptionalString(record.createdAt ?? record.created_at) ?? undefined,
    updatedAt: toOptionalString(record.updatedAt ?? record.updated_at) ?? undefined,
    simulaciones: toArray(record.simulaciones, mapSimulacion),
  };
}

function mapSimulacionesCollection(payload: unknown): SimulacionTratamiento[] {
  if (Array.isArray(payload)) {
    return payload.map(mapSimulacion);
  }

  const record = asRecord(payload);
  if (!record) return [];

  return pickArrayCandidate(record, ["simulaciones", "items", "results", "data"]).map(mapSimulacion);
}

function cleanPayload<T extends object>(payload: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  );
}

export async function createGemeloDigital(
  dto: CreateGemeloDigitalDto,
  token: string
): Promise<GemeloDigital> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/gemelos-digitales", {
    method: "POST",
    token,
    body: cleanPayload(dto),
  });

  return mapGemelo(payload);
}

export async function getGemeloByPaciente(
  pacienteId: string,
  token: string
): Promise<GemeloDigital> {
  const payload = await apiRequest<unknown>(`/gemelos-digitales/paciente/${pacienteId}`, {
    token,
  });

  return mapGemelo(payload);
}

export async function simularTratamiento(
  dto: SimularTratamientoDto,
  token: string
): Promise<SimulacionTratamiento> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/gemelos-digitales/simular", {
    method: "POST",
    token,
    body: cleanPayload(dto),
  });

  return mapSimulacion(payload);
}

export async function listSimulaciones(
  gemeloDigitalId: string,
  token: string
): Promise<SimulacionTratamiento[]> {
  const payload = await apiRequest<unknown>(`/gemelos-digitales/${gemeloDigitalId}/simulaciones`, {
    token,
  });

  return mapSimulacionesCollection(payload);
}

export async function actualizarGemelo(
  id: string,
  dto: ActualizarGemeloDigitalDto,
  token: string
): Promise<GemeloDigital> {
  const payload = await apiRequest<unknown, Record<string, unknown>>(
    `/gemelos-digitales/${id}/actualizar`,
    {
      method: "PATCH",
      token,
      body: cleanPayload(dto),
    }
  );

  return mapGemelo(payload);
}
