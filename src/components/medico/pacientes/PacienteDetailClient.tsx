"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Badge } from "@/src/components/magic/ui/badge";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { Input } from "@/src/components/magic/ui/input";
import { Label } from "@/src/components/magic/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/magic/ui/select";
import { Textarea } from "@/src/components/magic/ui/textarea";
import { createAnalisis, getContexto } from "@/src/lib/api/analisis-ia";
import { cerrarConsulta, createConsulta, updateConsulta } from "@/src/lib/api/consultas";
import {
  createDatoMedico,
  deleteDatoMedico,
  updateDatoMedico,
} from "@/src/lib/api/datos-medicos";
import { createEstudioMedico, deleteEstudio } from "@/src/lib/api/estudios-medicos";
import { actualizarGemelo, simularTratamiento } from "@/src/lib/api/gemelos-digitales";
import { isApiError } from "@/src/lib/api/http";
import { createNovedad, deleteNovedad } from "@/src/lib/api/novedades-clinicas";
import { formatDate, formatDateTime, textPreview } from "@/src/lib/formatters";
import type {
  AnalisisIA,
  ContextoAnalisisIA,
  Consulta,
  DatoMedico,
  EstudioMedico,
  GemeloDigital,
  GravedadNovedad,
  NovedadClinica,
  PacienteDetalle,
  SimulacionTratamiento,
  TipoDatoMedico,
} from "@/src/lib/api/types";

interface PacienteDetailClientProps {
  token: string;
  paciente: PacienteDetalle;
  initialDatosMedicos: DatoMedico[];
  initialConsultas: Consulta[];
  initialEstudios: EstudioMedico[];
  initialNovedades: NovedadClinica[];
  initialUltimoAnalisis: AnalisisIA | null;
  initialContextoIa: ContextoAnalisisIA | null;
  initialGemelo: GemeloDigital | null;
  initialUltimaSimulacion: SimulacionTratamiento | null;
}

const TIPOS_DATO_MEDICO: TipoDatoMedico[] = [
  "antecedente",
  "diagnostico",
  "medicacion",
  "estudio",
  "evolucion",
  "otro",
];

const GRAVEDADES: GravedadNovedad[] = ["leve", "moderada", "grave"];

function sortByNewest<T extends { createdAt?: string; fechaCarga?: string | null }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aValue = a.createdAt ?? a.fechaCarga ?? "";
    const bValue = b.createdAt ?? b.fechaCarga ?? "";
    return new Date(bValue).getTime() - new Date(aValue).getTime();
  });
}

function cleanObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== "")
  ) as T;
}

function Message({
  tone,
  message,
}: {
  tone: "error" | "success" | "warning";
  message: string | null;
}) {
  if (!message) return null;

  const toneClass =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return <p className={`rounded-md border px-3 py-2 text-sm ${toneClass}`}>{message}</p>;
}

