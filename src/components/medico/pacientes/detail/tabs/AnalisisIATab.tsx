"use client";

import { useState } from "react";
import { Badge } from "@/src/components/magic/ui/badge";
import { Button } from "@/src/components/magic/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/magic/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/magic/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/magic/ui/tabs";
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

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-white/65">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-white/70">{hint}</p>
    </div>
  );
}

function EmptyResult({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface-muted/50 p-6">
      <p className="font-medium text-heading">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
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
  const ultimoDatoAnalizado = ultimoAnalisis?.datoMedicoId
    ? datosMedicos.find((dato) => dato.id === ultimoAnalisis.datoMedicoId) ?? null
    : null;
  const analisisOrigen = !ultimoAnalisis
    ? null
    : ultimoAnalisis.datoMedicoId
      ? "Guiado por dato medico"
      : ultimoAnalisis.tipoPrompt === "usuario"
        ? "Guiado por instruccion"
        : "Analisis general";
  const analisisPrompt = ultimoAnalisis?.promptUsuario?.trim() || ultimoAnalisis?.prompt?.trim() || "";

  async function handleSubmitAsistente() {
    const submitted = await onSubmitAsistente(asistenteForm);
    if (submitted) {
      setAsistenteForm({ consultaMedico: "" });
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-primary/15 bg-[linear-gradient(135deg,rgba(11,31,59,1),rgba(15,60,88,0.96)_55%,rgba(22,163,127,0.78))] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-3">
            <Badge className="bg-white/12 text-white hover:bg-white/12" variant="secondary">
              Centro de IA clinica
            </Badge>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">
                Ejecuta analisis y revisa resultados sin salir del contexto del paciente
              </h3>
              <p className="max-w-xl text-sm leading-6 text-white/80">
                Esta vista separa accion, contexto y lectura de resultados para que el medico pueda
                entender rapido que se consulto, con que alcance y que devolvio la IA.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard
              label="Contexto IA"
              value={contextoIa ? "Activo" : "Pendiente"}
              hint={
                contextoIa
                  ? `Actualizado ${formatDateTime(contextoIa.fechaRegistro ?? undefined)}`
                  : "Se crea al generar un analisis"
              }
            />
            <MetricCard
              label="Datos medicos"
              value={String(datosMedicos.length)}
              hint={
                datosMedicos.length > 0
                  ? "Disponibles para analisis focalizado"
                  : "Aun no hay datos para seleccionar"
              }
            />
            <MetricCard
              label="Consultas asistente"
              value={String(historialAsistente.length)}
              hint={
                ultimaConsultaAsistente
                  ? `Ultima ${formatDateTime(ultimaConsultaAsistente.createdAt)}`
                  : "Sin historial todavia"
              }
            />
          </div>
        </div>
      </section>

      <Tabs defaultValue="analisis" className="gap-5">
        <TabsList className="bg-transparent p-0">
          <TabsTrigger value="analisis" className="min-w-[180px] bg-surface">
            Analisis
            {ultimoAnalisis ? <Badge variant="outline">1 resultado</Badge> : null}
          </TabsTrigger>
          <TabsTrigger value="asistente" className="min-w-[180px] bg-surface">
            Asistente medico
            {historialAsistente.length > 0 ? (
              <Badge variant="outline">{historialAsistente.length} consultas</Badge>
            ) : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analisis" className="gap-6">
          <div className="grid gap-6 xl:grid-cols-[0.92fr,1.08fr]">
            <Card className="border-primary/15 bg-[linear-gradient(180deg,rgba(24,72,104,0.06),rgba(255,255,255,0))]">
              <CardHeader>
                <CardTitle>Workspace de analisis</CardTitle>
                <CardDescription>
                  Elige entre un analisis global del caso o una lectura guiada con foco clinico.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium text-heading">Analisis general</p>
                      <p className="text-sm text-muted-foreground">
                        Integra paciente, consultas, estudios, novedades, alergias y memoria previa.
                      </p>
                    </div>
                    <Badge variant="outline">Contexto completo</Badge>
                  </div>
                  <Button
                    type="button"
                    className="mt-4 w-full sm:w-auto"
                    onClick={() =>
                      void onSubmitAnalisis({ datoMedicoId: "all", promptUsuario: "" })
                    }
                    disabled={isPending}
                  >
                    {isPending ? "Analizando..." : "Generar analisis general"}
                  </Button>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium text-heading">Analisis guiado</p>
                      <p className="text-sm text-muted-foreground">
                        Acota el foco a un dato medico especifico o agrega instrucciones del medico.
                      </p>
                    </div>
                    <Badge variant="outline">Foco dirigido</Badge>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-heading">Dato medico a priorizar</p>
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
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-heading">Instrucciones para la IA</p>
                      <Textarea
                        value={analisisForm.promptUsuario}
                        onChange={(event) =>
                          setAnalisisForm((prev) => ({
                            ...prev,
                            promptUsuario: event.target.value,
                          }))
                        }
                        className="min-h-28"
                        placeholder="Ej.: prioriza interacciones, riesgos de seguimiento o correlaciones clinicas"
                      />
                    </div>

                    <Button
                      type="button"
                      className="w-full sm:w-auto"
                      onClick={() => void onSubmitAnalisis(analisisForm)}
                      disabled={isPending}
                    >
                      {isPending ? "Analizando..." : "Ejecutar analisis guiado"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/15">
              <CardHeader className="border-b">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>Resultado mas reciente</CardTitle>
                  {analisisOrigen ? <Badge variant="outline">{analisisOrigen}</Badge> : null}
                  {ultimoAnalisis?.tipoPrompt ? (
                    <Badge variant="outline">{ultimoAnalisis.tipoPrompt}</Badge>
                  ) : null}
                </div>
                <CardDescription>
                  Lectura centralizada del ultimo analisis generado desde esta ficha.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {!ultimoAnalisis ? (
                  <EmptyResult
                    title="Todavia no hay analisis generados"
                    description="Cuando ejecutes un analisis general o guiado, la respuesta aparecera aca con su contexto de lectura."
                  />
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Generado
                        </p>
                        <p className="mt-2 font-medium text-heading">
                          {formatDateTime(ultimoAnalisis.fechaGeneracion ?? undefined)}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Ultima salida disponible para este paciente.
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Alcance
                        </p>
                        <p className="mt-2 font-medium text-heading">
                          {ultimoDatoAnalizado
                            ? `${ultimoDatoAnalizado.tipo} seleccionado`
                            : "Contexto clinico completo"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {ultimoDatoAnalizado
                            ? textPreview(ultimoDatoAnalizado.contenido, 80)
                            : "Paciente, consultas, estudios, novedades y memoria previa"}
                        </p>
                      </div>
                    </div>

                    {analisisPrompt ? (
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm font-medium text-heading">Prompt utilizado</p>
                        <LongTextBlock
                          value={analisisPrompt}
                          previewLines={4}
                          collapseAfter={240}
                          className="mt-3"
                          contentClassName="text-muted-foreground"
                        />
                      </div>
                    ) : null}

                    <div className="rounded-xl border border-primary/10 bg-[linear-gradient(180deg,rgba(45,212,191,0.08),rgba(255,255,255,0))] p-5">
                      <p className="text-sm font-medium text-heading">Respuesta IA</p>
                      <LongTextBlock
                        value={ultimoAnalisis.respuestaIA}
                        previewLines={14}
                        collapseAfter={900}
                        className="mt-3"
                      />
                    </div>

                    {ultimoAnalisis.resumenContexto?.trim() ? (
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-sm font-medium text-heading">Resumen de contexto</p>
                        <LongTextBlock
                          value={ultimoAnalisis.resumenContexto}
                          previewLines={6}
                          collapseAfter={360}
                          className="mt-3"
                          contentClassName="text-muted-foreground"
                        />
                      </div>
                    ) : null}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>Contexto acumulado</CardTitle>
                {contextoIa ? <Badge variant="outline">Memoria activa</Badge> : null}
              </div>
              <CardDescription>
                Estado del resumen persistido que la IA reutiliza en interacciones futuras.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contextoIa ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Ultima actualizacion
                      </p>
                      <p className="mt-2 font-medium text-heading">
                        {formatDateTime(contextoIa.fechaRegistro ?? undefined)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Estado
                      </p>
                      <p className="mt-2 font-medium text-heading">Disponible</p>
                    </div>
                    <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Uso
                      </p>
                      <p className="mt-2 font-medium text-heading">Soporte para analisis y asistente</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-background p-4">
                    <LongTextBlock
                      value={contextoIa.registroIA}
                      emptyText="Sin contexto"
                      previewLines={10}
                      collapseAfter={720}
                      contentClassName="text-muted-foreground"
                    />
                  </div>
                </div>
              ) : (
                <InlineNotice message="Todavia no hay contexto acumulado. Se generara cuando ejecutes el primer analisis." />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="asistente" className="gap-6">
          <div className="grid gap-6 xl:grid-cols-[0.88fr,1.12fr]">
            <Card className="border-primary/15 bg-[linear-gradient(180deg,rgba(24,72,104,0.06),rgba(255,255,255,0))]">
              <CardHeader>
                <CardTitle>Consulta clinica</CardTitle>
                <CardDescription>
                  Formula preguntas puntuales para obtener apoyo rapido sobre el caso.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <p className="font-medium text-heading">Que toma en cuenta el asistente</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Usa el contexto del paciente, sus consultas, novedades, estudios y la memoria
                    IA ya construida para responder dentro del foco clinico.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-heading">Pregunta del medico</p>
                  <Textarea
                    value={asistenteForm.consultaMedico}
                    onChange={(event) =>
                      setAsistenteForm((prev) => ({
                        ...prev,
                        consultaMedico: event.target.value,
                      }))
                    }
                    className="min-h-32"
                    placeholder="Ej.: que deberia monitorear primero en el seguimiento de este paciente?"
                  />
                </div>

                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => void handleSubmitAsistente()}
                  disabled={isAssistantPending}
                >
                  {isAssistantPending ? "Consultando..." : "Enviar consulta al asistente"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary/15">
              <CardHeader className="border-b">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>Respuesta destacada</CardTitle>
                  {ultimaConsultaAsistente?.modeloIAUtilizado ? (
                    <Badge variant="outline">{ultimaConsultaAsistente.modeloIAUtilizado}</Badge>
                  ) : null}
                </div>
                <CardDescription>
                  Ultima respuesta generada por el asistente medico para este paciente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {!ultimaConsultaAsistente ? (
                  <EmptyResult
                    title="Todavia no hay consultas al asistente"
                    description="Cuando envies una pregunta clinica, la ultima respuesta se mostrara aca con mejor contexto de lectura."
                  />
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Emitida
                        </p>
                        <p className="mt-2 font-medium text-heading">
                          {formatDateTime(ultimaConsultaAsistente.createdAt)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-surface-muted/40 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Historial total
                        </p>
                        <p className="mt-2 font-medium text-heading">
                          {historialAsistente.length} consultas registradas
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-4">
                      <p className="text-sm font-medium text-heading">Pregunta enviada</p>
                      <LongTextBlock
                        value={ultimaConsultaAsistente.consultaMedico}
                        previewLines={4}
                        collapseAfter={220}
                        className="mt-3"
                        contentClassName="text-muted-foreground"
                      />
                    </div>

                    <div className="rounded-xl border border-primary/10 bg-[linear-gradient(180deg,rgba(45,212,191,0.08),rgba(255,255,255,0))] p-5">
                      <p className="text-sm font-medium text-heading">Respuesta IA</p>
                      <LongTextBlock
                        value={ultimaConsultaAsistente.respuestaIA}
                        previewLines={14}
                        collapseAfter={900}
                        className="mt-3"
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historial reciente</CardTitle>
              <CardDescription>
                Registro de las ultimas preguntas hechas por el medico y sus respuestas resumidas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historialAsistente.length === 0 ? (
                <InlineNotice message="Las respuestas del asistente apareceran aca para poder revisarlas luego." />
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {historialAsistente.slice(0, 6).map((consulta, index) => (
                    <div
                      key={consulta.id}
                      className="rounded-xl border border-border bg-background p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Badge variant="outline">Consulta {index + 1}</Badge>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(consulta.createdAt)}
                        </p>
                      </div>
                      <p className="mt-3 text-sm font-medium text-heading">
                        {consulta.consultaMedico}
                      </p>
                      <LongTextBlock
                        value={consulta.respuestaIA}
                        previewLines={5}
                        collapseAfter={300}
                        className="mt-3"
                        contentClassName="text-muted-foreground"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
