export type AppRole = "medico" | "admin";

export type TipoDatoMedico =
  | "antecedente"
  | "diagnostico"
  | "medicacion"
  | "estudio"
  | "evolucion"
  | "otro";

export type TipoPrompt = "usuario" | "sistema";

export interface Paciente {
  id: string;
  nombre: string;
  edad?: number | null;
  telefono?: string | null;
  email?: string | null;
  alergias: string[];
  enfermedadesCronicas: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DatoMedico {
  id: string;
  pacienteId: string;
  tipo: TipoDatoMedico;
  contenido: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnalisisIA {
  id: string;
  pacienteId: string;
  datoMedicoId?: string | null;
  tipoPrompt?: TipoPrompt | null;
  promptUsuario?: string | null;
  respuesta: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  motivo?: string;
  estado?: string;
  fecha?: string;
}

export interface GemeloDigital {
  id: string;
  pacienteId: string;
  estado: "pendiente" | "generado" | "error";
  resumen?: string;
  perfilMedico?: PerfilMedico;
  createdAt?: string;
  updatedAt?: string;
}

export interface HabitosVida {
  tabaquismo: boolean;
  alcohol?: string;
  ejercicio?: string;
  dieta?: string;
}

export interface SignosVitales {
  presionArterial?: string;
  frecuenciaCardiaca?: number;
  temperatura?: number;
  saturacionO2?: number;
}

export interface PerfilMedico {
  edad?: number;
  sexo?: string;
  peso?: number;
  altura?: number;
  alergias: string[];
  enfermedadesCronicas: string[];
  medicacionActual: string[];
  antecedentesQuirurgicos: string[];
  antecedentesFamiliares: string[];
  habitosVida?: HabitosVida;
  signosVitales?: SignosVitales;
}

export interface CreatePacienteDto {
  nombre: string;
  edad?: number;
  telefono?: string;
  email?: string;
  alergias?: string[];
  enfermedadesCronicas?: string[];
}

export interface UpdatePacienteDto {
  nombre?: string;
  edad?: number;
  telefono?: string;
  email?: string;
  alergias?: string[];
  enfermedadesCronicas?: string[];
}

export interface CreateDatoMedicoDto {
  pacienteId: string;
  contenido: string;
  tipo: TipoDatoMedico;
}

export interface CreateAnalisisIaDto {
  pacienteId: string;
  datoMedicoId?: string;
  tipoPrompt?: TipoPrompt;
  promptUsuario?: string;
}

export interface CreateGemeloDigitalDto {
  pacienteId: string;
  perfilMedico: PerfilMedico;
}
