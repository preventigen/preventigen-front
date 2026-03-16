import { apiRequest } from "@/src/lib/api/http";
import { asRecord, pickArrayCandidate, toOptionalString, toStringValue } from "@/src/lib/api/parsers";
import type { CreateEstudioMedicoDto, EstudioMedico } from "@/src/lib/api/types";

function mapEstudio(raw: unknown): EstudioMedico {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Estudio medico invalido recibido desde backend.");
  }

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    nombreEstudio: toStringValue(record.nombreEstudio ?? record.nombre_estudio) ?? "",
    fecha: toOptionalString(record.fecha),
    observaciones: toOptionalString(record.observaciones),
    createdAt: toOptionalString(record.createdAt ?? record.created_at) ?? undefined,
  };
}

function mapEstudiosCollection(payload: unknown): EstudioMedico[] {
  if (Array.isArray(payload)) {
    return payload.map(mapEstudio);
  }

  const record = asRecord(payload);
  if (!record) return [];

  return pickArrayCandidate(record, ["estudios", "items", "results", "data"]).map(mapEstudio);
}

function cleanPayload<T extends object>(payload: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  );
}

export async function createEstudioMedico(
  dto: CreateEstudioMedicoDto,
  token: string
): Promise<EstudioMedico> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/estudios-medicos", {
    method: "POST",
    token,
    body: cleanPayload(dto),
  });

  return mapEstudio(payload);
}

export async function listEstudiosByPaciente(
  pacienteId: string,
  token: string
): Promise<EstudioMedico[]> {
  const payload = await apiRequest<unknown>(`/estudios-medicos/paciente/${pacienteId}`, {
    token,
  });

  return mapEstudiosCollection(payload);
}

export async function deleteEstudio(id: string, token: string): Promise<void> {
  await apiRequest(`/estudios-medicos/${id}`, {
    method: "DELETE",
    token,
  });
}
