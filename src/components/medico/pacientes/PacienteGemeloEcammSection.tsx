"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { Checkbox } from "@/src/components/magic/ui/checkbox";
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
import { isApiError } from "@/src/lib/api/http";
import {
  actualizarGemeloDigital,
  simularTratamientoGemelo,
} from "@/src/lib/api/gemelos-digitales";
import { formatDateTime, textPreview } from "@/src/lib/formatters";
import type {
  ActualizarGemeloDigitalDto,
  Consulta,
  DatoMedico,
  GemeloDigital,
  PerfilMedico,
  SimulacionTratamiento,
} from "@/src/lib/api/types";

interface PacienteGemeloEcammSectionProps {
  token: string;
  pacienteId: string;
  gemelo: GemeloDigital | null;
  consultas: Consulta[];
  datosMedicos: DatoMedico[];
  consultasError?: string | null;
}

interface ActualizacionFormState {
  consultaId: string;
  cambiosRealizados: string;
  sexo: string;
  peso: string;
  altura: string;
  medicacionActual: string;
  antecedentesQuirurgicos: string;
  antecedentesFamiliares: string;
  tabaquismo: boolean;
  alcohol: string;
  ejercicio: string;
  dieta: string;
  presionArterial: string;
  frecuenciaCardiaca: string;
  temperatura: string;
  saturacionO2: string;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
}

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function joinCsv(value?: string[]): string {
  if (!value || value.length === 0) return "";
  return value.join(", ");
}

function parseOptionalNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function cleanObject<T extends Record<string, unknown>>(raw: T): T | undefined {
  const entries = Object.entries(raw).filter(([, value]) => {
    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") {
      return Object.keys(value as Record<string, unknown>).length > 0;
    }
    return true;
  });

  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries) as T;
}

function buildInitialActualizacionForm(perfil?: PerfilMedico): ActualizacionFormState {
  return {
    consultaId: "",
    cambiosRealizados: "",
    sexo: perfil?.sexo ?? "",
    peso: perfil?.peso !== undefined ? String(perfil.peso) : "",
    altura: perfil?.altura !== undefined ? String(perfil.altura) : "",
    medicacionActual: joinCsv(perfil?.medicacionActual),
    antecedentesQuirurgicos: joinCsv(perfil?.antecedentesQuirurgicos),
    antecedentesFamiliares: joinCsv(perfil?.antecedentesFamiliares),
    tabaquismo: perfil?.habitosVida?.tabaquismo ?? false,
    alcohol: perfil?.habitosVida?.alcohol ?? "",
    ejercicio: perfil?.habitosVida?.ejercicio ?? "",
    dieta: perfil?.habitosVida?.dieta ?? "",
    presionArterial: perfil?.signosVitales?.presionArterial ?? "",
    frecuenciaCardiaca:
      perfil?.signosVitales?.frecuenciaCardiaca !== undefined
        ? String(perfil.signosVitales.frecuenciaCardiaca)
        : "",
    temperatura:
      perfil?.signosVitales?.temperatura !== undefined
        ? String(perfil.signosVitales.temperatura)
        : "",
    saturacionO2:
      perfil?.signosVitales?.saturacionO2 !== undefined
        ? String(perfil.signosVitales.saturacionO2)
        : "",
  };
}

function buildActualizarPayload(form: ActualizacionFormState): ActualizarGemeloDigitalDto {
  const habitosVida = cleanObject({
    tabaquismo: form.tabaquismo,
    alcohol: form.alcohol.trim() || undefined,
    ejercicio: form.ejercicio.trim() || undefined,
    dieta: form.dieta.trim() || undefined,
  });

  const signosVitales = cleanObject({
    presionArterial: form.presionArterial.trim() || undefined,
    frecuenciaCardiaca: parseOptionalNumber(form.frecuenciaCardiaca),
    temperatura: parseOptionalNumber(form.temperatura),
    saturacionO2: parseOptionalNumber(form.saturacionO2),
  });

  const datosActualizados =
    cleanObject({
      sexo: form.sexo.trim() || undefined,
      peso: parseOptionalNumber(form.peso),
      altura: parseOptionalNumber(form.altura),
      medicacionActual: splitCsv(form.medicacionActual),
      antecedentesQuirurgicos: splitCsv(form.antecedentesQuirurgicos),
      antecedentesFamiliares: splitCsv(form.antecedentesFamiliares),
      habitosVida,
      signosVitales,
    }) ?? {};

  return {
    consultaId: form.consultaId,
    cambiosRealizados: form.cambiosRealizados.trim(),
    datosActualizados,
  };
}

