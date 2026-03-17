"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { createEstudioMedico } from "@/src/lib/api/estudios-medicos";
import { createGemeloDigital } from "@/src/lib/api/gemelos-digitales";
import { isApiError } from "@/src/lib/api/http";
import { createPaciente } from "@/src/lib/api/pacientes";
import { formatDate } from "@/src/lib/formatters";
import type { CreatePacienteDto, EstudioMedico, GeneroPaciente } from "@/src/lib/api/types";

interface NuevoPacienteWizardProps {
  token: string;
}

interface PacienteFormState {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: GeneroPaciente | "";
  diagnosticoPrincipal: string;
  antecedentesMedicos: string;
  medicacionActual: string;
  presionArterial: string;
  comentarios: string;
}

interface EstudioFormState {
  nombreEstudio: string;
  fecha: string;
  observaciones: string;
}

const initialPacienteForm: PacienteFormState = {
  nombre: "",
  apellido: "",
  fechaNacimiento: "",
  genero: "",
  diagnosticoPrincipal: "",
  antecedentesMedicos: "",
  medicacionActual: "",
  presionArterial: "",
  comentarios: "",
};

const initialEstudioForm: EstudioFormState = {
  nombreEstudio: "",
  fecha: "",
  observaciones: "",
};

function cleanPayload(payload: CreatePacienteDto): CreatePacienteDto {
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0)
    )
  ) as CreatePacienteDto;
}

function StepBadge({ index, currentStep, label }: { index: number; currentStep: number; label: string }) {
  const active = currentStep === index;
  const completed = currentStep > index;

  return (
    <div
      className={[
        "rounded-lg border px-3 py-2 text-sm",
        completed
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : active
            ? "border-primary/30 bg-primary/5 text-heading"
            : "border-border bg-surface text-muted-foreground",
      ].join(" ")}
    >
      <p className="text-xs uppercase tracking-wide">Paso {index}</p>
      <p className="font-medium">{label}</p>
    </div>
  );
}

