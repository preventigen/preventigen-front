import type { GravedadNovedad, TipoDatoMedico } from "@/src/lib/api/types";

export const TIPOS_DATO_MEDICO: TipoDatoMedico[] = [
  "antecedente",
  "diagnostico",
  "medicacion",
  "estudio",
  "evolucion",
  "otro",
];

export const GRAVEDADES: GravedadNovedad[] = ["leve", "moderada", "grave"];

export type DetailTabValue =
  | "resumen"
  | "datos-medicos"
  | "estudios"
  | "novedades"
  | "consultas"
  | "ia"
  | "gemelo";

export type PendingMap = {
  datosMedicos?: boolean;
  estudios?: boolean;
  novedades?: boolean;
  consultas?: boolean;
  analisis?: boolean;
  asistente?: boolean;
  simulacion?: boolean;
  gemelo?: boolean;
};

export interface DatoMedicoFormState {
  tipo: TipoDatoMedico;
  contenido: string;
}

export interface EstudioFormState {
  nombreEstudio: string;
  fecha: string;
  observaciones: string;
}

export interface NovedadFormState {
  tipoEvento: string;
  descripcion: string;
  zonaAfectada: string;
  gravedad: GravedadNovedad | "";
  observaciones: string;
}

export interface ConsultaFormState {
  detalles: string;
  tratamientoIndicado: string;
}

export interface AnalisisFormState {
  datoMedicoId: string;
  promptUsuario: string;
}

export interface SimulacionFormState {
  motivoConsulta: string;
  tratamientoPropuesto: string;
  dosisYDuracion: string;
}

export interface AsistenteMedicoFormState {
  consultaMedico: string;
}

export interface GemeloUpdateFormState {
  consultaId: string;
  cambiosRealizados: string;
  datosActualizados: string;
}

export const DETAIL_TAB_VALUES: DetailTabValue[] = [
  "resumen",
  "datos-medicos",
  "estudios",
  "novedades",
  "consultas",
  "ia",
  "gemelo",
];

export function isDetailTabValue(value: string | null | undefined): value is DetailTabValue {
  return value !== null && value !== undefined && DETAIL_TAB_VALUES.includes(value as DetailTabValue);
}

export function sortByNewest<T extends { createdAt?: string; fechaCarga?: string | null }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aValue = a.createdAt ?? a.fechaCarga ?? "";
    const bValue = b.createdAt ?? b.fechaCarga ?? "";
    return new Date(bValue).getTime() - new Date(aValue).getTime();
  });
}

export function cleanObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== "")
  ) as T;
}
