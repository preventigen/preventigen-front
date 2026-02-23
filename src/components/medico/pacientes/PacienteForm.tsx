"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { Input } from "@/src/components/magic/ui/input";
import { Label } from "@/src/components/magic/ui/label";
import { isApiError } from "@/src/lib/api/http";
import { createPaciente, updatePaciente } from "@/src/lib/api/pacientes";
import type {
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
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
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
    };
  }

  return {
    nombre: initialPaciente.nombre ?? "",
    edad: initialPaciente.edad ? String(initialPaciente.edad) : "",
    telefono: initialPaciente.telefono ?? "",
    email: initialPaciente.email ?? "",
    alergias: initialPaciente.alergias.join(", "),
    enfermedadesCronicas: initialPaciente.enfermedadesCronicas.join(", "),
  };
}

export function PacienteForm({ mode, token, cancelHref, initialPaciente }: PacienteFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => buildInitialState(initialPaciente));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLabel = mode === "create" ? "Guardar paciente" : "Guardar cambios";
  const title = mode === "create" ? "Nuevo paciente" : "Editar paciente";

  const isValid = useMemo(() => form.nombre.trim().length > 0, [form.nombre]);

  function onChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildPayload(): CreatePacienteDto | UpdatePacienteDto {
    const edadValue = Number(form.edad);

    return {
      nombre: form.nombre.trim(),
      edad: Number.isFinite(edadValue) && form.edad.trim() !== "" ? edadValue : undefined,
      telefono: form.telefono.trim() || undefined,
      email: form.email.trim() || undefined,
      alergias: splitCsv(form.alergias),
      enfermedadesCronicas: splitCsv(form.enfermedadesCronicas),
    };
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValid) {
      setError("El nombre del paciente es obligatorio.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = buildPayload();

      if (mode === "create") {
        const createdPaciente = await createPaciente(payload as CreatePacienteDto, token);
        setSuccess("Paciente creado con exito.");

        if (createdPaciente.id) {
          router.push(`/medico/pacientes/${createdPaciente.id}`);
          router.refresh();
          return;
        }

        router.push("/medico/pacientes");
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

      const fallbackMessage =
        mode === "create"
          ? "No se pudo crear el paciente."
          : "No se pudo actualizar el paciente.";
      setError(err instanceof Error ? err.message || fallbackMessage : fallbackMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

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

          {error ? (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Guardando..." : submitLabel}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={cancelHref}>Cancelar</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