export function PacienteDetailClient({
  token,
  paciente,
  initialDatosMedicos,
  initialConsultas,
  initialEstudios,
  initialNovedades,
  initialUltimoAnalisis,
  initialContextoIa,
  initialGemelo,
  initialUltimaSimulacion,
}: PacienteDetailClientProps) {
  const router = useRouter();
  const [datosMedicos, setDatosMedicos] = useState(() => sortByNewest(initialDatosMedicos));
  const [consultas, setConsultas] = useState(() => sortByNewest(initialConsultas));
  const [estudios, setEstudios] = useState(() => sortByNewest(initialEstudios));
  const [novedades, setNovedades] = useState(() => sortByNewest(initialNovedades));
  const [ultimoAnalisis, setUltimoAnalisis] = useState(initialUltimoAnalisis);
  const [contextoIa, setContextoIa] = useState(initialContextoIa);
  const [gemelo, setGemelo] = useState(initialGemelo);
  const [ultimaSimulacion, setUltimaSimulacion] = useState(initialUltimaSimulacion);

  const [datoTipo, setDatoTipo] = useState<TipoDatoMedico>("otro");
  const [datoContenido, setDatoContenido] = useState("");
  const [editingDatoId, setEditingDatoId] = useState<string | null>(null);
  const [editingDatoTipo, setEditingDatoTipo] = useState<TipoDatoMedico>("otro");
  const [editingDatoContenido, setEditingDatoContenido] = useState("");
  const [estudioForm, setEstudioForm] = useState({ nombreEstudio: "", fecha: "", observaciones: "" });
  const [novedadForm, setNovedadForm] = useState({
    tipoEvento: "",
    descripcion: "",
    zonaAfectada: "",
    gravedad: "" as GravedadNovedad | "",
    observaciones: "",
  });
  const [consultaForm, setConsultaForm] = useState({ detalles: "", tratamientoIndicado: "" });
  const [analisisForm, setAnalisisForm] = useState({ datoMedicoId: "all", promptUsuario: "" });
  const [simulacionForm, setSimulacionForm] = useState({ tratamientoPropuesto: "", dosisYDuracion: "" });
  const [gemeloUpdateForm, setGemeloUpdateForm] = useState({
    consultaId: "",
    cambiosRealizados: "",
    datosActualizados: "{\n  \"presionArterial\": \"\"\n}",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  const activeConsulta = useMemo(
    () => consultas.find((consulta) => consulta.estado === "borrador") ?? null,
    [consultas]
  );

  useEffect(() => {
    if (!activeConsulta) return;
    setConsultaForm({
      detalles: activeConsulta.detalles ?? "",
      tratamientoIndicado: activeConsulta.tratamientoIndicado ?? "",
    });
    setGemeloUpdateForm((prev) => ({
      ...prev,
      consultaId: prev.consultaId || activeConsulta.id,
    }));
  }, [activeConsulta]);

  function resetMessages(section: string) {
    setPendingSection(section);
    setError(null);
    setSuccess(null);
  }

  function finishSection() {
    setPendingSection(null);
  }

  function handleUnauthorized(err: unknown) {
    if (isApiError(err) && (err.status === 401 || err.status === 403)) {
      router.push("/credentials");
      return true;
    }
    return false;
  }

  async function submitDatoMedico(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!datoContenido.trim()) {
      setError("El contenido del dato medico es obligatorio.");
      return;
    }

    try {
      resetMessages("datos-medicos");
      const dato = await createDatoMedico(
        { pacienteId: paciente.id, contenido: datoContenido.trim(), tipo: datoTipo },
        token
      );
      setDatosMedicos((prev) => sortByNewest([dato, ...prev]));
      setDatoContenido("");
      setDatoTipo("otro");
      setSuccess("Dato medico agregado correctamente.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo guardar el dato medico.");
    } finally {
      finishSection();
    }
  }

  async function saveDatoMedico(id: string) {
    if (!editingDatoContenido.trim()) {
      setError("El contenido editado no puede quedar vacio.");
      return;
    }

    try {
      resetMessages("datos-medicos");
      const updated = await updateDatoMedico(
        id,
        { contenido: editingDatoContenido.trim(), tipo: editingDatoTipo },
        token
      );
      setDatosMedicos((prev) => sortByNewest(prev.map((item) => (item.id === id ? updated : item))));
      setEditingDatoId(null);
      setSuccess("Dato medico actualizado.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo actualizar el dato medico.");
    } finally {
      finishSection();
    }
  }

  async function removeDatoMedico(id: string) {
    try {
      resetMessages("datos-medicos");
      await deleteDatoMedico(id, token);
      setDatosMedicos((prev) => prev.filter((item) => item.id !== id));
      setSuccess("Dato medico eliminado.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo eliminar el dato medico.");
    } finally {
      finishSection();
    }
  }

  async function submitEstudio(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!estudioForm.nombreEstudio.trim()) {
      setError("El nombre del estudio es obligatorio.");
      return;
    }

    try {
      resetMessages("estudios");
      const estudio = await createEstudioMedico(
        {
          pacienteId: paciente.id,
          nombreEstudio: estudioForm.nombreEstudio.trim(),
          fecha: estudioForm.fecha || undefined,
          observaciones: estudioForm.observaciones.trim() || undefined,
        },
        token
      );
      setEstudios((prev) => sortByNewest([estudio, ...prev]));
      setEstudioForm({ nombreEstudio: "", fecha: "", observaciones: "" });
      setSuccess("Estudio agregado correctamente.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo agregar el estudio.");
    } finally {
      finishSection();
    }
  }

  async function removeEstudio(id: string) {
    try {
      resetMessages("estudios");
      await deleteEstudio(id, token);
      setEstudios((prev) => prev.filter((item) => item.id !== id));
      setSuccess("Estudio eliminado.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo eliminar el estudio.");
    } finally {
      finishSection();
    }
  }

  async function submitNovedad(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      resetMessages("novedades");
      const novedad = await createNovedad(
        cleanObject({
          pacienteId: paciente.id,
          tipoEvento: novedadForm.tipoEvento.trim() || undefined,
          descripcion: novedadForm.descripcion.trim() || undefined,
          zonaAfectada: novedadForm.zonaAfectada.trim() || undefined,
          gravedad: novedadForm.gravedad || undefined,
          observaciones: novedadForm.observaciones.trim() || undefined,
        }),
        token
      );
      setNovedades((prev) => sortByNewest([novedad, ...prev]));
      setNovedadForm({
        tipoEvento: "",
        descripcion: "",
        zonaAfectada: "",
        gravedad: "",
        observaciones: "",
      });
      setSuccess("Novedad clinica agregada.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo agregar la novedad.");
    } finally {
      finishSection();
    }
  }

  async function removeNovedad(id: string) {
    try {
      resetMessages("novedades");
      await deleteNovedad(id, token);
      setNovedades((prev) => prev.filter((item) => item.id !== id));
      setSuccess("Novedad eliminada.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo eliminar la novedad.");
    } finally {
      finishSection();
    }
  }

  async function createDraftConsulta() {
    try {
      resetMessages("consultas");
      const consulta = await createConsulta({ pacienteId: paciente.id }, token);
      setConsultas((prev) => sortByNewest([consulta, ...prev]));
      setSuccess("Consulta borrador creada.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo crear la consulta.");
    } finally {
      finishSection();
    }
  }

  async function saveConsulta() {
    if (!activeConsulta) return;

    try {
      resetMessages("consultas");
      const updated = await updateConsulta(activeConsulta.id, consultaForm, token);
      setConsultas((prev) => sortByNewest(prev.map((item) => (item.id === updated.id ? updated : item))));
      setSuccess("Consulta guardada.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo guardar la consulta.");
    } finally {
      finishSection();
    }
  }

  async function closeConsulta() {
    if (!activeConsulta) return;

    try {
      resetMessages("consultas");
      const closed = await cerrarConsulta(activeConsulta.id, token);
      setConsultas((prev) => sortByNewest(prev.map((item) => (item.id === closed.id ? closed : item))));
      setConsultaForm({ detalles: "", tratamientoIndicado: "" });
      setSuccess("Consulta cerrada correctamente.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo cerrar la consulta.");
    } finally {
      finishSection();
    }
  }

  async function submitAnalisis() {
    try {
      resetMessages("analisis");
      const analisis = await createAnalisis(
        {
          pacienteId: paciente.id,
          datoMedicoId: analisisForm.datoMedicoId !== "all" ? analisisForm.datoMedicoId : undefined,
          tipoPrompt: analisisForm.promptUsuario.trim() ? "usuario" : "sistema",
          promptUsuario: analisisForm.promptUsuario.trim() || undefined,
        },
        token
      );
      const nuevoContexto = await getContexto(paciente.id, token);
      setUltimoAnalisis(analisis);
      setContextoIa(nuevoContexto);
      setSuccess("Analisis IA generado.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo generar el analisis.");
    } finally {
      finishSection();
    }
  }

  async function submitSimulacion() {
    if (!gemelo?.id) return;
    if (!simulacionForm.tratamientoPropuesto.trim()) {
      setError("El tratamiento propuesto es obligatorio.");
      return;
    }

    try {
      resetMessages("simulacion");
      const simulacion = await simularTratamiento(
        {
          gemeloDigitalId: gemelo.id,
          tratamientoPropuesto: simulacionForm.tratamientoPropuesto.trim(),
          dosisYDuracion: simulacionForm.dosisYDuracion.trim() || undefined,
        },
        token
      );
      setUltimaSimulacion(simulacion);
      setSuccess("Simulacion completada.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo simular el tratamiento.");
    } finally {
      finishSection();
    }
  }

  async function submitGemeloUpdate() {
    if (!gemelo?.id) return;
    if (!gemeloUpdateForm.consultaId) {
      setError("Selecciona una consulta para actualizar el gemelo.");
      return;
    }

    let datosActualizados: Record<string, unknown>;

    try {
      datosActualizados = JSON.parse(gemeloUpdateForm.datosActualizados);
    } catch {
      setError("`datosActualizados` debe ser JSON valido.");
      return;
    }

    try {
      resetMessages("gemelo");
      const updatedGemelo = await actualizarGemelo(
        gemelo.id,
        {
          consultaId: gemeloUpdateForm.consultaId,
          cambiosRealizados: gemeloUpdateForm.cambiosRealizados.trim(),
          datosActualizados,
        },
        token
      );
      setGemelo(updatedGemelo);
      setSuccess("Gemelo digital actualizado.");
    } catch (err) {
      if (handleUnauthorized(err)) return;
      setError(err instanceof Error ? err.message : "No se pudo actualizar el gemelo.");
    } finally {
      finishSection();
    }
  }

  return (
    <div className="grid gap-6">
      <Message tone="error" message={error} />
      <Message tone="success" message={success} />

      <Card>
        <CardHeader>
          <CardTitle>Datos medicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-4 md:grid-cols-[220px,1fr] md:items-start" onSubmit={submitDatoMedico}>
            <div className="grid gap-1.5">
              <Label>Tipo</Label>
              <Select value={datoTipo} onValueChange={(value) => setDatoTipo(value as TipoDatoMedico)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_DATO_MEDICO.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="datoContenido">Contenido</Label>
              <Textarea id="datoContenido" value={datoContenido} onChange={(event) => setDatoContenido(event.target.value)} className="min-h-28" />
              <Button type="submit" disabled={pendingSection === "datos-medicos"}>
                {pendingSection === "datos-medicos" ? "Guardando..." : "Agregar dato medico"}
              </Button>
            </div>
          </form>

          {datosMedicos.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin datos medicos cargados aun.</p>
          ) : (
            <div className="space-y-3">
              {datosMedicos.map((dato) => (
                <div key={dato.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{dato.tipo}</Badge>
                      <span className="text-xs text-muted-foreground">{formatDateTime(dato.fechaCarga ?? dato.createdAt)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingDatoId(dato.id);
                          setEditingDatoTipo(dato.tipo);
                          setEditingDatoContenido(dato.contenido);
                        }}
                      >
                        Editar
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeDatoMedico(dato.id)} disabled={pendingSection === "datos-medicos"}>
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>

                  {editingDatoId === dato.id ? (
                    <div className="mt-3 grid gap-3">
                      <Select value={editingDatoTipo} onValueChange={(value) => setEditingDatoTipo(value as TipoDatoMedico)}>
                        <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {TIPOS_DATO_MEDICO.map((tipo) => (
                            <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea value={editingDatoContenido} onChange={(event) => setEditingDatoContenido(event.target.value)} className="min-h-24" />
                      <div className="flex gap-2">
                        <Button type="button" size="sm" onClick={() => saveDatoMedico(dato.id)} disabled={pendingSection === "datos-medicos"}>Guardar</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setEditingDatoId(null)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-heading">{dato.contenido}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Estudios medicos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <form className="grid gap-3" onSubmit={submitEstudio}>
              <Input placeholder="Nombre del estudio" value={estudioForm.nombreEstudio} onChange={(event) => setEstudioForm((prev) => ({ ...prev, nombreEstudio: event.target.value }))} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input type="date" value={estudioForm.fecha} onChange={(event) => setEstudioForm((prev) => ({ ...prev, fecha: event.target.value }))} />
                <Input placeholder="Observaciones" value={estudioForm.observaciones} onChange={(event) => setEstudioForm((prev) => ({ ...prev, observaciones: event.target.value }))} />
              </div>
              <Button type="submit" disabled={pendingSection === "estudios"}>{pendingSection === "estudios" ? "Guardando..." : "Agregar estudio"}</Button>
            </form>
            <div className="space-y-3">
              {estudios.length === 0 ? <p className="text-sm text-muted-foreground">Sin estudios cargados.</p> : estudios.map((estudio) => (
                <div key={estudio.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-heading">{estudio.nombreEstudio}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(estudio.fecha ?? estudio.createdAt)}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{estudio.observaciones?.trim() || "Sin observaciones"}</p>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeEstudio(estudio.id)} disabled={pendingSection === "estudios"}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Novedades clinicas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <form className="grid gap-3" onSubmit={submitNovedad}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Tipo de evento" value={novedadForm.tipoEvento} onChange={(event) => setNovedadForm((prev) => ({ ...prev, tipoEvento: event.target.value }))} />
                <Select value={novedadForm.gravedad} onValueChange={(value) => setNovedadForm((prev) => ({ ...prev, gravedad: value as GravedadNovedad | "" }))}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Gravedad" /></SelectTrigger>
                  <SelectContent>
                    {GRAVEDADES.map((gravedad) => (
                      <SelectItem key={gravedad} value={gravedad}>{gravedad}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Descripcion" value={novedadForm.descripcion} onChange={(event) => setNovedadForm((prev) => ({ ...prev, descripcion: event.target.value }))} />
                <Input placeholder="Zona afectada" value={novedadForm.zonaAfectada} onChange={(event) => setNovedadForm((prev) => ({ ...prev, zonaAfectada: event.target.value }))} />
              </div>
              <Textarea placeholder="Observaciones" value={novedadForm.observaciones} onChange={(event) => setNovedadForm((prev) => ({ ...prev, observaciones: event.target.value }))} className="min-h-24" />
              <Button type="submit" disabled={pendingSection === "novedades"}>{pendingSection === "novedades" ? "Guardando..." : "Agregar novedad"}</Button>
            </form>
            <div className="space-y-3">
              {novedades.length === 0 ? <p className="text-sm text-muted-foreground">Sin novedades clinicas.</p> : novedades.map((novedad) => (
                <div key={novedad.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-4">
                  <div className="space-y-1">
                    <p className="font-medium text-heading">{novedad.tipoEvento?.trim() || "Novedad sin tipo"}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(novedad.createdAt)} · {novedad.gravedad ?? "-"}</p>
                    <p className="text-sm text-muted-foreground">{novedad.descripcion?.trim() || "Sin descripcion"}</p>
                    <p className="text-sm text-muted-foreground">{novedad.observaciones?.trim() || "Sin observaciones"}</p>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeNovedad(novedad.id)} disabled={pendingSection === "novedades"}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card id="consultas">
        <CardHeader><CardTitle>Consultas</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">La consulta activa es el borrador mas reciente del paciente.</p>
            <Button type="button" onClick={createDraftConsulta} disabled={pendingSection === "consultas"}>
              {pendingSection === "consultas" ? "Creando..." : "Nueva consulta"}
            </Button>
          </div>

          {activeConsulta ? (
            <div className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-heading">Consulta activa</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(activeConsulta.createdAt)}</p>
                </div>
                <Badge variant="outline">{activeConsulta.estado}</Badge>
              </div>
              <div className="mt-4 grid gap-3">
                <Textarea value={consultaForm.detalles} onChange={(event) => setConsultaForm((prev) => ({ ...prev, detalles: event.target.value }))} className="min-h-24" placeholder="Detalles" />
                <Textarea value={consultaForm.tratamientoIndicado} onChange={(event) => setConsultaForm((prev) => ({ ...prev, tratamientoIndicado: event.target.value }))} className="min-h-24" placeholder="Tratamiento indicado" />
                <div className="flex gap-2">
                  <Button type="button" onClick={saveConsulta} disabled={pendingSection === "consultas"}>Guardar</Button>
                  <Button type="button" variant="outline" onClick={closeConsulta} disabled={pendingSection === "consultas"}>Cerrar consulta</Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay consultas en borrador.</p>
          )}

          <div className="space-y-3">
            <p className="font-medium text-heading">Historial de consultas</p>
            {consultas.length === 0 ? <p className="text-sm text-muted-foreground">Sin consultas registradas.</p> : consultas.map((consulta) => (
              <div key={consulta.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-heading">{formatDateTime(consulta.createdAt)}</p>
                  <Badge variant="outline">{consulta.estado}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Detalles: {consulta.detalles?.trim() || "-"}</p>
                <p className="mt-1 text-sm text-muted-foreground">Tratamiento: {consulta.tratamientoIndicado?.trim() || "-"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Analisis IA</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Select value={analisisForm.datoMedicoId} onValueChange={(value) => setAnalisisForm((prev) => ({ ...prev, datoMedicoId: value }))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los datos medicos</SelectItem>
                {datosMedicos.map((dato) => (
                  <SelectItem key={dato.id} value={dato.id}>{dato.tipo} · {textPreview(dato.contenido, 50)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea value={analisisForm.promptUsuario} onChange={(event) => setAnalisisForm((prev) => ({ ...prev, promptUsuario: event.target.value }))} className="min-h-24" placeholder="Prompt opcional" />
            <Button type="button" onClick={submitAnalisis} disabled={pendingSection === "analisis"}>{pendingSection === "analisis" ? "Analizando..." : "Analizar con IA"}</Button>
            <div className="rounded-lg border border-border p-4">
              <p className="font-medium text-heading">Contexto acumulado</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{contextoIa?.registroIA?.trim() || "Sin contexto"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ultimo analisis</CardTitle></CardHeader>
          <CardContent>
            {!ultimoAnalisis ? <p className="text-sm text-muted-foreground">Todavia no hay analisis para este paciente.</p> : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">{formatDateTime(ultimoAnalisis.fechaGeneracion ?? undefined)} · {ultimoAnalisis.tipoPrompt ?? "sistema"}</p>
                <p className="whitespace-pre-wrap text-sm text-heading">{ultimoAnalisis.respuestaIA}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Gemelo digital y simulacion</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {!gemelo ? (
              <Message tone="warning" message="Este paciente no tiene gemelo digital. La simulacion queda bloqueada." />
            ) : (
              <div className="rounded-lg border border-border p-4 text-sm">
                <p className="font-medium text-heading">Estado: {gemelo.estado}</p>
                <p className="text-muted-foreground">Ultima actualizacion: {formatDateTime(gemelo.updatedAt)}</p>
              </div>
            )}
            <Textarea value={simulacionForm.tratamientoPropuesto} onChange={(event) => setSimulacionForm((prev) => ({ ...prev, tratamientoPropuesto: event.target.value }))} className="min-h-24" placeholder="Tratamiento propuesto" disabled={!gemelo} />
            <Textarea value={simulacionForm.dosisYDuracion} onChange={(event) => setSimulacionForm((prev) => ({ ...prev, dosisYDuracion: event.target.value }))} className="min-h-20" placeholder="Dosis y duracion" disabled={!gemelo} />
            <Button type="button" onClick={submitSimulacion} disabled={!gemelo || pendingSection === "simulacion"}>{pendingSection === "simulacion" ? "Simulando..." : "Simular tratamiento"}</Button>
            <div className="rounded-lg border border-border p-4">
              <p className="font-medium text-heading">Ultima simulacion</p>
              {!ultimaSimulacion ? <p className="mt-2 text-sm text-muted-foreground">No hay simulaciones registradas.</p> : (
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <p>{formatDateTime(ultimaSimulacion.createdAt)}</p>
                  <p className="font-medium text-heading">{ultimaSimulacion.tratamientoPropuesto}</p>
                  <p>Dosis: {ultimaSimulacion.dosisYDuracion?.trim() || "-"}</p>
                  <p>Probabilidad de exito: {ultimaSimulacion.prediccionRespuesta?.probabilidadExito ?? "-"}</p>
                  <p>Beneficios: {ultimaSimulacion.analisisIA?.beneficios?.join(", ") || "-"}</p>
                  <p>Riesgos: {ultimaSimulacion.analisisIA?.riesgos?.join(", ") || "-"}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Actualizar gemelo digital</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {!gemelo ? <Message tone="warning" message="Sin gemelo digital no es posible aplicar actualizaciones." /> : null}
            {gemelo && consultas.length === 0 ? <Message tone="warning" message="No hay consultas registradas. Debes crear una para actualizar el gemelo." /> : null}
            <Select value={gemeloUpdateForm.consultaId} onValueChange={(value) => setGemeloUpdateForm((prev) => ({ ...prev, consultaId: value }))} disabled={!gemelo || consultas.length === 0}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Consulta asociada" /></SelectTrigger>
              <SelectContent>
                {consultas.map((consulta) => (
                  <SelectItem key={consulta.id} value={consulta.id}>{formatDateTime(consulta.createdAt)} · {consulta.estado}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea value={gemeloUpdateForm.cambiosRealizados} onChange={(event) => setGemeloUpdateForm((prev) => ({ ...prev, cambiosRealizados: event.target.value }))} className="min-h-24" placeholder="Cambios realizados" disabled={!gemelo} />
            <Textarea value={gemeloUpdateForm.datosActualizados} onChange={(event) => setGemeloUpdateForm((prev) => ({ ...prev, datosActualizados: event.target.value }))} className="min-h-40 font-mono text-xs" disabled={!gemelo} />
            <Button type="button" onClick={submitGemeloUpdate} disabled={!gemelo || consultas.length === 0 || pendingSection === "gemelo"}>{pendingSection === "gemelo" ? "Actualizando..." : "Actualizar gemelo"}</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
