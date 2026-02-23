import { apiRequest } from "@/src/lib/api/http";
import type {
  CreatePacienteDto,
  Paciente,
  UpdatePacienteDto,
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

function mapPaciente(raw: unknown): Paciente {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Paciente invalido recibido desde backend.");
  }

  const id = toStringValue(record.id) ?? "";
  const nombre = toStringValue(record.nombre) ?? "Paciente sin nombre";

  return {
    id,
    nombre,
    edad: toNumberValue(record.edad) ?? null,
    telefono: toStringValue(record.telefono) ?? null,
    email: toStringValue(record.email) ?? null,
    alergias: toStringArray(record.alergias),
    enfermedadesCronicas: toStringArray(
      record.enfermedadesCronicas ?? record.enfermedades_cronicas
    ),
    createdAt: toStringValue(record.createdAt ?? record.created_at),
    updatedAt: toStringValue(record.updatedAt ?? record.updated_at),
  };
}

function mapPacientesCollection(payload: unknown): Paciente[] {
  if (Array.isArray(payload)) {
    return payload.map(mapPaciente);
  }

  const record = asRecord(payload);
  if (!record) return [];

  const candidates = [
    record.pacientes,
    record.items,
    record.results,
    record.data,
  ].find(Array.isArray);

  if (Array.isArray(candidates)) {
    return candidates.map(mapPaciente);
  }

  return [];
}

function normalizePacienteDto(dto: CreatePacienteDto | UpdatePacienteDto) {
  const payload: Record<string, unknown> = {};

  if ("nombre" in dto && dto.nombre !== undefined) payload.nombre = dto.nombre;
  if ("edad" in dto && dto.edad !== undefined) payload.edad = dto.edad;
  if ("telefono" in dto && dto.telefono !== undefined) payload.telefono = dto.telefono;
  if ("email" in dto && dto.email !== undefined) payload.email = dto.email;
  if ("alergias" in dto && dto.alergias !== undefined) payload.alergias = dto.alergias;
  if ("enfermedadesCronicas" in dto && dto.enfermedadesCronicas !== undefined) {
    payload.enfermedadesCronicas = dto.enfermedadesCronicas;
  }

  return payload;
}

export async function listPacientes(token: string): Promise<Paciente[]> {
  const payload = await apiRequest<unknown>("/pacientes", { token });
  return mapPacientesCollection(payload);
}

export async function getPacienteById(id: string, token: string): Promise<Paciente> {
  const payload = await apiRequest<unknown>(`/pacientes/${id}`, { token });
  return mapPaciente(payload);
}

export async function createPaciente(
  dto: CreatePacienteDto,
  token: string
): Promise<Paciente> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/pacientes", {
    method: "POST",
    token,
    body: normalizePacienteDto(dto),
  });
  return mapPaciente(payload);
}

export async function updatePaciente(
  id: string,
  dto: UpdatePacienteDto,
  token: string
): Promise<Paciente> {
  const payload = await apiRequest<unknown, Record<string, unknown>>(`/pacientes/${id}`, {
    method: "PATCH",
    token,
    body: normalizePacienteDto(dto),
  });
  return mapPaciente(payload);
}

export async function deletePaciente(id: string, token: string): Promise<void> {
  await apiRequest<unknown>(`/pacientes/${id}`, {
    method: "DELETE",
    token,
  });
}
