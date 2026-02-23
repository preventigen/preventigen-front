"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { AnalisisIaHistoryList } from "@/src/components/medico/ia/AnalisisIaHistoryList";
import { AnalisisIaResult } from "@/src/components/medico/ia/AnalisisIaResult";
import { isApiError } from "@/src/lib/api/http";
import { createAnalisisIa } from "@/src/lib/api/analisis-ia";
import { formatDateTime, textPreview } from "@/src/lib/formatters";
import type { AnalisisIA, DatoMedico, Paciente } from "@/src/lib/api/types";

type Scope = "all" | "single";

interface AnalisisIaFormProps {
  token: string;
  paciente: Paciente;
  datosMedicos: DatoMedico[];
  analisisRecientes: AnalisisIA[];
  initialDatoMedicoId?: string;
}

export function AnalisisIaForm({
  token,
  paciente,
  datosMedicos,
  analisisRecientes,
  initialDatoMedicoId,
}: AnalisisIaFormProps) {
  const router = useRouter();
  const [scope, setScope] = useState<Scope>(initialDatoMedicoId ? "single" : "all");
  const [datoMedicoId, setDatoMedicoId] = useState(initialDatoMedicoId ?? "");
  const [promptUsuario, setPromptUsuario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalisisIA | null>(null);

  const ultimoAnalisis = useMemo(() => analisisRecientes[0] ?? null, [analisisRecientes]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (scope === "single" && !datoMedicoId) {
      setError("Selecciona un dato medico especifico para continuar.");
      return;
    }

    try {
      setIsSubmitting(true);

      const analisis = await createAnalisisIa(
        {
          pacienteId: paciente.id,
          datoMedicoId: scope === "single" ? datoMedicoId : undefined,
          tipoPrompt: promptUsuario.trim() ? "usuario" : "sistema",
          promptUsuario: promptUsuario.trim() || undefined,
        },
        token
      );

      setResult(analisis);
      router.refresh();
    } catch (err) {
      if (isApiError(err) && (err.status === 401 || err.status === 403)) {
        router.push("/credentials");
        return;
      }

      if (isApiError(err) && err.status === 400) {
        const lowerMessage = err.message.toLowerCase();
        if (lowerMessage.includes("gemini") || lowerMessage.includes("api key")) {
          setError(
            "El backend no pudo ejecutar la IA. Verifica la configuracion de GOOGLE_GEMINI_API_KEY."
          );
          return;
        }
      }

      if (isApiError(err) && err.status === 404) {
        setError("No encontramos el paciente o el dato medico seleccionado.");
        return;
      }

      setError(err instanceof Error ? err.message : "No se pudo completar el analisis IA.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contexto del paciente</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Paciente</p>
            <p className="font-medium text-heading">{paciente.nombre}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Edad</p>
            <p className="font-medium text-heading">{paciente.edad ?? "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Registros medicos</p>
            <p className="font-medium text-heading">{datosMedicos.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ultimo analisis</p>
            <p className="font-medium text-heading">
              {ultimoAnalisis ? formatDateTime(ultimoAnalisis.createdAt) : "-"}
            </p>
          </div>
          {ultimoAnalisis ? (
            <div className="sm:col-span-2">
              <p className="text-muted-foreground">Preview ultimo resultado</p>
              <p className="font-medium text-heading">{textPreview(ultimoAnalisis.respuesta, 160)}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analizar con IA</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label>Alcance del analisis</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={scope === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScope("all")}
                >
                  Analizar todos los datos
                </Button>
                <Button
                  type="button"
                  variant={scope === "single" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScope("single")}
                >
                  Analizar registro especifico
                </Button>
              </div>
            </div>

            {scope === "single" ? (
              <div className="grid gap-1.5">
                <Label>Dato medico</Label>
                <Select value={datoMedicoId} onValueChange={setDatoMedicoId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un dato medico" />
                  </SelectTrigger>
                  <SelectContent>
                    {datosMedicos.map((dato) => (
                      <SelectItem key={dato.id} value={dato.id}>
                        {dato.tipo} · {textPreview(dato.contenido, 80)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            <div className="grid gap-1.5">
              <Label htmlFor="promptUsuario">Prompt opcional</Label>
              <Textarea
                id="promptUsuario"
                className="min-h-36"
                value={promptUsuario}
                onChange={(event) => setPromptUsuario(event.target.value)}
                placeholder="Ej: resumir hallazgos, identificar puntos de atencion y sugerir preguntas para la consulta."
              />
            </div>

            {error ? (
              <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Analizando..." : "Analizar con IA"}
              </Button>
              <Button asChild variant="outline" type="button">
                <Link href={`/medico/pacientes/${paciente.id}`}>Volver al paciente</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {result ? <AnalisisIaResult analisis={result} /> : null}

      <AnalisisIaHistoryList pacienteId={paciente.id} items={analisisRecientes} />
    </div>
  );
}
