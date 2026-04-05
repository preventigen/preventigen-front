import { apiRequest } from "@/src/lib/api/http";
import { asRecord, pickArrayCandidate, toOptionalString, toStringValue } from "@/src/lib/api/parsers";
import type {
  AsistenteMedicoConsulta,
  CreateAsistenteMedicoDto,
  PacienteListado,
} from "@/src/lib/api/types";

function mapPacienteListado(raw: unknown): PacienteListado | null {
  const record = asRecord(raw);
  if (!record) return null;

  return {
    id: toStringValue(record.id) ?? "",
    nombre: toStringValue(record.nombre) ?? "",
    apellido: toStringValue(record.apellido) ?? "",
    fechaNacimiento: toStringValue(record.fechaNacimiento ?? record.fecha_nacimiento) ?? "",
    genero: record.genero === "F" ? "F" : "M",
  };
}

function mapAsistenteConsulta(raw: unknown): AsistenteMedicoConsulta {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Consulta del asistente medico invalida recibida desde backend.");
  }

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    medicoId: toOptionalString(record.medicoId ?? record.medico_id),
    consultaMedico: toStringValue(record.consultaMedico ?? record.consulta_medico) ?? "",
    promptEnviado: toOptionalString(record.promptEnviado ?? record.prompt_enviado),
    respuestaIA: toStringValue(record.respuestaIA ?? record.respuesta_ia) ?? "",
    modeloIAUtilizado: toOptionalString(record.modeloIAUtilizado ?? record.modelo_ia_utilizado),
    createdAt: toOptionalString(record.createdAt ?? record.created_at) ?? undefined,
    paciente: mapPacienteListado(record.paciente),
  };
}

function mapAsistenteCollection(payload: unknown): AsistenteMedicoConsulta[] {
  if (Array.isArray(payload)) {
    return payload.map(mapAsistenteConsulta);
  }

  const record = asRecord(payload);
  if (!record) return [];

  return pickArrayCandidate(record, ["consultas", "items", "results", "data"]).map(
    mapAsistenteConsulta
  );
}

function cleanPayload<T extends object>(payload: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  );
}

export async function createConsultaAsistenteMedico(
  dto: CreateAsistenteMedicoDto,
  token: string
): Promise<AsistenteMedicoConsulta> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/asistente-medico", {
    method: "POST",
    token,
    body: cleanPayload(dto),
  });

  return mapAsistenteConsulta(payload);
}

export async function listConsultasAsistenteByPaciente(
  pacienteId: string,
  token: string
): Promise<AsistenteMedicoConsulta[]> {
  const payload = await apiRequest<unknown>(`/asistente-medico/paciente/${pacienteId}`, {
    token,
  });

  return mapAsistenteCollection(payload);
}

export async function getConsultaAsistenteById(
  id: string,
  token: string
): Promise<AsistenteMedicoConsulta> {
  const payload = await apiRequest<unknown>(`/asistente-medico/${id}`, {
    token,
  });

  return mapAsistenteConsulta(payload);
}