function resolveList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry.trim() : String(entry)))
      .filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
}

function displayValue(value: unknown, fallback = "No disponible"): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Si" : "No";
  if (typeof value === "string") return value.trim() || fallback;

  const list = resolveList(value);
  if (list.length > 0) return list.join(", ");

  return fallback;
}

function getLatestSimulacion(gemelo: GemeloDigital | null): SimulacionTratamiento | null {
  if (!gemelo) return null;
  if (gemelo.ultimaSimulacion) return gemelo.ultimaSimulacion;
  if (!gemelo.simulaciones || gemelo.simulaciones.length === 0) return null;

  return [...gemelo.simulaciones].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  })[0];
}

function getSimulacionField(
  simulacion: SimulacionTratamiento,
  keys: string[]
): unknown {
  const sources = [
    asRecord(simulacion.analisisIA),
    asRecord(simulacion.prediccionRespuesta),
    asRecord(simulacion),
  ];

  for (const source of sources) {
    if (!source) continue;
    for (const key of keys) {
      const value = source[key];
      if (
        value !== undefined &&
        value !== null &&
        !(typeof value === "string" && value.trim() === "")
      ) {
        return value;
      }
    }
  }

  return undefined;
}

function formatConsultaLabel(consulta: Consulta): string {
  const fecha = formatDateTime(consulta.fecha ?? consulta.createdAt);
  const estado = consulta.estado ?? "borrador";
  const motivo = consulta.motivo?.trim() || "Sin motivo";
  return `${fecha} - ${estado} - ${textPreview(motivo, 48)}`;
}

