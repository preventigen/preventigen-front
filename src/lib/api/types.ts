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

export type EstadoConsulta = "borrador" | "confirmada" | "cerrada";

export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId?: string | null;
  motivo?: string | null;
  notas?: string | null;
  recomendacion?: string | null;
  estado?: EstadoConsulta | null;
  fecha?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SimulacionEcammResult extends Record<string, unknown> {
  efectividadEstimada?: number | string;
  probabilidadExito?: number | string;
  riesgos?: string[] | string;
  beneficios?: string[] | string;
  monitoreoCritico?: string[] | string;
  recomendaciones?: string[] | string;
}

export interface SimulacionTratamiento extends Record<string, unknown> {
  id?: string;
  gemeloDigitalId?: string;
  tratamientoPropuesto?: string;
  dosisYDuracion?: string;
  analisisIA?: SimulacionEcammResult;
  prediccionRespuesta?: SimulacionEcammResult;
  createdAt?: string;
  updatedAt?: string;
}

export interface GemeloDigital {
  id: string;
  pacienteId: string;
  estado: "pendiente" | "generado" | "error";
  resumen?: string;
  perfilMedico?: PerfilMedico;
  simulaciones?: SimulacionTratamiento[];
  ultimaSimulacion?: SimulacionTratamiento | null;
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

export interface SimularTratamientoDto {
  gemeloDigitalId: string;
  tratamientoPropuesto: string;
  dosisYDuracion?: string;
}

export interface ActualizarGemeloDigitalDto {
  consultaId: string;
  cambiosRealizados: string;
  datosActualizados: Partial<PerfilMedico> & Record<string, unknown>;
}
