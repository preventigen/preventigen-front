import { apiRequest } from "@/src/lib/api/http";
import { asRecord, pickArrayCandidate, toOptionalString, toStringValue } from "@/src/lib/api/parsers";
import type {
  Consulta,
  CreateConsultaDto,
  PacienteListado,
  UpdateConsultaDto,
} from "@/src/lib/api/types";

function mapPacienteListado(raw: unknown): PacienteListado {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Paciente invalido recibido desde backend.");
  }

  return {
    id: toStringValue(record.id) ?? "",
    nombre: toStringValue(record.nombre) ?? "",
    apellido: toStringValue(record.apellido) ?? "",
    fechaNacimiento: toStringValue(record.fechaNacimiento ?? record.fecha_nacimiento) ?? "",
    genero: record.genero === "F" ? "F" : "M",
  };
}

function mapConsulta(raw: unknown): Consulta {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Consulta invalida recibida desde backend.");
  }

  const estado = record.estado;

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    medicoId: toOptionalString(record.medicoId ?? record.medico_id),
    detalles: toOptionalString(record.detalles),
    tratamientoIndicado: toOptionalString(
      record.tratamientoIndicado ?? record.tratamiento_indicado
    ),
    estado: estado === "cerrada" || estado === "confirmada" ? estado : "borrador",
    createdAt: toOptionalString(record.createdAt ?? record.created_at) ?? undefined,
    updatedAt: toOptionalString(record.updatedAt ?? record.updated_at) ?? undefined,
    paciente: record.paciente ? mapPacienteListado(record.paciente) : null,
  };
}

function mapConsultasCollection(payload: unknown): Consulta[] {
  if (Array.isArray(payload)) {
    return payload.map(mapConsulta);
  }

  const record = asRecord(payload);
  if (!record) return [];

  return pickArrayCandidate(record, ["consultas", "items", "results", "data"]).map(mapConsulta);
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

export async function createConsulta(dto: CreateConsultaDto, token: string): Promise<Consulta> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/consultas", {
    method: "POST",
    token,
    body: cleanCreatePayload(dto),
  });

  return mapConsulta(payload);
}

export async function listConsultas(token: string): Promise<Consulta[]> {
  const payload = await apiRequest<unknown>("/consultas", { token });
  return mapConsultasCollection(payload);
}

export async function listConsultasByPaciente(
  pacienteId: string,
  token: string
): Promise<Consulta[]> {
  const payload = await apiRequest<unknown>(`/consultas/paciente/${pacienteId}`, { token });
  return mapConsultasCollection(payload);
}

export async function updateConsulta(
  id: string,
  dto: UpdateConsultaDto,
  token: string
): Promise<Consulta> {
  const payload = await apiRequest<unknown, Record<string, unknown>>(`/consultas/${id}`, {
    method: "PATCH",
    token,
    body: cleanPatchPayload(dto),
  });

  return mapConsulta(payload);
}

export async function cerrarConsulta(id: string, token: string): Promise<Consulta> {
  const payload = await apiRequest<unknown>(`/consultas/${id}/cerrar`, {
    method: "POST",
    token,
  });

  return mapConsulta(payload);
}