export function PacienteGemeloEcammSection({
  token,
  pacienteId,
  gemelo,
  consultas,
  datosMedicos,
  consultasError = null,
}: PacienteGemeloEcammSectionProps) {
  const router = useRouter();
  const [gemeloActual, setGemeloActual] = useState<GemeloDigital | null>(gemelo);
  const [tratamientoPropuesto, setTratamientoPropuesto] = useState("");
  const [dosisYDuracion, setDosisYDuracion] = useState("");
  const [simulacionError, setSimulacionError] = useState<string | null>(null);
  const [simulacionSuccess, setSimulacionSuccess] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [ultimaSimulacionLocal, setUltimaSimulacionLocal] = useState<SimulacionTratamiento | null>(
    null
  );

  const [actualizacionForm, setActualizacionForm] = useState<ActualizacionFormState>(() =>
    buildInitialActualizacionForm(gemelo?.perfilMedico)
  );
  const [actualizacionError, setActualizacionError] = useState<string | null>(null);
  const [actualizacionSuccess, setActualizacionSuccess] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setGemeloActual(gemelo);
  }, [gemelo]);

  const consultasPaciente = useMemo(
    () => consultas.filter((consulta) => consulta.pacienteId === pacienteId),
    [consultas, pacienteId]
  );

  const ultimaSimulacion = useMemo(
    () => ultimaSimulacionLocal ?? getLatestSimulacion(gemeloActual),
    [ultimaSimulacionLocal, gemeloActual]
  );

  const hasGemelo = Boolean(gemeloActual?.id);
  const canUpdateWithConsulta = hasGemelo && consultasPaciente.length > 0;

  async function onSimularTratamiento(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSimulacionError(null);
    setSimulacionSuccess(null);

    if (!hasGemelo || !gemeloActual?.id) {
      setSimulacionError("Este paciente no tiene gemelo digital asociado.");
      return;
    }

    if (!tratamientoPropuesto.trim()) {
      setSimulacionError("Debes indicar el tratamiento propuesto.");
      return;
    }

    try {
      setIsSimulating(true);


      console.log('la simulacion envia estos datos al backend:', {gemeloDigitalId: gemeloActual.id, tratamientoPropuesto, dosisYDuracion, token });
      const simulacion = await simularTratamientoGemelo(
        {
          gemeloDigitalId: gemeloActual.id,
          tratamientoPropuesto: tratamientoPropuesto.trim(),
          dosisYDuracion: dosisYDuracion.trim() || undefined,
        },
        token
      );
      console.log("Simulación de tratamiento completada:", simulacion);

      setUltimaSimulacionLocal(simulacion);
      setSimulacionSuccess("Simulacion completada con exito.");
    } catch (error) {
      if (isApiError(error) && (error.status === 401 || error.status === 403)) {
        router.push("/credentials");
        return;
      }

      setSimulacionError(
        error instanceof Error ? error.message : "No se pudo simular el tratamiento."
      );
    } finally {
      setIsSimulating(false);
    }
  }

  function onActualizacionChange(field: keyof ActualizacionFormState, value: string | boolean) {
    setActualizacionForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onActualizarGemelo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActualizacionError(null);
    setActualizacionSuccess(null);

    if (!hasGemelo || !gemeloActual?.id) {
      setActualizacionError("Este paciente no tiene gemelo digital asociado.");
      return;
    }

    if (consultasPaciente.length === 0) {
      setActualizacionError(
        "No hay consultas asociadas a este paciente. No se puede actualizar el gemelo."
      );
      return;
    }

    if (!actualizacionForm.consultaId) {
      setActualizacionError("Selecciona una consulta asociada para continuar.");
      return;
    }

    if (!actualizacionForm.cambiosRealizados.trim()) {
      setActualizacionError("Debes describir los cambios realizados.");
      return;
    }

    try {
      setIsUpdating(true);

      const gemeloActualizado = await actualizarGemeloDigital(
        gemeloActual.id,
        buildActualizarPayload(actualizacionForm),
        token
      );

      setGemeloActual(gemeloActualizado);
      setActualizacionSuccess("Gemelo digital actualizado con exito.");
      setActualizacionForm(buildInitialActualizacionForm(gemeloActualizado.perfilMedico));
      router.refresh();
    } catch (error) {
      if (isApiError(error) && (error.status === 401 || error.status === 403)) {
        router.push("/credentials");
        return;
      }

      setActualizacionError(
        error instanceof Error ? error.message : "No se pudo actualizar el gemelo digital."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  const efectividadEstimada = ultimaSimulacion
    ? getSimulacionField(ultimaSimulacion, ["efectividadEstimada", "efectividad_estimada"])
    : undefined;
  const probabilidadExito = ultimaSimulacion
    ? getSimulacionField(ultimaSimulacion, ["probabilidadExito", "probabilidad_exito"])
    : undefined;
  const riesgos = ultimaSimulacion ? getSimulacionField(ultimaSimulacion, ["riesgos"]) : undefined;
  const beneficios = ultimaSimulacion
    ? getSimulacionField(ultimaSimulacion, ["beneficios"])
    : undefined;
  const monitoreoCritico = ultimaSimulacion
    ? getSimulacionField(ultimaSimulacion, ["monitoreoCritico", "monitoreo_critico"])
    : undefined;
  const recomendaciones = ultimaSimulacion
    ? getSimulacionField(ultimaSimulacion, ["recomendaciones"])
    : undefined;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gemelo digital del paciente</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasGemelo ? (
            <p className="rounded-md border border-border/70 bg-surface-muted px-3 py-2 text-sm text-muted-foreground">
              Este paciente no tiene gemelo digital asociado.
            </p>
          ) : (
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Estado</p>
                <p className="font-medium text-heading">{gemeloActual?.estado ?? "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ultima actualizacion</p>
                <p className="font-medium text-heading">{formatDateTime(gemeloActual?.updatedAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sexo</p>
                <p className="font-medium text-heading">
                  {gemeloActual?.perfilMedico?.sexo ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Peso / Altura</p>
                <p className="font-medium text-heading">
                  {gemeloActual?.perfilMedico?.peso ?? "-"} kg /{" "}
                  {gemeloActual?.perfilMedico?.altura ?? "-"} cm
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Medicacion actual</p>
                <p className="font-medium text-heading">
                  {displayValue(gemeloActual?.perfilMedico?.medicacionActual, "-")}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Habitos de vida</p>
                <p className="font-medium text-heading">
                  Tabaquismo:{" "}
                  {gemeloActual?.perfilMedico?.habitosVida?.tabaquismo ? "Si" : "No"} - Alcohol:{" "}
                  {gemeloActual?.perfilMedico?.habitosVida?.alcohol ?? "-"} - Ejercicio:{" "}
                  {gemeloActual?.perfilMedico?.habitosVida?.ejercicio ?? "-"} - Dieta:{" "}
                  {gemeloActual?.perfilMedico?.habitosVida?.dieta ?? "-"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-muted-foreground">Contexto de datos medicos (MVP)</p>
                <p className="font-medium text-heading">
                  {datosMedicos.length} registro(s) cargado(s).
                </p>
                {datosMedicos.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {datosMedicos.slice(0, 3).map((dato) => (
                      <li key={dato.id} className="text-sm text-muted-foreground">
                        {dato.tipo}: {textPreview(dato.contenido, 120)}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulacion ECAMM</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSimularTratamiento}>
            <div className="grid gap-1.5">
              <Label htmlFor="tratamientoPropuesto">Tratamiento propuesto *</Label>
              <Textarea
                id="tratamientoPropuesto"
                className="min-h-32"
                value={tratamientoPropuesto}
                disabled={!hasGemelo || isSimulating}
                onChange={(event) => setTratamientoPropuesto(event.target.value)}
                placeholder="Describe el tratamiento que deseas simular."
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="dosisYDuracion">Dosis y duracion (opcional)</Label>
              <Textarea
                id="dosisYDuracion"
                className="min-h-24"
                value={dosisYDuracion}
                disabled={!hasGemelo || isSimulating}
                onChange={(event) => setDosisYDuracion(event.target.value)}
                placeholder="Ej: 1 comprimido cada 12 horas por 10 dias."
              />
            </div>

            {isSimulating ? (
              <p className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
                Simulando tratamiento...
              </p>
            ) : null}

            {!hasGemelo ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                Este paciente no tiene gemelo digital asociado. No es posible simular.
              </p>
            ) : null}

            {simulacionError ? (
              <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {simulacionError}
              </p>
            ) : null}

            {simulacionSuccess ? (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {simulacionSuccess}
              </p>
            ) : null}

            <div>
              <Button
                type="submit"
                disabled={!hasGemelo || !tratamientoPropuesto.trim() || isSimulating}
              >
                {isSimulating ? "Simulando tratamiento..." : "Simular tratamiento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ultima simulacion (MVP)</CardTitle>
        </CardHeader>
        <CardContent>
          {!ultimaSimulacion ? (
            <p className="text-sm text-muted-foreground">
              Todavia no hay simulaciones registradas para este paciente.
            </p>
          ) : (
            <div className="grid gap-3 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Tratamiento propuesto</p>
                  <p className="font-medium text-heading">
                    {displayValue(ultimaSimulacion.tratamientoPropuesto)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dosis y duracion</p>
                  <p className="font-medium text-heading">
                    {displayValue(ultimaSimulacion.dosisYDuracion)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Efectividad estimada</p>
                  <p className="font-medium text-heading">{displayValue(efectividadEstimada)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Probabilidad de exito</p>
                  <p className="font-medium text-heading">{displayValue(probabilidadExito)}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground">Riesgos</p>
                <p className="font-medium text-heading">{displayValue(riesgos)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Beneficios</p>
                <p className="font-medium text-heading">{displayValue(beneficios)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Monitoreo critico</p>
                <p className="font-medium text-heading">{displayValue(monitoreoCritico)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Recomendaciones</p>
                <p className="font-medium text-heading">{displayValue(recomendaciones)}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Fecha de simulacion</p>
                <p className="font-medium text-heading">
                  {formatDateTime(ultimaSimulacion.createdAt)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actualizar gemelo digital (post-consulta)</CardTitle>
        </CardHeader>
        <CardContent>
            {hasGemelo && consultasPaciente.length === 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm mb-5 text-amber-700">
                No hay consultas asociadas a este paciente. Debes tener una consulta para actualizar
                el gemelo digital.
              </p>
            ) : null}
          <form className="grid gap-4" onSubmit={onActualizarGemelo}>
            <div className="grid gap-1.5">
              <Label>Consulta asociada *</Label>
              <Select
                value={actualizacionForm.consultaId}
                onValueChange={(value) => onActualizacionChange("consultaId", value)}
                disabled={!canUpdateWithConsulta || isUpdating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una consulta" />
                </SelectTrigger>
                <SelectContent>
                  {consultasPaciente.map((consulta) => (
                    <SelectItem key={consulta.id} value={consulta.id}>
                      {formatConsultaLabel(consulta)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="cambiosRealizados">Cambios realizados *</Label>
              <Textarea
                id="cambiosRealizados"
                className="min-h-28"
                value={actualizacionForm.cambiosRealizados}
                disabled={!hasGemelo || isUpdating}
                onChange={(event) =>
                  onActualizacionChange("cambiosRealizados", event.target.value)
                }
                placeholder="Describe hallazgos y ajustes post-consulta."
              />
            </div>

            <div className="grid gap-4 rounded-md border border-border/60 p-4">
              <p className="text-sm font-medium text-heading">Datos actualizados</p>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Input
                    id="sexo"
                    value={actualizacionForm.sexo}
                    disabled={!hasGemelo || isUpdating}
                    onChange={(event) => onActualizacionChange("sexo", event.target.value)}
                    placeholder="femenino, masculino, otro"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="peso">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    value={actualizacionForm.peso}
                    disabled={!hasGemelo || isUpdating}
                    onChange={(event) => onActualizacionChange("peso", event.target.value)}
                    placeholder="65"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    type="number"
                    value={actualizacionForm.altura}
                    disabled={!hasGemelo || isUpdating}
                    onChange={(event) => onActualizacionChange("altura", event.target.value)}
                    placeholder="165"
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="medicacionActual">Medicacion actual (CSV)</Label>
                <Input
                  id="medicacionActual"
                  value={actualizacionForm.medicacionActual}
                  disabled={!hasGemelo || isUpdating}
                  onChange={(event) =>
                    onActualizacionChange("medicacionActual", event.target.value)
                  }
                  placeholder="Losartan 50mg, Aspirina 100mg"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="antecedentesQuirurgicos">Antecedentes quirurgicos (CSV)</Label>
                <Input
                  id="antecedentesQuirurgicos"
                  value={actualizacionForm.antecedentesQuirurgicos}
                  disabled={!hasGemelo || isUpdating}
                  onChange={(event) =>
                    onActualizacionChange("antecedentesQuirurgicos", event.target.value)
                  }
                  placeholder="Apendicectomia 2015, Colecistectomia 2019"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="antecedentesFamiliares">Antecedentes familiares (CSV)</Label>
                <Input
                  id="antecedentesFamiliares"
                  value={actualizacionForm.antecedentesFamiliares}
                  disabled={!hasGemelo || isUpdating}
                  onChange={(event) =>
                    onActualizacionChange("antecedentesFamiliares", event.target.value)
                  }
                  placeholder="Madre: diabetes, Padre: hipertension"
                />
              </div>
            </div>

            <div className="grid gap-4 rounded-md border border-border/60 p-4">
              <p className="text-sm font-medium text-heading">Habitos de vida</p>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="tabaquismo"
                  checked={actualizacionForm.tabaquismo}
                  disabled={!hasGemelo || isUpdating}
                  onCheckedChange={(checked) =>
                    onActualizacionChange("tabaquismo", Boolean(checked))
                  }
                />
                <Label htmlFor="tabaquismo">Tabaquismo</Label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="alcohol">Alcohol (string)</Label>
                  <Input
                    id="alcohol"
                    value={actualizacionForm.alcohol}
                    disabled={!hasGemelo || isUpdating}
                    onChange={(event) => onActualizacionChange("alcohol", event.target.value)}
                    placeholder="nunca, ocasional, frecuente"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="ejercicio">Ejercicio</Label>
                  <Input
                    id="ejercicio"
                    value={actualizacionForm.ejercicio}
                    disabled={!hasGemelo || isUpdating}
                    onChange={(event) => onActualizacionChange("ejercicio", event.target.value)}
                    placeholder="3 veces/semana"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="dieta">Dieta</Label>
                  <Input
                    id="dieta"
                    value={actualizacionForm.dieta}
                    disabled={!hasGemelo || isUpdating}
                    onChange={(event) => onActualizacionChange("dieta", event.target.value)}
                    placeholder="balanceada"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 rounded-md border border-border/60 p-4">
              <p className="text-sm font-medium text-heading">Signos vitales</p>

              <div className="grid gap-1.5">
                <Label htmlFor="presionArterial">Presion arterial</Label>
                <Input
                  id="presionArterial"
                  value={actualizacionForm.presionArterial}
                  disabled={!hasGemelo || isUpdating}
                  onChange={(event) =>
                    onActualizacionChange("presionArterial", event.target.value)
                  }
                  placeholder="130/85"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="frecuenciaCardiaca">Frecuencia cardiaca</Label>
                  <Input
                    id="frecuenciaCardiaca"
                    type="number"
                    value={actualizacionForm.frecuenciaCardiaca}
                    disabled={!hasGemelo || isUpdating}
                    onChange={(event) =>
                      onActualizacionChange("frecuenciaCardiaca", event.target.value)
                    }
                    placeholder="72"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="temperatura">Temperatura</Label>
                  <Input
                    id="temperatura"
                    type="number"
                    step="0.1"
                    value={actualizacionForm.temperatura}
                    disabled={!hasGemelo || isUpdating}
                    onChange={(event) => onActualizacionChange("temperatura", event.target.value)}
                    placeholder="36.5"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="saturacionO2">Saturacion O2</Label>
                  <Input
                    id="saturacionO2"
                    type="number"
                    value={actualizacionForm.saturacionO2}
                    disabled={!hasGemelo || isUpdating}
                    onChange={(event) => onActualizacionChange("saturacionO2", event.target.value)}
                    placeholder="98"
                  />
                </div>
              </div>
            </div>

            {isUpdating ? (
              <p className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
                Actualizando gemelo digital...
              </p>
            ) : null}

            {consultasError ? (
              <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                No se pudo cargar el listado de consultas: {consultasError}
              </p>
            ) : null}

            {hasGemelo && consultasPaciente.length === 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                No hay consultas asociadas a este paciente. Debes tener una consulta para actualizar
                el gemelo digital.
              </p>
            ) : null}

            {!hasGemelo ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                Este paciente no tiene gemelo digital asociado. No es posible actualizar.
              </p>
            ) : null}

            {actualizacionError ? (
              <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {actualizacionError}
              </p>
            ) : null}

            {actualizacionSuccess ? (
              <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {actualizacionSuccess}
              </p>
            ) : null}

            <div>
              <Button
                type="submit"
                disabled={
                  !canUpdateWithConsulta ||
                  !actualizacionForm.consultaId ||
                  !actualizacionForm.cambiosRealizados.trim() ||
                  isUpdating
                }
              >
                {isUpdating ? "Actualizando gemelo digital..." : "Actualizar gemelo digital"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
