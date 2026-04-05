"use client";

import { useState } from "react";
import { Badge } from "@/src/components/magic/ui/badge";
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
import { InlineNotice } from "@/src/components/medico/pacientes/detail/shared/InlineNotice";
import { LongTextBlock } from "@/src/components/medico/pacientes/detail/shared/LongTextBlock";
import { formatDateTime, textPreview } from "@/src/lib/formatters";
import type {
  AnalisisIA,
  AsistenteMedicoConsulta,
  ContextoAnalisisIA,
  DatoMedico,
} from "@/src/lib/api/types";
import type {
  AnalisisFormState,
  AsistenteMedicoFormState,
} from "@/src/components/medico/pacientes/detail/shared/utils";

interface AnalisisIATabProps {
  datosMedicos: DatoMedico[];
  ultimoAnalisis: AnalisisIA | null;
  contextoIa: ContextoAnalisisIA | null;
  historialAsistente: AsistenteMedicoConsulta[];
  isPending: boolean;
  isAssistantPending: boolean;
  onSubmitAnalisis: (payload: AnalisisFormState) => Promise<void>;
  onSubmitAsistente: (payload: AsistenteMedicoFormState) => Promise<boolean>;
}

export function AnalisisIATab({
  datosMedicos,
  ultimoAnalisis,
  contextoIa,
  historialAsistente,
  isPending,
  isAssistantPending,
  onSubmitAnalisis,
  onSubmitAsistente,
}: AnalisisIATabProps) {
  const [analisisForm, setAnalisisForm] = useState<AnalisisFormState>({
    datoMedicoId: "all",
    promptUsuario: "",
  });
  const [asistenteForm, setAsistenteForm] = useState<AsistenteMedicoFormState>({
    consultaMedico: "",
  });

  const ultimaConsultaAsistente = historialAsistente[0] ?? null;

  async function handleSubmitAsistente() {
    const submitted = await onSubmitAsistente(asistenteForm);
    if (submitted) {
      setAsistenteForm({ consultaMedico: "" });
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Analisis general</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Reune el contexto clinico completo del paciente: datos medicos, consultas, estudios,
            novedades, alergias y memoria previa.
          </p>

          <Button
            type="button"
            onClick={() => void onSubmitAnalisis({ datoMedicoId: "all", promptUsuario: "" })}
            disabled={isPending}
          >
            {isPending ? "Analizando..." : "Generar analisis general"}
          </Button>

          {contextoIa ? (
            <div className="rounded-lg border border-border p-4">
              <p className="font-medium text-heading">Contexto acumulado</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ultima actualizacion: {formatDateTime(contextoIa.fechaRegistro ?? undefined)}
              </p>
              <LongTextBlock
                value={contextoIa.registroIA}
                emptyText="Sin contexto"
                previewLines={8}
                collapseAfter={520}
                className="mt-3"
                contentClassName="text-muted-foreground"
              />
            </div>
          ) : (
            <InlineNotice message="Todavia no hay contexto acumulado para este paciente." />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analisis guiado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Focaliza el analisis sobre un dato medico puntual y suma instrucciones especificas para
            orientar la respuesta.
          </p>

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
                  {dato.tipo} - {textPreview(dato.contenido, 50)}
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
            placeholder="Indicaciones opcionales para la IA"
          />

          <Button
            type="button"
            onClick={() => void onSubmitAnalisis(analisisForm)}
            disabled={isPending}
          >
            {isPending ? "Analizando..." : "Analizar con IA"}
          </Button>
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Asistente medico</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Consulta dudas clinicas puntuales usando el contexto del paciente, sus consultas,
              novedades y estudios registrados.
            </p>

            <Textarea
              value={asistenteForm.consultaMedico}
              onChange={(event) =>
                setAsistenteForm((prev) => ({
                  ...prev,
                  consultaMedico: event.target.value,
                }))
              }
              className="min-h-28"
              placeholder="Ej.: Que puntos deberia priorizar en el seguimiento de este caso?"
            />

            <Button
              type="button"
              onClick={() => void handleSubmitAsistente()}
              disabled={isAssistantPending}
            >
              {isAssistantPending ? "Consultando..." : "Consultar asistente"}
            </Button>

            {ultimaConsultaAsistente ? (
              <div className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-heading">Ultima respuesta</p>
                  {ultimaConsultaAsistente.modeloIAUtilizado ? (
                    <Badge variant="outline">{ultimaConsultaAsistente.modeloIAUtilizado}</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTime(ultimaConsultaAsistente.createdAt)}
                </p>
                <p className="mt-3 text-sm font-medium text-heading">
                  {ultimaConsultaAsistente.consultaMedico}
                </p>
                <LongTextBlock
                  value={ultimaConsultaAsistente.respuestaIA}
                  previewLines={10}
                  collapseAfter={700}
                  className="mt-3"
                />
              </div>
            ) : (
              <InlineNotice message="Todavia no hay consultas registradas para el asistente medico." />
            )}
          </div>

          <div className="space-y-3">
            <p className="font-medium text-heading">Historial reciente</p>
            {historialAsistente.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Las respuestas del asistente apareceran aqui para poder revisarlas luego.
              </p>
            ) : (
              historialAsistente.slice(0, 5).map((consulta) => (
                <div key={consulta.id} className="rounded-lg border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(consulta.createdAt)}
                  </p>
                  <p className="mt-2 text-sm font-medium text-heading">
                    {consulta.consultaMedico}
                  </p>
                  <LongTextBlock
                    value={consulta.respuestaIA}
                    previewLines={4}
                    collapseAfter={260}
                    className="mt-3"
                    contentClassName="text-muted-foreground"
                  />
                </div>
              ))
            )}
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
                {formatDateTime(ultimoAnalisis.fechaGeneracion ?? undefined)} -{" "}
                {ultimoAnalisis.tipoPrompt ?? "sistema"}
              </p>
              <LongTextBlock
                value={ultimoAnalisis.respuestaIA}
                previewLines={10}
                collapseAfter={700}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
