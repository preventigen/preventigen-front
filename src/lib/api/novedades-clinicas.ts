import { apiRequest } from "@/src/lib/api/http";
import { asRecord, pickArrayCandidate, toOptionalString, toStringValue } from "@/src/lib/api/parsers";
import type { CreateNovedadClinicaDto, NovedadClinica } from "@/src/lib/api/types";

function mapNovedad(raw: unknown): NovedadClinica {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Novedad clinica invalida recibida desde backend.");
  }

  const gravedad = record.gravedad;

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    tipoEvento: toOptionalString(record.tipoEvento ?? record.tipo_evento),
    descripcion: toOptionalString(record.descripcion),
    zonaAfectada: toOptionalString(record.zonaAfectada ?? record.zona_afectada),
    gravedad:
      gravedad === "leve" || gravedad === "moderada" || gravedad === "grave" ? gravedad : null,
    observaciones: toOptionalString(record.observaciones),
    createdAt: toOptionalString(record.createdAt ?? record.created_at) ?? undefined,
  };
}

function mapNovedadesCollection(payload: unknown): NovedadClinica[] {
  if (Array.isArray(payload)) {
    return payload.map(mapNovedad);
  }

  const record = asRecord(payload);
  if (!record) return [];

  return pickArrayCandidate(record, ["novedades", "items", "results", "data"]).map(mapNovedad);
}

function cleanPayload<T extends object>(payload: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  );
}

export async function createNovedad(
  dto: CreateNovedadClinicaDto,
  token: string
): Promise<NovedadClinica> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/novedades-clinicas", {
    method: "POST",
    token,
    body: cleanPayload(dto),
  });

  return mapNovedad(payload);
}

export async function listNovedadesByPaciente(
  pacienteId: string,
  token: string
): Promise<NovedadClinica[]> {
  const payload = await apiRequest<unknown>(`/novedades-clinicas/paciente/${pacienteId}`, {
    token,
  });

  return mapNovedadesCollection(payload);
}

export async function deleteNovedad(id: string, token: string): Promise<void> {
  await apiRequest(`/novedades-clinicas/${id}`, {
    method: "DELETE",
    token,
  });
}
