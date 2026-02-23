import { apiRequest } from "@/src/lib/api/http";
import type {
  CreateDatoMedicoDto,
  DatoMedico,
  TipoDatoMedico,
} from "@/src/lib/api/types";

const TIPOS_DATO_MEDICO: TipoDatoMedico[] = [
  "antecedente",
  "diagnostico",
  "medicacion",
  "estudio",
  "evolucion",
  "otro",
];

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (typeof value === "number") return String(value);
  return undefined;
}

function mapTipoDatoMedico(value: unknown): TipoDatoMedico {
  if (typeof value === "string" && TIPOS_DATO_MEDICO.includes(value as TipoDatoMedico)) {
    return value as TipoDatoMedico;
  }

  return "otro";
}

function mapDatoMedico(raw: unknown): DatoMedico {
  const record = asRecord(raw);
  if (!record) throw new Error("Dato medico invalido recibido desde backend.");

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    tipo: mapTipoDatoMedico(record.tipo),
    contenido: toStringValue(record.contenido) ?? "",
    createdAt: toStringValue(record.createdAt ?? record.created_at),
    updatedAt: toStringValue(record.updatedAt ?? record.updated_at),
  };
}

function mapDatosCollection(payload: unknown): DatoMedico[] {
  if (Array.isArray(payload)) {
    return payload.map(mapDatoMedico);
  }

  const record = asRecord(payload);
  if (!record) return [];

  const candidates = [
    record.datosMedicos,
    record.datos_medicos,
    record.items,
    record.results,
    record.data,
  ].find(Array.isArray);

  if (Array.isArray(candidates)) {
    return candidates.map(mapDatoMedico);
  }

  return [];
}

export async function listDatosMedicosByPaciente(
  pacienteId: string,
  token: string
): Promise<DatoMedico[]> {
  const payload = await apiRequest<unknown>(`/datos-medicos/paciente/${pacienteId}`, {
    token,
  });
  return mapDatosCollection(payload);
}

export async function createDatoMedico(
  dto: CreateDatoMedicoDto,
  token: string
): Promise<DatoMedico> {
  const payload = await apiRequest<unknown, CreateDatoMedicoDto>("/datos-medicos", {
    method: "POST",
    token,
    body: dto,
  });
  return mapDatoMedico(payload);
}
