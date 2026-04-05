"use client";

import { useState } from "react";
import { Badge } from "@/src/components/magic/ui/badge";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { Textarea } from "@/src/components/magic/ui/textarea";
import { LongTextBlock } from "@/src/components/medico/pacientes/detail/shared/LongTextBlock";
import { formatDateTime } from "@/src/lib/formatters";
import type { Consulta } from "@/src/lib/api/types";
import type { ConsultaFormState } from "@/src/components/medico/pacientes/detail/shared/utils";

interface ConsultasTabProps {
  consultas: Consulta[];
  activeConsulta: Consulta | null;
  isPending: boolean;
  onCreateDraftConsulta: () => Promise<void>;
  onSaveConsulta: (id: string, payload: ConsultaFormState) => Promise<void>;
  onCloseConsulta: (id: string) => Promise<void>;
}

interface ConsultaActivaEditorProps {
  activeConsulta: Consulta;
  isPending: boolean;
  onSaveConsulta: (id: string, payload: ConsultaFormState) => Promise<void>;
  onCloseConsulta: (id: string) => Promise<void>;
}

function ConsultaActivaEditor({
  activeConsulta,
  isPending,
  onSaveConsulta,
  onCloseConsulta,
}: ConsultaActivaEditorProps) {
  const [consultaForm, setConsultaForm] = useState<ConsultaFormState>({
    detalles: activeConsulta.detalles ?? "",
    tratamientoIndicado: activeConsulta.tratamientoIndicado ?? "",
  });

  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-medium text-heading">Consulta activa</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(activeConsulta.createdAt)}
          </p>
        </div>
        <Badge variant="outline">{activeConsulta.estado}</Badge>
      </div>

      <div className="mt-4 grid gap-3">
        <Textarea
          value={consultaForm.detalles}
          onChange={(event) =>
            setConsultaForm((prev) => ({ ...prev, detalles: event.target.value }))
          }
          className="min-h-24"
          placeholder="Detalles"
        />
        <Textarea
          value={consultaForm.tratamientoIndicado}
          onChange={(event) =>
            setConsultaForm((prev) => ({
              ...prev,
              tratamientoIndicado: event.target.value,
            }))
          }
          className="min-h-24"
          placeholder="Tratamiento indicado"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => void onSaveConsulta(activeConsulta.id, consultaForm)}
            disabled={isPending}
          >
            Guardar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => void onCloseConsulta(activeConsulta.id)}
            disabled={isPending}
          >
            Cerrar consulta
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ConsultasTab({
  consultas,
  activeConsulta,
  isPending,
  onCreateDraftConsulta,
  onSaveConsulta,
  onCloseConsulta,
}: ConsultasTabProps) {
  return (
    <Card id="consultas">
      <CardHeader>
        <CardTitle>Consultas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            La consulta activa es el borrador mas reciente del paciente.
          </p>
          <Button type="button" onClick={() => void onCreateDraftConsulta()} disabled={isPending}>
            {isPending ? "Creando..." : "Nueva consulta"}
          </Button>
        </div>

        {activeConsulta ? (
          <ConsultaActivaEditor
            key={activeConsulta.id}
            activeConsulta={activeConsulta}
            isPending={isPending}
            onSaveConsulta={onSaveConsulta}
            onCloseConsulta={onCloseConsulta}
          />
        ) : (
          <p className="text-sm text-muted-foreground">No hay consultas en borrador.</p>
        )}

        <div className="space-y-3">
          <p className="font-medium text-heading">Historial de consultas</p>
          {consultas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin consultas registradas.</p>
          ) : (
            consultas.map((consulta) => (
              <div key={consulta.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-heading">{formatDateTime(consulta.createdAt)}</p>
                  <Badge variant="outline">{consulta.estado}</Badge>
                </div>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Detalles
                    </p>
                    <LongTextBlock
                      value={consulta.detalles}
                      emptyText="-"
                      previewLines={5}
                      collapseAfter={320}
                      className="mt-1"
                      contentClassName="text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      Tratamiento
                    </p>
                    <LongTextBlock
                      value={consulta.tratamientoIndicado}
                      emptyText="-"
                      previewLines={5}
                      collapseAfter={320}
                      className="mt-1"
                      contentClassName="text-muted-foreground"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
