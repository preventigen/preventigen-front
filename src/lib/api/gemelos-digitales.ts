import { apiRequest } from "@/src/lib/api/http";
import type {
  ActualizarGemeloDigitalDto,
  CreateGemeloDigitalDto,
  GemeloDigital,
  PerfilMedico,
  SimulacionEcammResult,
  SimulacionTratamiento,
  SimularTratamientoDto,
} from "@/src/lib/api/types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (typeof value === "number") return String(value);
  return undefined;
}

function toNumberValue(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function toBooleanValue(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return undefined;
}

function toStringArray(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry.trim() : String(entry)))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function toStringOrStringArray(value: unknown): string | string[] | undefined {
  if (value === null || value === undefined) return undefined;
  if (Array.isArray(value)) return toStringArray(value);

  const stringValue = toStringValue(value);
  if (stringValue !== undefined) return stringValue;
  return undefined;
}

function mapPerfilMedico(raw: unknown): PerfilMedico | undefined {
  const record = asRecord(raw);
  if (!record) return undefined;

  return {
    edad: toNumberValue(record.edad),
    sexo: toStringValue(record.sexo),
    peso: toNumberValue(record.peso),
    altura: toNumberValue(record.altura),
    alergias: toStringArray(record.alergias),
    enfermedadesCronicas: toStringArray(record.enfermedadesCronicas),
    medicacionActual: toStringArray(record.medicacionActual),
    antecedentesQuirurgicos: toStringArray(record.antecedentesQuirurgicos),
    antecedentesFamiliares: toStringArray(record.antecedentesFamiliares),
    habitosVida: asRecord(record.habitosVida)
      ? {
          tabaquismo: toBooleanValue(asRecord(record.habitosVida)?.tabaquismo) ?? false,
          alcohol: toStringValue(asRecord(record.habitosVida)?.alcohol),
          ejercicio: toStringValue(asRecord(record.habitosVida)?.ejercicio),
          dieta: toStringValue(asRecord(record.habitosVida)?.dieta),
        }
      : undefined,
    signosVitales: asRecord(record.signosVitales)
      ? {
          presionArterial: toStringValue(asRecord(record.signosVitales)?.presionArterial),
          frecuenciaCardiaca: toNumberValue(asRecord(record.signosVitales)?.frecuenciaCardiaca),
          temperatura: toNumberValue(asRecord(record.signosVitales)?.temperatura),
          saturacionO2: toNumberValue(asRecord(record.signosVitales)?.saturacionO2),
        }
      : undefined,
  };
}

function mapSimulacionEcammResult(raw: unknown): SimulacionEcammResult | undefined {
  const record = asRecord(raw);
  if (!record) return undefined;

  return {
    ...record,
    efectividadEstimada:
      toNumberValue(record.efectividadEstimada ?? record.efectividad_estimada) ??
      toStringValue(record.efectividadEstimada ?? record.efectividad_estimada),
    probabilidadExito:
      toNumberValue(record.probabilidadExito ?? record.probabilidad_exito) ??
      toStringValue(record.probabilidadExito ?? record.probabilidad_exito),
    riesgos: toStringOrStringArray(record.riesgos),
    beneficios: toStringOrStringArray(record.beneficios),
    monitoreoCritico: toStringOrStringArray(
      record.monitoreoCritico ?? record.monitoreo_critico
    ),
    recomendaciones: toStringOrStringArray(record.recomendaciones),
  };
}

function mapSimulacionTratamiento(raw: unknown): SimulacionTratamiento {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Simulacion de tratamiento invalida recibida desde backend.");
  }

  return {
    ...record,
    id: toStringValue(record.id),
    gemeloDigitalId: toStringValue(record.gemeloDigitalId ?? record.gemelo_digital_id),
    tratamientoPropuesto: toStringValue(
      record.tratamientoPropuesto ?? record.tratamiento_propuesto
    ),
    dosisYDuracion: toStringValue(record.dosisYDuracion ?? record.dosis_y_duracion),
    analisisIA: mapSimulacionEcammResult(record.analisisIA ?? record.analisis_ia),
    prediccionRespuesta: mapSimulacionEcammResult(
      record.prediccionRespuesta ?? record.prediccion_respuesta
    ),
    createdAt: toStringValue(record.createdAt ?? record.created_at),
    updatedAt: toStringValue(record.updatedAt ?? record.updated_at),
  };
}

