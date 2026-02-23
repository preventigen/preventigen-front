"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
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
import { createDatoMedico } from "@/src/lib/api/datos-medicos";
import type { TipoDatoMedico } from "@/src/lib/api/types";

type SubmitIntent = "save" | "saveAndBack";

const tiposDatoMedico: TipoDatoMedico[] = [
  "antecedente",
  "diagnostico",
  "medicacion",
  "estudio",
  "evolucion",
  "otro",
];

interface DatoMedicoFormProps {
  token: string;
  pacienteId: string;
  cancelHref: string;
  backHref: string;
}

export function DatoMedicoForm({ token, pacienteId, cancelHref, backHref }: DatoMedicoFormProps) {
  const router = useRouter();
  const [tipo, setTipo] = useState<TipoDatoMedico>("antecedente");
  const [contenido, setContenido] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitIntent, setSubmitIntent] = useState<SubmitIntent>("save");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isValid = contenido.trim().length > 0;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValid) {
      setError("Debes completar el contenido del registro medico.");
      return;
    }

    try {
      setIsSubmitting(true);

      await createDatoMedico(
        {
          pacienteId,
          tipo,
          contenido: contenido.trim(),
        },
        token
      );

      if (submitIntent === "saveAndBack") {
        router.push(backHref);
        router.refresh();
        return;
      }

      setSuccess("Registro medico guardado con exito.");
      setContenido("");
      router.refresh();
    } catch (err) {
      if (isApiError(err) && (err.status === 401 || err.status === 403)) {
        router.push("/credentials");
        return;
      }

      if (isApiError(err) && err.status === 404) {
        setError("No encontramos el paciente para guardar este registro.");
        return;
      }

      setError(err instanceof Error ? err.message : "No se pudo guardar el registro medico.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo dato medico</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-1.5">
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={(value) => setTipo(value as TipoDatoMedico)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposDatoMedico.map((currentTipo) => (
                  <SelectItem key={currentTipo} value={currentTipo}>
                    {currentTipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="contenido">Contenido</Label>
            <Textarea
              id="contenido"
              value={contenido}
              onChange={(event) => setContenido(event.target.value)}
              className="min-h-44"
              placeholder="Ej: Paciente refiere dolor toracico intermitente..."
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

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              onClick={() => setSubmitIntent("save")}
            >
              {isSubmitting && submitIntent === "save" ? "Guardando..." : "Guardar"}
            </Button>

            <Button
              type="submit"
              variant="outline"
              disabled={!isValid || isSubmitting}
              onClick={() => setSubmitIntent("saveAndBack")}
            >
              {isSubmitting && submitIntent === "saveAndBack"
                ? "Guardando..."
                : "Guardar y volver"}
            </Button>

            <Button type="button" variant="ghost" asChild>
              <Link href={cancelHref}>Cancelar</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
