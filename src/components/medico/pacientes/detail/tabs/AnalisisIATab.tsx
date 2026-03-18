"use client";

import { useState } from "react";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/magic/ui/select";
import { Textarea } from "@/src/components/magic/ui/textarea";
import { formatDateTime, textPreview } from "@/src/lib/formatters";
import type {
  AnalisisIA,
  ContextoAnalisisIA,
  DatoMedico,
} from "@/src/lib/api/types";
import type { AnalisisFormState } from "@/src/components/medico/pacientes/detail/shared/utils";

interface AnalisisIATabProps {
  datosMedicos: DatoMedico[];
  ultimoAnalisis: AnalisisIA | null;
  contextoIa: ContextoAnalisisIA | null;
  isPending: boolean;
  onSubmitAnalisis: (payload: AnalisisFormState) => Promise<void>;
}

export function AnalisisIATab({
  datosMedicos,
  ultimoAnalisis,
  contextoIa,
  isPending,
  onSubmitAnalisis,
}: AnalisisIATabProps) {
  const [analisisForm, setAnalisisForm] = useState<AnalisisFormState>({
    datoMedicoId: "all",
    promptUsuario: "",
  });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Analisis IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={analisisForm.datoMedicoId}
            onValueChange={(value) =>
              setAnalisisForm((prev) => ({ ...prev, datoMedicoId: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los datos medicos</SelectItem>
              {datosMedicos.map((dato) => (
                <SelectItem key={dato.id} value={dato.id}>
                  {dato.tipo} · {textPreview(dato.contenido, 50)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={analisisForm.promptUsuario}
            onChange={(event) =>
              setAnalisisForm((prev) => ({ ...prev, promptUsuario: event.target.value }))
            }
            className="min-h-24"
            placeholder="Prompt opcional"
          />

          <Button
            type="button"
            onClick={() => void onSubmitAnalisis(analisisForm)}
            disabled={isPending}
          >
            {isPending ? "Analizando..." : "Analizar con IA"}
          </Button>

          <div className="rounded-lg border border-border p-4">
            <p className="font-medium text-heading">Contexto acumulado</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {contextoIa?.registroIA?.trim() || "Sin contexto"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ultimo analisis</CardTitle>
        </CardHeader>
        <CardContent>
          {!ultimoAnalisis ? (
            <p className="text-sm text-muted-foreground">
              Todavia no hay analisis para este paciente.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {formatDateTime(ultimoAnalisis.fechaGeneracion ?? undefined)} ·{" "}
                {ultimoAnalisis.tipoPrompt ?? "sistema"}
              </p>
              <p className="whitespace-pre-wrap text-sm text-heading">
                {ultimoAnalisis.respuestaIA}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
