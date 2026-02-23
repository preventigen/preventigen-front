import { apiRequest } from "@/src/lib/api/http";
import type {
  AnalisisIA,
  CreateAnalisisIaDto,
  TipoPrompt,
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

function mapTipoPrompt(value: unknown): TipoPrompt | null {
  if (value === "usuario" || value === "sistema") return value;
  return null;
}

function mapAnalisis(raw: unknown): AnalisisIA {
  const record = asRecord(raw);
  if (!record) throw new Error("Analisis IA invalido recibido desde backend.");

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    datoMedicoId: toStringValue(record.datoMedicoId ?? record.dato_medico_id) ?? null,
    tipoPrompt: mapTipoPrompt(record.tipoPrompt ?? record.tipo_prompt),
    promptUsuario: toStringValue(record.promptUsuario ?? record.prompt_usuario) ?? null,
    respuesta: toStringValue(record.respuesta ?? record.resultado ?? record.response) ?? "",
    createdAt: toStringValue(record.createdAt ?? record.created_at),
    updatedAt: toStringValue(record.updatedAt ?? record.updated_at),
  };
}

function mapAnalisisCollection(payload: unknown): AnalisisIA[] {
  if (Array.isArray(payload)) {
    return payload.map(mapAnalisis);
  }

  const record = asRecord(payload);
  if (!record) return [];

  const candidates = [
    record.analisis,
    record.analisisIa,
    record.analisis_ia,
    record.items,
    record.results,
    record.data,
  ].find(Array.isArray);

  if (Array.isArray(candidates)) {
    return candidates.map(mapAnalisis);
  }

  return [];
}

export async function listAnalisisIaByPaciente(
  pacienteId: string,
  token: string
): Promise<AnalisisIA[]> {
  const payload = await apiRequest<unknown>(`/analisis-ia/paciente/${pacienteId}`, {
    token,
  });
  return mapAnalisisCollection(payload);
}

export async function getUltimoAnalisisIaByPaciente(
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

export async function createAnalisisIa(
  dto: CreateAnalisisIaDto,
  token: string
): Promise<AnalisisIA> {
  const payload = await apiRequest<unknown, CreateAnalisisIaDto>("/analisis-ia", {
    method: "POST",
    token,
    body: dto,
  });
  return mapAnalisis(payload);
}

export async function getAnalisisIaById(analisisId: string, token: string): Promise<AnalisisIA> {
  const payload = await apiRequest<unknown>(`/analisis-ia/${analisisId}`, { token });
  return mapAnalisis(payload);
}
