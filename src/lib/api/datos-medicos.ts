import { apiRequest } from "@/src/lib/api/http";
import { asRecord, pickArrayCandidate, toOptionalString, toStringValue } from "@/src/lib/api/parsers";
import type { CreateDatoMedicoDto, DatoMedico, TipoDatoMedico, UpdateDatoMedicoDto } from "@/src/lib/api/types";

const TIPOS_DATO_MEDICO: TipoDatoMedico[] = [
  "antecedente",
  "diagnostico",
  "medicacion",
  "estudio",
  "evolucion",
  "otro",
];

function mapTipoDato(value: unknown): TipoDatoMedico {
  return typeof value === "string" && TIPOS_DATO_MEDICO.includes(value as TipoDatoMedico)
    ? (value as TipoDatoMedico)
    : "otro";
}

function mapDatoMedico(raw: unknown): DatoMedico {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Dato medico invalido recibido desde backend.");
  }

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    medicoId: toOptionalString(record.medicoId ?? record.medico_id),
    contenido: toStringValue(record.contenido) ?? "",
    tipo: mapTipoDato(record.tipo),
    fechaCarga: toOptionalString(record.fechaCarga ?? record.fecha_carga),
    createdAt: toOptionalString(record.createdAt ?? record.created_at) ?? undefined,
    updatedAt: toOptionalString(record.updatedAt ?? record.updated_at) ?? undefined,
  };
}

function mapDatosCollection(payload: unknown): DatoMedico[] {
  if (Array.isArray(payload)) {
    return payload.map(mapDatoMedico);
  }

  const record = asRecord(payload);
  if (!record) return [];

  return pickArrayCandidate(record, ["datosMedicos", "datos_medicos", "items", "results", "data"]).map(
    mapDatoMedico
  );
}

function cleanCreatePayload<T extends object>(payload: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  );
}

function cleanPatchPayload<T extends object>(payload: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

export async function listDatosMedicosByPaciente(
  pacienteId: string,
  token: string
): Promise<DatoMedico[]> {
  const payload = await apiRequest<unknown>(`/datos-medicos/paciente/${pacienteId}`, { token });
  return mapDatosCollection(payload);
}

export async function createDatoMedico(
  dto: CreateDatoMedicoDto,
  token: string
): Promise<DatoMedico> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/datos-medicos", {
    method: "POST",
    token,
    body: cleanCreatePayload(dto),
  });

  return mapDatoMedico(payload);
}

export async function updateDatoMedico(
  id: string,
  dto: UpdateDatoMedicoDto,
  token: string
): Promise<DatoMedico> {
  const payload = await apiRequest<unknown, Record<string, unknown>>(`/datos-medicos/${id}`, {
    method: "PATCH",
    token,
    body: cleanPatchPayload(dto),
  });

  return mapDatoMedico(payload);
}

export async function deleteDatoMedico(id: string, token: string): Promise<void> {
  await apiRequest(`/datos-medicos/${id}`, {
    method: "DELETE",
    token,
  });
}
