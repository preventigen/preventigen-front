"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { Checkbox } from "@/src/components/magic/ui/checkbox";
import { Input } from "@/src/components/magic/ui/input";
import { Label } from "@/src/components/magic/ui/label";
import { isApiError } from "@/src/lib/api/http";
import { createGemeloDigital } from "@/src/lib/api/gemelos-digitales";
import { createPaciente, updatePaciente } from "@/src/lib/api/pacientes";
import type {
  CreateGemeloDigitalDto,
  CreatePacienteDto,
  Paciente,
  UpdatePacienteDto,
} from "@/src/lib/api/types";

interface PacienteFormProps {
  mode: "create" | "edit";
  token: string;
  cancelHref: string;
  initialPaciente?: Paciente;
}

interface FormState {
  nombre: string;
  edad: string;
  telefono: string;
  email: string;
  alergias: string;
  enfermedadesCronicas: string;
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

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseOptionalNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function buildInitialState(initialPaciente?: Paciente): FormState {
  if (!initialPaciente) {
    return {
      nombre: "",
      edad: "",
      telefono: "",
      email: "",
      alergias: "",
      enfermedadesCronicas: "",
      sexo: "",
      peso: "",
      altura: "",
      medicacionActual: "",
      antecedentesQuirurgicos: "",
      antecedentesFamiliares: "",
      tabaquismo: false,
      alcohol: "",
      ejercicio: "",
      dieta: "",
      presionArterial: "",
      frecuenciaCardiaca: "",
      temperatura: "",
      saturacionO2: "",
    };
  }

  return {
    nombre: initialPaciente.nombre ?? "",
    edad: initialPaciente.edad ? String(initialPaciente.edad) : "",
    telefono: initialPaciente.telefono ?? "",
    email: initialPaciente.email ?? "",
    alergias: initialPaciente.alergias.join(", "),
    enfermedadesCronicas: initialPaciente.enfermedadesCronicas.join(", "),
    sexo: "",
    peso: "",
    altura: "",
    medicacionActual: "",
    antecedentesQuirurgicos: "",
    antecedentesFamiliares: "",
    tabaquismo: false,
    alcohol: "",
    ejercicio: "",
    dieta: "",
    presionArterial: "",
    frecuenciaCardiaca: "",
    temperatura: "",
    saturacionO2: "",
  };
}

export function PacienteForm({ mode, token, cancelHref, initialPaciente }: PacienteFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => buildInitialState(initialPaciente));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [partialPacienteId, setPartialPacienteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLabel = mode === "create" ? "Guardar paciente" : "Guardar cambios";
  const title = mode === "create" ? "Nuevo paciente" : "Editar paciente";

  const isValid = useMemo(() => form.nombre.trim().length > 0, [form.nombre]);

  function onChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildPayload(): CreatePacienteDto | UpdatePacienteDto {
    const edadValue = parseOptionalNumber(form.edad);

    return {
      nombre: form.nombre.trim(),
      edad: edadValue,
      telefono: form.telefono.trim() || undefined,
      email: form.email.trim() || undefined,
      alergias: splitCsv(form.alergias),
      enfermedadesCronicas: splitCsv(form.enfermedadesCronicas),
    };
  }

  function buildGemeloPayload(pacienteId: string): CreateGemeloDigitalDto {
    return {
      pacienteId,
      perfilMedico: {
        edad: parseOptionalNumber(form.edad),
        sexo: form.sexo.trim() || undefined,
        peso: parseOptionalNumber(form.peso),
        altura: parseOptionalNumber(form.altura),
        alergias: splitCsv(form.alergias),
        enfermedadesCronicas: splitCsv(form.enfermedadesCronicas),
        medicacionActual: splitCsv(form.medicacionActual),
        antecedentesQuirurgicos: splitCsv(form.antecedentesQuirurgicos),
        antecedentesFamiliares: splitCsv(form.antecedentesFamiliares),
        habitosVida: {
          tabaquismo: form.tabaquismo,
          alcohol: form.alcohol.trim() || undefined,
          ejercicio: form.ejercicio.trim() || undefined,
          dieta: form.dieta.trim() || undefined,
        },
        signosVitales: {
          presionArterial: form.presionArterial.trim() || undefined,
          frecuenciaCardiaca: parseOptionalNumber(form.frecuenciaCardiaca),
          temperatura: parseOptionalNumber(form.temperatura),
          saturacionO2: parseOptionalNumber(form.saturacionO2),
        },
      },
    };
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setProgress(null);
    setPartialPacienteId(null);

    if (!isValid) {
      setError("El nombre del paciente es obligatorio.");
      return;
    }

    let stage: "create-paciente" | "create-gemelo" | "edit-paciente" =
      mode === "create" ? "create-paciente" : "edit-paciente";
    let createdPacienteId: string | null = null;

    try {
      setIsSubmitting(true);
      const payload = buildPayload();

      if (mode === "create") {
        setProgress("Creando paciente...");
        const createdPaciente = await createPaciente(payload as CreatePacienteDto, token);
        createdPacienteId = createdPaciente.id || null;

        if (!createdPacienteId) {
          setError(
            "Paciente creado correctamente, pero no se recibio un ID para crear el gemelo digital."
          );
          return;
        }

        stage = "create-gemelo";
        setProgress("Paciente creado correctamente. Creando gemelo digital...");
        await createGemeloDigital(buildGemeloPayload(createdPacienteId), token);
        setSuccess("Paciente y gemelo digital creados con exito.");
        router.push(`/medico/pacientes/${createdPacienteId}`);
        router.refresh();
        return;
      }

      if (!initialPaciente?.id) {
        setError("No se encontro el paciente a editar.");
        return;
      }

      const updatedPaciente = await updatePaciente(initialPaciente.id, payload, token);
      setSuccess("Paciente actualizado con exito.");
      router.push(`/medico/pacientes/${updatedPaciente.id || initialPaciente.id}`);
      router.refresh();
    } catch (err) {
      if (isApiError(err) && (err.status === 401 || err.status === 403)) {
        router.push("/credentials");
        return;
      }

      if (mode === "create" && stage === "create-gemelo" && createdPacienteId) {
        const partialErrorMessage =
          "Paciente creado correctamente, pero fallo la creacion del gemelo digital.";
        const detail = err instanceof Error && err.message ? ` Detalle: ${err.message}` : "";
        setError(`${partialErrorMessage}${detail}`);
        setPartialPacienteId(createdPacienteId);
        return;
      }

      const fallbackMessage =
        mode === "create"
          ? "No se pudo completar la creacion del paciente."
          : "No se pudo actualizar el paciente.";
      setError(err instanceof Error ? err.message || fallbackMessage : fallbackMessage);
    } finally {
      setIsSubmitting(false);
      setProgress(null);
    }
  }

  const submitText = isSubmitting
    ? mode === "create"
      ? progress?.includes("gemelo")
        ? "Creando gemelo digital..."
        : "Creando paciente..."
      : "Guardando..."
    : submitLabel;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-1.5">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(event) => onChange("nombre", event.target.value)}
              placeholder="Nombre y apellido"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                type="number"
                value={form.edad}
                onChange={(event) => onChange("edad", event.target.value)}
                placeholder="Ej: 48"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="telefono">Telefono</Label>
              <Input
                id="telefono"
                value={form.telefono}
                onChange={(event) => onChange("telefono", event.target.value)}
                placeholder="Ej: +54 11 ..."
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
              placeholder="paciente@email.com"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="alergias">Alergias (separadas por comas)</Label>
            <Input
              id="alergias"
              value={form.alergias}
              onChange={(event) => onChange("alergias", event.target.value)}
              placeholder="Penicilina, Lactosa"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="enfermedadesCronicas">
              Enfermedades cronicas (separadas por comas)
            </Label>
            <Input
              id="enfermedadesCronicas"
              value={form.enfermedadesCronicas}
              onChange={(event) => onChange("enfermedadesCronicas", event.target.value)}
              placeholder="Hipertension, Diabetes tipo 2"
            />
          </div>

          {mode === "create" ? (
            <>
              <div className="grid gap-4 rounded-md border border-border/60 p-4">
                <p className="text-sm font-medium text-heading">Perfil medico para gemelo digital</p>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-1.5 sm:col-span-1">
                    <Label htmlFor="sexo">Sexo</Label>
                    <Input
                      id="sexo"
                      value={form.sexo}
                      onChange={(event) => onChange("sexo", event.target.value)}
                      placeholder="femenino, masculino, otro"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      value={form.peso}
                      onChange={(event) => onChange("peso", event.target.value)}
                      placeholder="Ej: 65"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="altura">Altura (cm)</Label>
                    <Input
                      id="altura"
                      type="number"
                      value={form.altura}
                      onChange={(event) => onChange("altura", event.target.value)}
                      placeholder="Ej: 165"
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="medicacionActual">Medicacion actual (separada por comas)</Label>
                  <Input
                    id="medicacionActual"
                    value={form.medicacionActual}
                    onChange={(event) => onChange("medicacionActual", event.target.value)}
                    placeholder="Losartan 50mg, Aspirina 100mg"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="antecedentesQuirurgicos">
                    Antecedentes quirurgicos (separados por comas)
                  </Label>
                  <Input
                    id="antecedentesQuirurgicos"
                    value={form.antecedentesQuirurgicos}
                    onChange={(event) => onChange("antecedentesQuirurgicos", event.target.value)}
                    placeholder="Apendicectomia 2015, Colecistectomia 2019"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="antecedentesFamiliares">
                    Antecedentes familiares (separados por comas)
                  </Label>
                  <Input
                    id="antecedentesFamiliares"
                    value={form.antecedentesFamiliares}
                    onChange={(event) => onChange("antecedentesFamiliares", event.target.value)}
                    placeholder="Madre: diabetes, Padre: hipertension"
                  />
                </div>
              </div>

              <div className="grid gap-4 rounded-md border border-border/60 p-4">
                <p className="text-sm font-medium text-heading">Habitos de vida</p>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="tabaquismo"
                    checked={form.tabaquismo}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({ ...prev, tabaquismo: Boolean(checked) }))
                    }
                  />
                  <Label htmlFor="tabaquismo">Tabaquismo</Label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="alcohol">Alcohol</Label>
                    <Input
                      id="alcohol"
                      value={form.alcohol}
                      onChange={(event) => onChange("alcohol", event.target.value)}
                      placeholder="ocasional"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="ejercicio">Ejercicio</Label>
                    <Input
                      id="ejercicio"
                      value={form.ejercicio}
                      onChange={(event) => onChange("ejercicio", event.target.value)}
                      placeholder="3 veces/semana"
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="dieta">Dieta</Label>
                  <Input
                    id="dieta"
                    value={form.dieta}
                    onChange={(event) => onChange("dieta", event.target.value)}
                    placeholder="balanceada"
                  />
                </div>
              </div>

              <div className="grid gap-4 rounded-md border border-border/60 p-4">
                <p className="text-sm font-medium text-heading">Signos vitales</p>

                <div className="grid gap-1.5">
                  <Label htmlFor="presionArterial">Presion arterial</Label>
                  <Input
                    id="presionArterial"
                    value={form.presionArterial}
                    onChange={(event) => onChange("presionArterial", event.target.value)}
                    placeholder="130/85"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="frecuenciaCardiaca">Frecuencia cardiaca</Label>
                    <Input
                      id="frecuenciaCardiaca"
                      type="number"
                      value={form.frecuenciaCardiaca}
                      onChange={(event) => onChange("frecuenciaCardiaca", event.target.value)}
                      placeholder="72"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="temperatura">Temperatura</Label>
                    <Input
                      id="temperatura"
                      type="number"
                      step="0.1"
                      value={form.temperatura}
                      onChange={(event) => onChange("temperatura", event.target.value)}
                      placeholder="36.5"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="saturacionO2">Saturacion O2</Label>
                    <Input
                      id="saturacionO2"
                      type="number"
                      value={form.saturacionO2}
                      onChange={(event) => onChange("saturacionO2", event.target.value)}
                      placeholder="98"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {progress ? (
            <p className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
              {progress}
            </p>
          ) : null}

          {error ? (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <p>{error}</p>
              {partialPacienteId ? (
                <p className="mt-1">
                  <Link
                    href={`/medico/pacientes/${partialPacienteId}`}
                    className="font-medium underline underline-offset-2"
                  >
                    Ir al detalle del paciente creado
                  </Link>
                </p>
              ) : null}
            </div>
          ) : null}

          {success ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {submitText}
            </Button>
            {isSubmitting ? (
              <Button type="button" variant="outline" disabled>
                Cancelar
              </Button>
            ) : (
              <Button type="button" variant="outline" asChild>
                <Link href={cancelHref}>Cancelar</Link>
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
