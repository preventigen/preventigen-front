import { apiRequest } from "@/src/lib/api/http";
import { asRecord, pickArrayCandidate, toOptionalString, toStringValue } from "@/src/lib/api/parsers";
import type { AnalisisIA, ContextoAnalisisIA, CreateAnalisisIaDto, TipoPrompt } from "@/src/lib/api/types";

function mapTipoPrompt(value: unknown): TipoPrompt | null {
  return value === "sistema" || value === "usuario" ? value : null;
}

function mapAnalisis(raw: unknown): AnalisisIA {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Analisis IA invalido recibido desde backend.");
  }

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    datoMedicoId: toOptionalString(record.datoMedicoId ?? record.dato_medico_id),
    gemeloDigitalId: toOptionalString(record.gemeloDigitalId ?? record.gemelo_digital_id),
    tipoPrompt: mapTipoPrompt(record.tipoPrompt ?? record.tipo_prompt),
    prompt: toOptionalString(record.prompt),
    promptUsuario: toOptionalString(record.promptUsuario ?? record.prompt_usuario),
    respuestaIA: toStringValue(record.respuestaIA ?? record.respuesta_ia) ?? "",
    resumenContexto: toOptionalString(record.resumenContexto ?? record.resumen_contexto),
    fechaGeneracion: toOptionalString(record.fechaGeneracion ?? record.fecha_generacion),
  };
}

function mapAnalisisCollection(payload: unknown): AnalisisIA[] {
  if (Array.isArray(payload)) {
    return payload.map(mapAnalisis);
  }

  const record = asRecord(payload);
  if (!record) return [];

  return pickArrayCandidate(record, ["analisis", "analisisIa", "items", "results", "data"]).map(
    mapAnalisis
  );
}

function cleanPayload<T extends object>(payload: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  );
}

export async function createAnalisis(
  dto: CreateAnalisisIaDto,
  token: string
): Promise<AnalisisIA> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/analisis-ia", {
    method: "POST",
    token,
    body: cleanPayload(dto),
  });

  return mapAnalisis(payload);
}

export async function getUltimoAnalisis(
  pacienteId: string,
  token: string
): Promise<AnalisisIA | null> {
  try {
    const payload = await apiRequest<unknown>(`/analisis-ia/paciente/${pacienteId}/ultimo`, {
      token,
    });
    return mapAnalisis(payload);
  } catch {
    return null;
  }
}

export async function listAnalisisByPaciente(
  pacienteId: string,
  token: string
): Promise<AnalisisIA[]> {
  const payload = await apiRequest<unknown>(`/analisis-ia/paciente/${pacienteId}`, {
    token,
  });
  return mapAnalisisCollection(payload);
}

export async function getContexto(
  pacienteId: string,
  token: string
): Promise<ContextoAnalisisIA | null> {
  const payload = await apiRequest<unknown>(`/analisis-ia/paciente/${pacienteId}/contexto`, {
    token,
  });

  if (payload === null) return null;

  const record = asRecord(payload);
  if (!record) {
    throw new Error("Contexto IA invalido recibido desde backend.");
  }

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    registroIA: toStringValue(record.registroIA ?? record.registro_ia) ?? "",
    fechaRegistro: toOptionalString(record.fechaRegistro ?? record.fecha_registro),
  };
}