function mapSimulacionesCollection(raw: unknown): SimulacionTratamiento[] {
  if (Array.isArray(raw)) {
    return raw.map(mapSimulacionTratamiento);
  }

  const record = asRecord(raw);
  if (!record) return [];

  const candidates = [
    record.simulaciones,
    record.simulacionesTratamiento,
    record.simulaciones_tratamiento,
    record.items,
    record.results,
    record.data,
  ].find(Array.isArray);

  if (Array.isArray(candidates)) {
    return candidates.map(mapSimulacionTratamiento);
  }

  return [];
}

function getLatestSimulacion(
  simulaciones: SimulacionTratamiento[],
  rawUltimaSimulacion: unknown
): SimulacionTratamiento | null {
  if (rawUltimaSimulacion) {
    try {
      return mapSimulacionTratamiento(rawUltimaSimulacion);
    } catch {
      return null;
    }
  }

  if (simulaciones.length === 0) return null;

  return [...simulaciones].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  })[0];
}

function mapGemeloDigital(raw: unknown): GemeloDigital {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Gemelo digital invalido recibido desde backend.");
  }

  const estado = toStringValue(record.estado);
  const simulaciones = mapSimulacionesCollection(
    record.simulaciones ??
      record.simulacionesTratamiento ??
      record.simulaciones_tratamiento
  );

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    estado: estado === "generado" || estado === "error" || estado === "pendiente" ? estado : "pendiente",
    resumen: toStringValue(record.resumen),
    perfilMedico: mapPerfilMedico(record.perfilMedico ?? record.perfil_medico),
    simulaciones,
    ultimaSimulacion: getLatestSimulacion(
      simulaciones,
      record.ultimaSimulacion ?? record.ultima_simulacion
    ),
    createdAt: toStringValue(record.createdAt ?? record.created_at),
    updatedAt: toStringValue(record.updatedAt ?? record.updated_at),
  };
}

function extractGemeloPayload(raw: unknown): unknown {
  const record = asRecord(raw);
  if (!record) return raw;

  return (
    record.gemeloDigital ??
    record.gemelo_digital ??
    record.gemelo ??
    record.resultado ??
    record.result ??
    raw
  );
}

function extractSimulacionPayload(raw: unknown): unknown {
  const record = asRecord(raw);
  if (!record) return raw;

  return (
    record.simulacion ??
    record.simulacionTratamiento ??
    record.simulacion_tratamiento ??
    record.resultado ??
    record.result ??
    raw
  );
}

export async function createGemeloDigital(
  dto: CreateGemeloDigitalDto,
  token: string
): Promise<GemeloDigital> {
  const payload = await apiRequest<unknown, CreateGemeloDigitalDto>("/gemelos-digitales", {
    method: "POST",
    token,
    body: dto,
  });

  return mapGemeloDigital(extractGemeloPayload(payload));
}

export async function getGemeloDigitalByPacienteId(
  pacienteId: string,
  token: string
): Promise<GemeloDigital> {
  const payload = await apiRequest<unknown>(`/gemelos-digitales/paciente/${pacienteId}`, {
    token,
  });

  return mapGemeloDigital(extractGemeloPayload(payload));
}

export async function simularTratamientoGemelo(
  dto: SimularTratamientoDto,
  token: string
): Promise<SimulacionTratamiento> {
  const payload = await apiRequest<unknown, SimularTratamientoDto>("/gemelos-digitales/simular", {
    method: "POST",
    token,
    body: dto,
  });
  console.log("Payload recibido de simulacion de tratamiento:", payload);
  return mapSimulacionTratamiento(extractSimulacionPayload(payload));
}

export async function actualizarGemeloDigital(
  id: string,
  dto: ActualizarGemeloDigitalDto,
  token: string
): Promise<GemeloDigital> {
  const payload = await apiRequest<unknown, ActualizarGemeloDigitalDto>(
    `/gemelos-digitales/${id}/actualizar`,
    {
      method: "PATCH",
      token,
      body: dto,
    }
  );

  return mapGemeloDigital(extractGemeloPayload(payload));
}
