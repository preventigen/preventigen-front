import { apiRequest } from "@/src/lib/api/http";
import type { Consulta, EstadoConsulta } from "@/src/lib/api/types";

const ESTADOS_CONSULTA: EstadoConsulta[] = ["borrador", "confirmada", "cerrada"];

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim().length > 0) return value;
  if (typeof value === "number") return String(value);
  return undefined;
}

function mapEstadoConsulta(value: unknown): EstadoConsulta | null {
  if (typeof value === "string" && ESTADOS_CONSULTA.includes(value as EstadoConsulta)) {
    return value as EstadoConsulta;
  }

  return null;
}

function mapConsulta(raw: unknown): Consulta {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Consulta invalida recibida desde backend.");
  }

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    medicoId: toStringValue(record.medicoId ?? record.medico_id) ?? null,
    motivo: toStringValue(record.motivo) ?? null,
    notas: toStringValue(record.notas) ?? null,
    recomendacion: toStringValue(record.recomendacion) ?? null,
    estado: mapEstadoConsulta(record.estado),
    fecha:
      toStringValue(record.fecha ?? record.fechaConsulta ?? record.fecha_consulta) ?? null,
    createdAt: toStringValue(record.createdAt ?? record.created_at),
    updatedAt: toStringValue(record.updatedAt ?? record.updated_at),
  };
}

function mapConsultasCollection(payload: unknown): Consulta[] {
  if (Array.isArray(payload)) {
    return payload.map(mapConsulta);
  }

  const record = asRecord(payload);
  if (!record) return [];

  const candidates = [
    record.consultas,
    record.items,
    record.results,
    record.data,
  ].find(Array.isArray);

  if (Array.isArray(candidates)) {
    return candidates.map(mapConsulta);
  }

  return [];
}

export async function listConsultas(token: string): Promise<Consulta[]> {
  const payload = await apiRequest<unknown>("/consultas", { token });
  return mapConsultasCollection(payload);
}
