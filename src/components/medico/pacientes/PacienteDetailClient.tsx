"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { showErrorToast, showSuccessToast, showWarningToast } from "@/src/lib/toast";
import { PacienteDetailTabs } from "@/src/components/medico/pacientes/detail/PacienteDetailTabs";
import {
  cleanObject,
  isDetailTabValue,
  sortByNewest,
  type AnalisisFormState,
  type ConsultaFormState,
  type DatoMedicoFormState,
  type DetailTabValue,
  type EstudioFormState,
  type GemeloUpdateFormState,
  type NovedadFormState,
  type PendingMap,
  type SimulacionFormState,
} from "@/src/components/medico/pacientes/detail/shared/utils";
import type {
  AnalisisIA,
  ContextoAnalisisIA,
  Consulta,
  DatoMedico,
  EstudioMedico,
  GemeloDigital,
  NovedadClinica,
  PacienteDetalle,
  SimulacionTratamiento,
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<DetailTabValue>("resumen");
  const [datosMedicos, setDatosMedicos] = useState(() => sortByNewest(initialDatosMedicos));
  const [consultas, setConsultas] = useState(() => sortByNewest(initialConsultas));
  const [estudios, setEstudios] = useState(() => sortByNewest(initialEstudios));
  const [novedades, setNovedades] = useState(() => sortByNewest(initialNovedades));
  const [ultimoAnalisis, setUltimoAnalisis] = useState(initialUltimoAnalisis);
  const [contextoIa, setContextoIa] = useState(initialContextoIa);
  const [gemelo, setGemelo] = useState(initialGemelo);
  const [ultimaSimulacion, setUltimaSimulacion] = useState(initialUltimaSimulacion);
  const [pending, setPending] = useState<PendingMap>({});

  const activeConsulta = useMemo(
    () => consultas.find((consulta) => consulta.estado === "borrador") ?? null,
    [consultas]
  );

  useEffect(() => {
    const queryTab = searchParams.get("tab");
    const hashTab =
      typeof window !== "undefined" ? window.location.hash.replace("#", "") : null;
    const nextTab = isDetailTabValue(queryTab)
      ? queryTab
      : isDetailTabValue(hashTab)
        ? hashTab
        : null;

    if (nextTab && nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  }, [activeTab, searchParams]);

  function setSectionPending(section: keyof PendingMap, isPending: boolean) {
    setPending((prev) => ({
      ...prev,
      [section]: isPending,
    }));
  }

  function handleTabChange(nextTab: DetailTabValue) {
    setActiveTab(nextTab);

    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.searchParams.set("tab", nextTab);
    url.hash = "";
    window.history.replaceState({}, "", `${pathname}${url.search}`);
  }

  function handleUnauthorized(error: unknown) {
    if (isApiError(error) && (error.status === 401 || error.status === 403)) {
      router.push("/credentials");
      return true;
    }

    return false;
  }

  async function handleCreateDato(payload: DatoMedicoFormState): Promise<boolean> {
    if (!payload.contenido.trim()) {
      showWarningToast("El contenido del dato medico es obligatorio.");
      return false;
    }

    try {
      setSectionPending("datosMedicos", true);
      const dato = await createDatoMedico(
        { pacienteId: paciente.id, contenido: payload.contenido.trim(), tipo: payload.tipo },
        token
      );
      setDatosMedicos((prev) => sortByNewest([dato, ...prev]));
      showSuccessToast("Dato medico agregado correctamente.");
      return true;
    } catch (error) {
      if (handleUnauthorized(error)) return false;
      showErrorToast(error instanceof Error ? error.message : "No se pudo guardar el dato medico.");
      return false;
    } finally {
      setSectionPending("datosMedicos", false);
    }
  }

  async function handleUpdateDato(
    id: string,
    payload: DatoMedicoFormState
  ): Promise<boolean> {
    if (!payload.contenido.trim()) {
      showWarningToast("El contenido editado no puede quedar vacio.");
      return false;
    }

    try {
      setSectionPending("datosMedicos", true);
      const updated = await updateDatoMedico(
        id,
        { contenido: payload.contenido.trim(), tipo: payload.tipo },
        token
      );
      setDatosMedicos((prev) =>
        sortByNewest(prev.map((item) => (item.id === id ? updated : item)))
      );
      showSuccessToast("Dato medico actualizado.");
      return true;
    } catch (error) {
      if (handleUnauthorized(error)) return false;
      showErrorToast(
        error instanceof Error ? error.message : "No se pudo actualizar el dato medico."
      );
      return false;
    } finally {
      setSectionPending("datosMedicos", false);
    }
  }

  async function handleRemoveDato(id: string) {
    try {
      setSectionPending("datosMedicos", true);
      await deleteDatoMedico(id, token);
      setDatosMedicos((prev) => prev.filter((item) => item.id !== id));
      showSuccessToast("Dato medico eliminado.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      showErrorToast(
        error instanceof Error ? error.message : "No se pudo eliminar el dato medico."
      );
    } finally {
      setSectionPending("datosMedicos", false);
    }
  }

  async function handleCreateEstudio(payload: EstudioFormState): Promise<boolean> {
    if (!payload.nombreEstudio.trim()) {
      showWarningToast("El nombre del estudio es obligatorio.");
      return false;
    }

    try {
      setSectionPending("estudios", true);
      const estudio = await createEstudioMedico(
        {
          pacienteId: paciente.id,
          nombreEstudio: payload.nombreEstudio.trim(),
          fecha: payload.fecha || undefined,
          observaciones: payload.observaciones.trim() || undefined,
        },
        token
      );
      setEstudios((prev) => sortByNewest([estudio, ...prev]));
      showSuccessToast("Estudio agregado correctamente.");
      return true;
    } catch (error) {
      if (handleUnauthorized(error)) return false;
      showErrorToast(error instanceof Error ? error.message : "No se pudo agregar el estudio.");
      return false;
    } finally {
      setSectionPending("estudios", false);
    }
  }

  async function handleRemoveEstudio(id: string) {
    try {
      setSectionPending("estudios", true);
      await deleteEstudio(id, token);
      setEstudios((prev) => prev.filter((item) => item.id !== id));
      showSuccessToast("Estudio eliminado.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      showErrorToast(error instanceof Error ? error.message : "No se pudo eliminar el estudio.");
    } finally {
      setSectionPending("estudios", false);
    }
  }

  async function handleCreateNovedad(payload: NovedadFormState): Promise<boolean> {
    try {
      setSectionPending("novedades", true);
      const novedad = await createNovedad(
        cleanObject({
          pacienteId: paciente.id,
          tipoEvento: payload.tipoEvento.trim() || undefined,
          descripcion: payload.descripcion.trim() || undefined,
          zonaAfectada: payload.zonaAfectada.trim() || undefined,
          gravedad: payload.gravedad || undefined,
          observaciones: payload.observaciones.trim() || undefined,
        }),
        token
      );
      setNovedades((prev) => sortByNewest([novedad, ...prev]));
      showSuccessToast("Novedad clinica agregada.");
      return true;
    } catch (error) {
      if (handleUnauthorized(error)) return false;
      showErrorToast(error instanceof Error ? error.message : "No se pudo agregar la novedad.");
      return false;
    } finally {
      setSectionPending("novedades", false);
    }
  }

  async function handleRemoveNovedad(id: string) {
    try {
      setSectionPending("novedades", true);
      await deleteNovedad(id, token);
      setNovedades((prev) => prev.filter((item) => item.id !== id));
      showSuccessToast("Novedad eliminada.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      showErrorToast(error instanceof Error ? error.message : "No se pudo eliminar la novedad.");
    } finally {
      setSectionPending("novedades", false);
    }
  }

  async function handleCreateDraftConsulta() {
    try {
      setSectionPending("consultas", true);
      const consulta = await createConsulta({ pacienteId: paciente.id }, token);
      setConsultas((prev) => sortByNewest([consulta, ...prev]));
      showSuccessToast("Consulta borrador creada.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      showErrorToast(error instanceof Error ? error.message : "No se pudo crear la consulta.");
    } finally {
      setSectionPending("consultas", false);
    }
  }

  async function handleSaveConsulta(id: string, payload: ConsultaFormState) {
    try {
      setSectionPending("consultas", true);
      const updated = await updateConsulta(id, payload, token);
      setConsultas((prev) =>
        sortByNewest(prev.map((item) => (item.id === updated.id ? updated : item)))
      );
      showSuccessToast("Consulta guardada.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      showErrorToast(error instanceof Error ? error.message : "No se pudo guardar la consulta.");
    } finally {
      setSectionPending("consultas", false);
    }
  }

  async function handleCloseConsulta(id: string) {
    try {
      setSectionPending("consultas", true);
      const closed = await cerrarConsulta(id, token);
      setConsultas((prev) =>
        sortByNewest(prev.map((item) => (item.id === closed.id ? closed : item)))
      );
      showSuccessToast("Consulta cerrada correctamente.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      showErrorToast(error instanceof Error ? error.message : "No se pudo cerrar la consulta.");
    } finally {
      setSectionPending("consultas", false);
    }
  }

  async function handleSubmitAnalisis(payload: AnalisisFormState) {
    try {
      setSectionPending("analisis", true);
      const analisis = await createAnalisis(
        {
          pacienteId: paciente.id,
          datoMedicoId: payload.datoMedicoId !== "all" ? payload.datoMedicoId : undefined,
          tipoPrompt: payload.promptUsuario.trim() ? "usuario" : "sistema",
          promptUsuario: payload.promptUsuario.trim() || undefined,
        },
        token
      );
      const nuevoContexto = await getContexto(paciente.id, token);
      setUltimoAnalisis(analisis);
      setContextoIa(nuevoContexto);
      showSuccessToast("Analisis IA generado.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      showErrorToast(error instanceof Error ? error.message : "No se pudo generar el analisis.");
    } finally {
      setSectionPending("analisis", false);
    }
  }

  async function handleSubmitSimulacion(payload: SimulacionFormState) {
    if (!gemelo?.id) return;

    if (!payload.tratamientoPropuesto.trim()) {
      showWarningToast("El tratamiento propuesto es obligatorio.");
      return;
    }

    try {
      setSectionPending("simulacion", true);
      const simulacion = await simularTratamiento(
        {
          gemeloDigitalId: gemelo.id,
          tratamientoPropuesto: payload.tratamientoPropuesto.trim(),
          dosisYDuracion: payload.dosisYDuracion.trim() || undefined,
        },
        token
      );
      setUltimaSimulacion(simulacion);
      showSuccessToast("Simulacion completada.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      showErrorToast(
        error instanceof Error ? error.message : "No se pudo simular el tratamiento."
      );
    } finally {
      setSectionPending("simulacion", false);
    }
  }

  async function handleSubmitGemeloUpdate(payload: GemeloUpdateFormState) {
    if (!gemelo?.id) return;

    if (!payload.consultaId) {
      showWarningToast("Selecciona una consulta para actualizar el gemelo.");
      return;
    }

    let datosActualizados: Record<string, unknown>;

    try {
      datosActualizados = JSON.parse(payload.datosActualizados);
    } catch {
      showWarningToast("`datosActualizados` debe ser JSON valido.");
      return;
    }

    try {
      setSectionPending("gemelo", true);
      const updatedGemelo = await actualizarGemelo(
        gemelo.id,
        {
          consultaId: payload.consultaId,
          cambiosRealizados: payload.cambiosRealizados.trim(),
          datosActualizados,
        },
        token
      );
      setGemelo(updatedGemelo);
      showSuccessToast("Gemelo digital actualizado.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      showErrorToast(
        error instanceof Error ? error.message : "No se pudo actualizar el gemelo."
      );
    } finally {
      setSectionPending("gemelo", false);
    }
  }

  return (
    <PacienteDetailTabs
      activeTab={activeTab}
      onTabChange={handleTabChange}
      datosMedicos={datosMedicos}
      estudios={estudios}
      novedades={novedades}
      consultas={consultas}
      activeConsulta={activeConsulta}
      ultimoAnalisis={ultimoAnalisis}
      contextoIa={contextoIa}
      gemelo={gemelo}
      ultimaSimulacion={ultimaSimulacion}
      pending={pending}
      onCreateDato={handleCreateDato}
      onUpdateDato={handleUpdateDato}
      onRemoveDato={handleRemoveDato}
      onCreateEstudio={handleCreateEstudio}
      onRemoveEstudio={handleRemoveEstudio}
      onCreateNovedad={handleCreateNovedad}
      onRemoveNovedad={handleRemoveNovedad}
      onCreateDraftConsulta={handleCreateDraftConsulta}
      onSaveConsulta={handleSaveConsulta}
      onCloseConsulta={handleCloseConsulta}
      onSubmitAnalisis={handleSubmitAnalisis}
      onSubmitSimulacion={handleSubmitSimulacion}
      onSubmitGemeloUpdate={handleSubmitGemeloUpdate}
    />
  );
}
