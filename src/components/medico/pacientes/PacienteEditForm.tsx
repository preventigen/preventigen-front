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
import { isApiError } from "@/src/lib/api/http";
import {
  patchPacienteDatosMedicos,
  patchPacienteDatosPersonales,
} from "@/src/lib/api/pacientes";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/src/lib/toast";
import type {
  GeneroPaciente,
  PacienteDetalle,
  PatchPacienteDatosMedicosDto,
  PatchPacienteDatosPersonalesDto,
} from "@/src/lib/api/types";

interface PacienteEditFormProps {
  token: string;
  paciente: PacienteDetalle;
}

interface FormState {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: GeneroPaciente;
  diagnosticoPrincipal: string;
  antecedentesMedicos: string;
  medicacionActual: string;
  presionArterial: string;
  comentarios: string;
  alergias: string;
}

function buildInitialState(paciente: PacienteDetalle): FormState {
  return {
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    fechaNacimiento: paciente.fechaNacimiento,
    genero: paciente.genero,
    diagnosticoPrincipal: paciente.diagnosticoPrincipal ?? "",
    antecedentesMedicos: paciente.antecedentesMedicos ?? "",
    medicacionActual: paciente.medicacionActual ?? "",
    presionArterial: paciente.presionArterial ?? "",
    comentarios: paciente.comentarios ?? "",
    alergias: paciente.alergias ?? "",
  };
}

function pickChanged<T extends Record<string, string>>(current: T, initial: T) {
  return Object.fromEntries(
    Object.entries(current).filter(([key, value]) => value !== initial[key])
  ) as Partial<T>;
}

export function PacienteEditForm({ token, paciente }: PacienteEditFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => buildInitialState(paciente));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initial = useMemo(() => buildInitialState(paciente), [paciente]);
  const hasRequiredFields =
    form.nombre.trim() && form.apellido.trim() && form.fechaNacimiento && form.genero;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasRequiredFields) {
      showWarningToast("Completa nombre, apellido, fecha de nacimiento y genero.");
      return;
    }

    const changedPersonal = pickChanged(
      {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        fechaNacimiento: form.fechaNacimiento,
        genero: form.genero,
      },
      {
        nombre: initial.nombre,
        apellido: initial.apellido,
        fechaNacimiento: initial.fechaNacimiento,
        genero: initial.genero,
      }
    ) as PatchPacienteDatosPersonalesDto;

    const changedMedical = pickChanged(
      {
        diagnosticoPrincipal: form.diagnosticoPrincipal.trim(),
        antecedentesMedicos: form.antecedentesMedicos.trim(),
        medicacionActual: form.medicacionActual.trim(),
        presionArterial: form.presionArterial.trim(),
        comentarios: form.comentarios.trim(),
        alergias: form.alergias.trim(),
      },
      {
        diagnosticoPrincipal: initial.diagnosticoPrincipal,
        antecedentesMedicos: initial.antecedentesMedicos,
        medicacionActual: initial.medicacionActual,
        presionArterial: initial.presionArterial,
        comentarios: initial.comentarios,
        alergias: initial.alergias,
      }
    ) as PatchPacienteDatosMedicosDto;

    try {
      setIsSubmitting(true);

      const requests: Promise<unknown>[] = [];

      if (Object.keys(changedPersonal).length > 0) {
        requests.push(
          patchPacienteDatosPersonales(
            paciente.id,
            Object.fromEntries(
              Object.entries(changedPersonal).filter(([, value]) => value !== "")
            ) as PatchPacienteDatosPersonalesDto,
            token
          )
        );
      }

      if (Object.keys(changedMedical).length > 0) {
        requests.push(
          patchPacienteDatosMedicos(
            paciente.id,
            changedMedical,
            token
          )
        );
      }

      if (requests.length === 0) {
        router.push(`/medico/pacientes/${paciente.id}`);
        return;
      }

      await Promise.all(requests);
      showSuccessToast("Paciente actualizado correctamente.");
      router.push(`/medico/pacientes/${paciente.id}`);
      router.refresh();
    } catch (error) {
      if (isApiError(error) && (error.status === 401 || error.status === 403)) {
        router.push("/credentials");
        return;
      }

      showErrorToast(
        error instanceof Error ? error.message : "No se pudo actualizar el paciente."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar paciente</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                value={form.apellido}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, apellido: event.target.value }))
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
                value={form.fechaNacimiento}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, fechaNacimiento: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Genero *</Label>
              <Select
                value={form.genero}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, genero: value as GeneroPaciente }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
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
              value={form.diagnosticoPrincipal}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, diagnosticoPrincipal: event.target.value }))
              }
              className="min-h-24"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="antecedentesMedicos">Antecedentes medicos</Label>
            <Textarea
              id="antecedentesMedicos"
              value={form.antecedentesMedicos}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, antecedentesMedicos: event.target.value }))
              }
              className="min-h-24"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="medicacionActual">Medicacion actual</Label>
              <Textarea
                id="medicacionActual"
                value={form.medicacionActual}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, medicacionActual: event.target.value }))
                }
                className="min-h-24"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="presionArterial">Presion arterial</Label>
              <Input
                id="presionArterial"
                value={form.presionArterial}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, presionArterial: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="comentarios">Comentarios</Label>
            <Textarea
              id="comentarios"
              value={form.comentarios}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, comentarios: event.target.value }))
              }
              className="min-h-24"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="alergias">Alergias</Label>
            <Textarea
              id="alergias"
              value={form.alergias}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, alergias: event.target.value }))
              }
              className="min-h-24"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={!hasRequiredFields || isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href={`/medico/pacientes/${paciente.id}`}>Cancelar</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
