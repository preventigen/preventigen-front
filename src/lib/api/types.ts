export type AppRole = "medico" | "admin";

export type GeneroPaciente = "M" | "F";

export type TipoDatoMedico =
  | "antecedente"
  | "diagnostico"
  | "medicacion"
  | "estudio"
  | "evolucion"
  | "otro";

export type TipoPrompt = "usuario" | "sistema";

export type EstadoConsulta = "borrador" | "confirmada" | "cerrada";

export type GravedadNovedad = "leve" | "moderada" | "grave";

export type EstadoGemeloDigital = "activo" | "desactualizado" | "actualizado";

export interface PacienteBase {
  id: string;
  medicoId?: string | null;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: GeneroPaciente;
  diagnosticoPrincipal?: string | null;
  antecedentesMedicos?: string | null;
  medicacionActual?: string | null;
  presionArterial?: string | null;
  comentarios?: string | null;
  alergias?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PacienteListado {
  id: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: GeneroPaciente;
}

export interface DatoMedico {
  id: string;
  pacienteId: string;
  medicoId?: string | null;
  contenido: string;
  tipo: TipoDatoMedico;
  fechaCarga?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface EstudioMedico {
  id: string;
  pacienteId: string;
  nombreEstudio: string;
  fecha?: string | null;
  observaciones?: string | null;
  createdAt?: string;
}

export interface NovedadClinica {
  id: string;
  pacienteId: string;
  tipoEvento?: string | null;
  descripcion?: string | null;
  zonaAfectada?: string | null;
  gravedad?: GravedadNovedad | null;
  observaciones?: string | null;
  createdAt?: string;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId?: string | null;
  detalles?: string | null;
  tratamientoIndicado?: string | null;
  estado: EstadoConsulta;
  createdAt?: string;
  updatedAt?: string;
  paciente?: PacienteListado | null;
}

export interface AnalisisIA {
  id: string;
  pacienteId: string;
  datoMedicoId?: string | null;
  gemeloDigitalId?: string | null;
  tipoPrompt?: TipoPrompt | null;
  prompt?: string | null;
  promptUsuario?: string | null;
  respuestaIA: string;
  resumenContexto?: string | null;
  fechaGeneracion?: string | null;
  datoMedico?: DatoMedico | null;
}

export interface ContextoAnalisisIA {
  id: string;
  pacienteId: string;
  registroIA: string;
  fechaRegistro?: string | null;
}

export interface HistorialGemeloDigital {
  fecha?: string | null;
  consultaId?: string | null;
  cambios?: string | null;
  datosMedicos?: Record<string, unknown> | null;
}

export interface SimulacionAnalisisIA {
  efectividadEstimada?: number | null;
  coherenciaClinica?: number | null;
  riesgos?: string[];
  beneficios?: string[];
  contraindicaciones?: string[];
  interaccionesMedicamentosas?: string[];
  efectosSecundariosProbables?: string[];
  recomendaciones?: string[];
  ajustesDosis?: string | null;
  monitoreoCritico?: string[];
  alternativasSugeridas?: Array<{
    medicamento?: string | null;
    razon?: string | null;
  }>;
}

export interface SimulacionPrediccionRespuesta {
  tiempoMejoriaEstimado?: string | null;
  probabilidadExito?: number | null;
  factoresRiesgo?: string[];
  parametrosMonitoreo?: string[];
}

export interface SimulacionTratamiento {
  id: string;
  gemeloDigitalId: string;
  motivoConsulta?: string | null;
  tratamientoPropuesto: string;
  dosisYDuracion?: string | null;
  analisisIA?: SimulacionAnalisisIA | null;
  prediccionRespuesta?: SimulacionPrediccionRespuesta | null;
  promptEnviado?: string | null;
  respuestaCompletaIA?: string | null;
  noRecomendado?: boolean;
  modeloIAUtilizado?: string | null;
  createdAt?: string;
}

export interface GemeloDigital {
  id: string;
  pacienteId: string;
  medicoId?: string | null;
  historialActualizaciones: HistorialGemeloDigital[];
  estado: EstadoGemeloDigital;
  createdAt?: string;
  updatedAt?: string;
  paciente?: PacienteListado | null;
  simulaciones?: SimulacionTratamiento[];
}

export interface PacienteDetalle extends PacienteBase {
  consultas: Consulta[];
  estudios: EstudioMedico[];
  novedades: NovedadClinica[];
}

export interface CreatePacienteEstudioDto {
  nombreEstudio: string;
  fecha?: string;
  observaciones?: string;
}

export interface CreatePacienteNovedadDto {
  tipoEvento?: string;
  descripcion?: string;
  zonaAfectada?: string;
  gravedad?: GravedadNovedad;
  observaciones?: string;
}

export interface CreatePacienteDto {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: GeneroPaciente;
  diagnosticoPrincipal?: string;
  antecedentesMedicos?: string;
  medicacionActual?: string;
  presionArterial?: string;
  comentarios?: string;
  alergias?: string;
  estudios?: CreatePacienteEstudioDto[];
  novedades?: CreatePacienteNovedadDto[];
}

export interface PatchPacienteDatosPersonalesDto {
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: string;
  genero?: GeneroPaciente;
}

export interface PatchPacienteDatosMedicosDto {
  diagnosticoPrincipal?: string;
  antecedentesMedicos?: string;
  medicacionActual?: string;
  presionArterial?: string;
  comentarios?: string;
  alergias?: string;
}

export interface CreateDatoMedicoDto {
  pacienteId: string;
  contenido: string;
  tipo?: TipoDatoMedico;
}

export interface UpdateDatoMedicoDto {
  contenido?: string;
  tipo?: TipoDatoMedico;
}

export interface CreateGemeloDigitalDto {
  pacienteId: string;
}

export interface SimularTratamientoDto {
  gemeloDigitalId: string;
  motivoConsulta: string;
  tratamientoPropuesto: string;
  dosisYDuracion?: string;
}

export interface ActualizarGemeloDigitalDto {
  consultaId: string;
  cambiosRealizados: string;
  datosActualizados: Record<string, unknown>;
}

export interface CreateEstudioMedicoDto {
  pacienteId: string;
  nombreEstudio: string;
  fecha?: string;
  observaciones?: string;
}

export interface CreateNovedadClinicaDto {
  pacienteId: string;
  tipoEvento?: string;
  descripcion?: string;
  zonaAfectada?: string;
  gravedad?: GravedadNovedad;
  observaciones?: string;
}

export interface CreateConsultaDto {
  pacienteId: string;
  detalles?: string;
  tratamientoIndicado?: string;
}

export interface UpdateConsultaDto {
  detalles?: string;
  tratamientoIndicado?: string;
}

export interface CreateAnalisisIaDto {
  pacienteId: string;
  datoMedicoId?: string;
  tipoPrompt?: TipoPrompt;
  promptUsuario?: string;
}

export interface AsistenteMedicoConsulta {
  id: string;
  pacienteId: string;
  medicoId?: string | null;
  consultaMedico: string;
  promptEnviado?: string | null;
  respuestaIA: string;
  modeloIAUtilizado?: string | null;
  createdAt?: string;
  paciente?: PacienteListado | null;
}

export interface CreateAsistenteMedicoDto {
  pacienteId: string;
  consultaMedico: string;
}