export function NuevoPacienteWizard({ token }: NuevoPacienteWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [pacienteForm, setPacienteForm] = useState<PacienteFormState>(initialPacienteForm);
  const [estudioForm, setEstudioForm] = useState<EstudioFormState>(initialEstudioForm);
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [estudios, setEstudios] = useState<EstudioMedico[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreatingPaciente, setIsCreatingPaciente] = useState(false);
  const [isCreatingGemelo, setIsCreatingGemelo] = useState(false);
  const [isCreatingEstudio, setIsCreatingEstudio] = useState(false);

  const isPacienteValid = useMemo(() => {
    return (
      pacienteForm.nombre.trim() &&
      pacienteForm.apellido.trim() &&
      pacienteForm.fechaNacimiento &&
      pacienteForm.genero
    );
  }, [pacienteForm]);

  const canCreateEstudio = estudioForm.nombreEstudio.trim().length > 0;
  const hasPendingEstudio =
    estudioForm.nombreEstudio.trim().length > 0 ||
    estudioForm.fecha.length > 0 ||
    estudioForm.observaciones.trim().length > 0;

  function handleUnauthorized(error: unknown) {
    if (isApiError(error) && (error.status === 401 || error.status === 403)) {
      router.push("/credentials");
      return true;
    }

    return false;
  }

  async function handleCreatePaciente(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setStatusMessage(null);

    if (!isPacienteValid) {
      setErrorMessage("Completa nombre, apellido, fecha de nacimiento y genero.");
      return;
    }

    try {
      setIsCreatingPaciente(true);
      setStatusMessage("Creando paciente...");

      const createdPaciente = await createPaciente(
        cleanPayload({
          nombre: pacienteForm.nombre.trim(),
          apellido: pacienteForm.apellido.trim(),
          fechaNacimiento: pacienteForm.fechaNacimiento,
          genero: pacienteForm.genero as GeneroPaciente,
          diagnosticoPrincipal: pacienteForm.diagnosticoPrincipal.trim() || undefined,
          antecedentesMedicos: pacienteForm.antecedentesMedicos.trim() || undefined,
          medicacionActual: pacienteForm.medicacionActual.trim() || undefined,
          presionArterial: pacienteForm.presionArterial.trim() || undefined,
          comentarios: pacienteForm.comentarios.trim() || undefined,
        }),
        token
      );

      setPacienteId(createdPaciente.id);
      setCurrentStep(2);
      setStatusMessage(null);
      setSuccessMessage("Paciente creado correctamente.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      setErrorMessage(error instanceof Error ? error.message : "No se pudo crear el paciente.");
      setStatusMessage(null);
    } finally {
      setIsCreatingPaciente(false);
    }
  }

  async function handleCreateGemelo() {
    if (!pacienteId) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      setIsCreatingGemelo(true);
      setStatusMessage("Paciente creado. Creando gemelo digital...");
      await createGemeloDigital({ pacienteId }, token);
      setCurrentStep(3);
      setStatusMessage("Gemelo creado. (Opcional) Cargando estudios...");
      setSuccessMessage("Paciente y gemelo creados correctamente.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      setStatusMessage(null);
      setErrorMessage(
        error instanceof Error
          ? `El paciente se creo, pero no se pudo crear el gemelo digital. ${error.message}`
          : "El paciente se creo, pero no se pudo crear el gemelo digital."
      );
    } finally {
      setIsCreatingGemelo(false);
    }
  }

  async function handleCreateEstudio(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pacienteId) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!canCreateEstudio) {
      setErrorMessage("El nombre del estudio es obligatorio.");
      return;
    }

    try {
      setIsCreatingEstudio(true);
      setStatusMessage("Gemelo creado. (Opcional) Cargando estudios...");

      const estudio = await createEstudioMedico(
        {
          pacienteId,
          nombreEstudio: estudioForm.nombreEstudio.trim(),
          fecha: estudioForm.fecha || undefined,
          observaciones: estudioForm.observaciones.trim() || undefined,
        },
        token
      );

      setEstudios((prev) => [estudio, ...prev]);
      setEstudioForm(initialEstudioForm);
      setSuccessMessage("Estudio agregado correctamente.");
    } catch (error) {
      if (handleUnauthorized(error)) return;
      setErrorMessage(
        error instanceof Error
          ? `No se pudo cargar el estudio. ${error.message}`
          : "No se pudo cargar el estudio."
      );
    } finally {
      setIsCreatingEstudio(false);
      setStatusMessage(null);
    }
  }

  async function finishWizard({ savePendingEstudio }: { savePendingEstudio: boolean }) {
    if (!pacienteId) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (savePendingEstudio && hasPendingEstudio) {
      if (!canCreateEstudio) {
        setErrorMessage("Completa el nombre del estudio o limpia el formulario antes de finalizar.");
        return;
      }

      try {
        setIsCreatingEstudio(true);
        setStatusMessage("Guardando estudio y redirigiendo a la ficha del paciente...");

        await createEstudioMedico(
          {
            pacienteId,
            nombreEstudio: estudioForm.nombreEstudio.trim(),
            fecha: estudioForm.fecha || undefined,
            observaciones: estudioForm.observaciones.trim() || undefined,
          },
          token
        );
      } catch (error) {
        if (handleUnauthorized(error)) return;
        setErrorMessage(
          error instanceof Error
            ? `No se pudo guardar el estudio. ${error.message}`
            : "No se pudo guardar el estudio."
        );
        setStatusMessage(null);
        setIsCreatingEstudio(false);
        return;
      }
    }

    setSuccessMessage(
      savePendingEstudio && hasPendingEstudio
        ? "Paciente, gemelo y estudio guardados correctamente."
        : "Paciente y gemelo creados correctamente."
    );
    router.push(`/medico/pacientes/${pacienteId}`);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <StepBadge index={1} currentStep={currentStep} label="Crear paciente" />
        <StepBadge index={2} currentStep={currentStep} label="Crear gemelo digital" />
        <StepBadge index={3} currentStep={currentStep} label="Cargar estudios" />
      </div>

      {statusMessage ? (
        <p className="rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">
          {statusMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          <p>{errorMessage}</p>
          {pacienteId ? (
            <p className="mt-2">
              <Link
                href={`/medico/pacientes/${pacienteId}`}
                className="font-medium underline underline-offset-2"
              >
                Ir a ficha del paciente
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}

      {successMessage ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}

      {currentStep === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Paso 1. Crear paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleCreatePaciente}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={pacienteForm.nombre}
                    onChange={(event) =>
                      setPacienteForm((prev) => ({ ...prev, nombre: event.target.value }))
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    value={pacienteForm.apellido}
                    onChange={(event) =>
                      setPacienteForm((prev) => ({ ...prev, apellido: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="fechaNacimiento">Fecha de nacimiento *</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={pacienteForm.fechaNacimiento}
                    onChange={(event) =>
                      setPacienteForm((prev) => ({
                        ...prev,
                        fechaNacimiento: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Genero *</Label>
                  <Select
                    value={pacienteForm.genero}
                    onValueChange={(value) =>
                      setPacienteForm((prev) => ({
                        ...prev,
                        genero: value as GeneroPaciente,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona genero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="diagnosticoPrincipal">Diagnostico principal</Label>
                <Textarea
                  id="diagnosticoPrincipal"
                  value={pacienteForm.diagnosticoPrincipal}
                  onChange={(event) =>
                    setPacienteForm((prev) => ({
                      ...prev,
                      diagnosticoPrincipal: event.target.value,
                    }))
                  }
                  className="min-h-24"
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="antecedentesMedicos">Antecedentes medicos</Label>
                <Textarea
                  id="antecedentesMedicos"
                  value={pacienteForm.antecedentesMedicos}
                  onChange={(event) =>
                    setPacienteForm((prev) => ({
                      ...prev,
                      antecedentesMedicos: event.target.value,
                    }))
                  }
                  className="min-h-24"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="medicacionActual">Medicacion actual</Label>
                  <Textarea
                    id="medicacionActual"
                    value={pacienteForm.medicacionActual}
                    onChange={(event) =>
                      setPacienteForm((prev) => ({
                        ...prev,
                        medicacionActual: event.target.value,
                      }))
                    }
                    className="min-h-24"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="presionArterial">Presion arterial</Label>
                  <Input
                    id="presionArterial"
                    value={pacienteForm.presionArterial}
                    onChange={(event) =>
                      setPacienteForm((prev) => ({
                        ...prev,
                        presionArterial: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="comentarios">Comentarios</Label>
                <Textarea
                  id="comentarios"
                  value={pacienteForm.comentarios}
                  onChange={(event) =>
                    setPacienteForm((prev) => ({ ...prev, comentarios: event.target.value }))
                  }
                  className="min-h-24"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={!isPacienteValid || isCreatingPaciente}>
                  {isCreatingPaciente ? "Creando paciente..." : "Crear paciente"}
                </Button>
                <Button asChild type="button" variant="outline">
                  <Link href="/medico/pacientes">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {currentStep === 2 ? (
        <Card>
          <CardHeader>
            <CardTitle>Paso 2. Crear gemelo digital</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              El paciente ya fue creado. Ahora debes generar el gemelo digital para habilitar la
              simulacion posterior.
            </p>

            <div className="rounded-lg border border-border bg-surface-muted p-4 text-sm">
              <p className="font-medium text-heading">
                {pacienteForm.nombre} {pacienteForm.apellido}
              </p>
              <p className="text-muted-foreground">
                Nacimiento: {formatDate(pacienteForm.fechaNacimiento)} · Genero:{" "}
                {pacienteForm.genero}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleCreateGemelo} disabled={isCreatingGemelo}>
                {isCreatingGemelo ? "Creando gemelo digital..." : "Crear gemelo digital"}
              </Button>
              {pacienteId ? (
                <Button asChild type="button" variant="outline">
                  <Link href={`/medico/pacientes/${pacienteId}`}>Ir a ficha del paciente</Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {currentStep === 3 ? (
        <div className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Paso 3. Cargar estudios medicos</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleCreateEstudio}>
                <div className="grid gap-1.5">
                  <Label htmlFor="nombreEstudio">Nombre del estudio *</Label>
                  <Input
                    id="nombreEstudio"
                    value={estudioForm.nombreEstudio}
                    onChange={(event) =>
                      setEstudioForm((prev) => ({
                        ...prev,
                        nombreEstudio: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="fechaEstudio">Fecha</Label>
                  <Input
                    id="fechaEstudio"
                    type="date"
                    value={estudioForm.fecha}
                    onChange={(event) =>
                      setEstudioForm((prev) => ({ ...prev, fecha: event.target.value }))
                    }
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="observacionesEstudio">Observaciones</Label>
                  <Textarea
                    id="observacionesEstudio"
                    value={estudioForm.observaciones}
                    onChange={(event) =>
                      setEstudioForm((prev) => ({
                        ...prev,
                        observaciones: event.target.value,
                      }))
                    }
                    className="min-h-24"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={!canCreateEstudio || isCreatingEstudio}>
                    {isCreatingEstudio ? "Agregando estudio..." : "Agregar estudio"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void finishWizard({ savePendingEstudio: true })}
                    disabled={isCreatingEstudio}
                  >
                    {isCreatingEstudio
                      ? "Guardando..."
                      : hasPendingEstudio
                        ? "Finalizar y guardar estudio"
                        : "Finalizar"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => void finishWizard({ savePendingEstudio: false })}
                    disabled={isCreatingEstudio}
                  >
                    {hasPendingEstudio ? "Descartar estudio y finalizar" : "Saltar este paso"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estudios cargados en esta sesion</CardTitle>
            </CardHeader>
            <CardContent>
              {estudios.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Todavia no cargaste estudios. Puedes finalizar ahora o agregar uno o varios.
                </p>
              ) : (
                <ul className="space-y-3">
                  {estudios.map((estudio) => (
                    <li key={estudio.id} className="rounded-lg border border-border p-3">
                      <p className="font-medium text-heading">{estudio.nombreEstudio}</p>
                      <p className="text-xs text-muted-foreground">
                        Fecha: {formatDate(estudio.fecha ?? undefined)}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                        {estudio.observaciones?.trim() || "Sin observaciones"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
