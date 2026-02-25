import { apiRequest } from "@/src/lib/api/http";
import type { CreateGemeloDigitalDto, GemeloDigital, PerfilMedico } from "@/src/lib/api/types";

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

function mapPerfilMedico(raw: unknown): PerfilMedico | undefined {
  const record = asRecord(raw);
  if (!record) return undefined;

  return {
    edad: toNumberValue(record.edad),
    sexo: toStringValue(record.sexo),
    peso: toNumberValue(record.peso),
    altura: toNumberValue(record.altura),
    alergias: toStringArray(record.alergias),
    enfermedadesCronicas: toStringArray(record.enfermedadesCronicas),
    medicacionActual: toStringArray(record.medicacionActual),
    antecedentesQuirurgicos: toStringArray(record.antecedentesQuirurgicos),
    antecedentesFamiliares: toStringArray(record.antecedentesFamiliares),
    habitosVida: asRecord(record.habitosVida)
      ? {
          tabaquismo: Boolean(asRecord(record.habitosVida)?.tabaquismo),
          alcohol: toStringValue(asRecord(record.habitosVida)?.alcohol),
          ejercicio: toStringValue(asRecord(record.habitosVida)?.ejercicio),
          dieta: toStringValue(asRecord(record.habitosVida)?.dieta),
        }
      : undefined,
    signosVitales: asRecord(record.signosVitales)
      ? {
          presionArterial: toStringValue(asRecord(record.signosVitales)?.presionArterial),
          frecuenciaCardiaca: toNumberValue(asRecord(record.signosVitales)?.frecuenciaCardiaca),
          temperatura: toNumberValue(asRecord(record.signosVitales)?.temperatura),
          saturacionO2: toNumberValue(asRecord(record.signosVitales)?.saturacionO2),
        }
      : undefined,
  };
}

function mapGemeloDigital(raw: unknown): GemeloDigital {
  const record = asRecord(raw);
  if (!record) {
    throw new Error("Gemelo digital invalido recibido desde backend.");
  }

  const estado = toStringValue(record.estado);

  return {
    id: toStringValue(record.id) ?? "",
    pacienteId: toStringValue(record.pacienteId) ?? "",
    estado: estado === "generado" || estado === "error" || estado === "pendiente" ? estado : "pendiente",
    resumen: toStringValue(record.resumen),
    perfilMedico: mapPerfilMedico(record.perfilMedico ?? record.perfil_medico),
    createdAt: toStringValue(record.createdAt ?? record.created_at),
    updatedAt: toStringValue(record.updatedAt ?? record.updated_at),
  };
}

export async function createGemeloDigital(
  dto: CreateGemeloDigitalDto,
  token: string
): Promise<GemeloDigital> {
  const payload = await apiRequest<unknown, CreateGemeloDigitalDto>("/gemelos-digitales", {
    method: "POST",
    token,
    body: dto,
  });

  return mapGemeloDigital(payload);
}
