import { apiRequest } from "@/src/lib/api/http";
import { asRecord, pickArrayCandidate, toArray, toOptionalString, toStringValue } from "@/src/lib/api/parsers";
import type {
  Consulta,
  CreatePacienteDto,
  EstudioMedico,
  GeneroPaciente,
  NovedadClinica,
  PacienteBase,
  PacienteDetalle,
  PacienteListado,
  PatchPacienteDatosMedicosDto,
  PatchPacienteDatosPersonalesDto,
} from "@/src/lib/api/types";

function mapGenero(value: unknown): GeneroPaciente {
  return value === "F" ? "F" : "M";
}

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
    genero: mapGenero(record.genero),
  };
}

function mapConsulta(raw: unknown): Consulta {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Consulta invalida recibida desde backend.");
  }

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId ?? record.paciente_id) ?? "",
    medicoId: toOptionalString(record.medicoId ?? record.medico_id),
    detalles: toOptionalString(record.detalles),
    tratamientoIndicado: toOptionalString(
      record.tratamientoIndicado ?? record.tratamiento_indicado
    ),
    estado: record.estado === "cerrada" || record.estado === "confirmada" ? record.estado : "borrador",
    createdAt: toOptionalString(record.createdAt ?? record.created_at) ?? undefined,
    updatedAt: toOptionalString(record.updatedAt ?? record.updated_at) ?? undefined,
  };
}

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

function mapPacienteBase(raw: unknown): PacienteBase {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Paciente invalido recibido desde backend.");
  }

  return {
    id: toStringValue(record.id) ?? "",
    medicoId: toOptionalString(record.medicoId ?? record.medico_id),
    nombre: toStringValue(record.nombre) ?? "",
    apellido: toStringValue(record.apellido) ?? "",
    fechaNacimiento: toStringValue(record.fechaNacimiento ?? record.fecha_nacimiento) ?? "",
    genero: mapGenero(record.genero),
    diagnosticoPrincipal: toOptionalString(
      record.diagnosticoPrincipal ?? record.diagnostico_principal
    ),
    antecedentesMedicos: toOptionalString(
      record.antecedentesMedicos ?? record.antecedentes_medicos
    ),
    medicacionActual: toOptionalString(record.medicacionActual ?? record.medicacion_actual),
    presionArterial: toOptionalString(record.presionArterial ?? record.presion_arterial),
    comentarios: toOptionalString(record.comentarios),
    alergias: toOptionalString(record.alergias),
    createdAt: toOptionalString(record.createdAt ?? record.created_at) ?? undefined,
    updatedAt: toOptionalString(record.updatedAt ?? record.updated_at) ?? undefined,
  };
}

function mapPacienteDetalle(raw: unknown): PacienteDetalle {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Paciente invalido recibido desde backend.");
  }

  return {
    ...mapPacienteBase(raw),
    consultas: toArray(record.consultas, mapConsulta),
    estudios: toArray(record.estudios, mapEstudio),
    novedades: toArray(record.novedades, mapNovedad),
  };
}

function mapPacientesCollection(payload: unknown): PacienteListado[] {
  if (Array.isArray(payload)) {
    return payload.map(mapPacienteListado);
  }

  const record = asRecord(payload);
  if (!record) return [];

  return pickArrayCandidate(record, ["pacientes", "items", "results", "data"]).map(
    mapPacienteListado
  );
}

function cleanCreateValue(value: unknown): unknown {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (Array.isArray(value)) {
    const cleanedItems = value
      .map((item) => cleanCreateValue(item))
      .filter((item) => item !== undefined);

    return cleanedItems.length > 0 ? cleanedItems : undefined;
  }

  if (typeof value === "object") {
    const cleanedEntries = Object.entries(value as Record<string, unknown>)
      .map(([key, nestedValue]) => [key, cleanCreateValue(nestedValue)] as const)
      .filter(([, nestedValue]) => nestedValue !== undefined);

    return cleanedEntries.length > 0 ? Object.fromEntries(cleanedEntries) : undefined;
  }

  return value;
}

function cleanCreatePayload<T extends object>(payload: T): Record<string, unknown> {
  return (cleanCreateValue(payload) as Record<string, unknown> | undefined) ?? {};
}

function cleanPatchPayload<T extends object>(payload: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

export async function createPaciente(dto: CreatePacienteDto, token: string): Promise<PacienteDetalle> {
  const payload = await apiRequest<unknown, Record<string, unknown>>("/pacientes", {
    method: "POST",
    token,
    body: cleanCreatePayload(dto),
  });

  return mapPacienteDetalle(payload);
}

export async function listPacientes(token: string): Promise<PacienteListado[]> {
  const payload = await apiRequest<unknown>("/pacientes", { token });
  return mapPacientesCollection(payload);
}

export async function getPacienteById(id: string, token: string): Promise<PacienteDetalle> {
  const payload = await apiRequest<unknown>(`/pacientes/${id}`, { token });
  return mapPacienteDetalle(payload);
}

export async function patchPacienteDatosPersonales(
  id: string,
  dto: PatchPacienteDatosPersonalesDto,
  token: string
): Promise<PacienteDetalle> {
  const payload = await apiRequest<unknown, Record<string, unknown>>(
    `/pacientes/${id}/datos-personales`,
    {
      method: "PATCH",
      token,
      body: cleanPatchPayload(dto),
    }
  );

  return mapPacienteDetalle(payload);
}

export async function patchPacienteDatosMedicos(
  id: string,
  dto: PatchPacienteDatosMedicosDto,
  token: string
): Promise<PacienteDetalle> {
  const payload = await apiRequest<unknown, Record<string, unknown>>(
    `/pacientes/${id}/datos-medicos`,
    {
      method: "PATCH",
      token,
      body: cleanPatchPayload(dto),
    }
  );

  return mapPacienteDetalle(payload);
}

export async function deletePaciente(id: string, token: string): Promise<void> {
  await apiRequest(`/pacientes/${id}`, {
    method: "DELETE",
    token,
  });
}
