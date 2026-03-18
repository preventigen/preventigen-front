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
import { formatDateTime } from "@/src/lib/formatters";
import { InlineNotice } from "@/src/components/medico/pacientes/detail/shared/InlineNotice";
import type {
  Consulta,
  GemeloDigital,
  SimulacionTratamiento,
} from "@/src/lib/api/types";
import type {
  GemeloUpdateFormState,
  SimulacionFormState,
} from "@/src/components/medico/pacientes/detail/shared/utils";

interface GemeloTabProps {
  gemelo: GemeloDigital | null;
  consultas: Consulta[];
  ultimaSimulacion: SimulacionTratamiento | null;
  activeConsulta: Consulta | null;
  isSimulacionPending: boolean;
  isGemeloPending: boolean;
  onSubmitSimulacion: (payload: SimulacionFormState) => Promise<void>;
  onSubmitGemeloUpdate: (payload: GemeloUpdateFormState) => Promise<void>;
}

export function GemeloTab({
  gemelo,
  consultas,
  ultimaSimulacion,
  activeConsulta,
  isSimulacionPending,
  isGemeloPending,
  onSubmitSimulacion,
  onSubmitGemeloUpdate,
}: GemeloTabProps) {
  const [simulacionForm, setSimulacionForm] = useState<SimulacionFormState>({
    tratamientoPropuesto: "",
    dosisYDuracion: "",
  });
  const [gemeloUpdateForm, setGemeloUpdateForm] = useState<GemeloUpdateFormState>({
    consultaId: "",
    cambiosRealizados: "",
    datosActualizados: "{\n  \"presionArterial\": \"\"\n}",
  });
  const selectedConsultaId = gemeloUpdateForm.consultaId || activeConsulta?.id || "";

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Gemelo digital y simulacion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!gemelo ? (
            <InlineNotice message="Este paciente no tiene gemelo digital. La simulacion queda bloqueada." />
          ) : (
            <div className="rounded-lg border border-border p-4 text-sm">
              <p className="font-medium text-heading">Estado: {gemelo.estado}</p>
              <p className="text-muted-foreground">
                Ultima actualizacion: {formatDateTime(gemelo.updatedAt)}
              </p>
            </div>
          )}

          <Textarea
            value={simulacionForm.tratamientoPropuesto}
            onChange={(event) =>
              setSimulacionForm((prev) => ({
                ...prev,
                tratamientoPropuesto: event.target.value,
              }))
            }
            className="min-h-24"
            placeholder="Tratamiento propuesto"
            disabled={!gemelo}
          />
          <Textarea
            value={simulacionForm.dosisYDuracion}
            onChange={(event) =>
              setSimulacionForm((prev) => ({ ...prev, dosisYDuracion: event.target.value }))
            }
            className="min-h-20"
            placeholder="Dosis y duracion"
            disabled={!gemelo}
          />
          <Button
            type="button"
            onClick={() => void onSubmitSimulacion(simulacionForm)}
            disabled={!gemelo || isSimulacionPending}
          >
            {isSimulacionPending ? "Simulando..." : "Simular tratamiento"}
          </Button>

          <div className="rounded-lg border border-border p-4">
            <p className="font-medium text-heading">Ultima simulacion</p>
            {!ultimaSimulacion ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No hay simulaciones registradas.
              </p>
            ) : (
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p>{formatDateTime(ultimaSimulacion.createdAt)}</p>
                <p className="font-medium text-heading">
                  {ultimaSimulacion.tratamientoPropuesto}
                </p>
                <p>Dosis: {ultimaSimulacion.dosisYDuracion?.trim() || "-"}</p>
                <p>
                  Probabilidad de exito:{" "}
                  {ultimaSimulacion.prediccionRespuesta?.probabilidadExito ?? "-"}
                </p>
                <p>Beneficios: {ultimaSimulacion.analisisIA?.beneficios?.join(", ") || "-"}</p>
                <p>Riesgos: {ultimaSimulacion.analisisIA?.riesgos?.join(", ") || "-"}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actualizar gemelo digital</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!gemelo ? (
            <InlineNotice message="Sin gemelo digital no es posible aplicar actualizaciones." />
          ) : null}
          {gemelo && consultas.length === 0 ? (
            <InlineNotice message="No hay consultas registradas. Debes crear una para actualizar el gemelo." />
          ) : null}

          <Select
            value={selectedConsultaId}
            onValueChange={(value) =>
              setGemeloUpdateForm((prev) => ({ ...prev, consultaId: value }))
            }
            disabled={!gemelo || consultas.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Consulta asociada" />
            </SelectTrigger>
            <SelectContent>
              {consultas.map((consulta) => (
                <SelectItem key={consulta.id} value={consulta.id}>
                  {formatDateTime(consulta.createdAt)} · {consulta.estado}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={gemeloUpdateForm.cambiosRealizados}
            onChange={(event) =>
              setGemeloUpdateForm((prev) => ({
                ...prev,
                cambiosRealizados: event.target.value,
              }))
            }
            className="min-h-24"
            placeholder="Cambios realizados"
            disabled={!gemelo}
          />
          <Textarea
            value={gemeloUpdateForm.datosActualizados}
            onChange={(event) =>
              setGemeloUpdateForm((prev) => ({
                ...prev,
                datosActualizados: event.target.value,
              }))
            }
            className="min-h-40 font-mono text-xs"
            disabled={!gemelo}
          />
          <Button
            type="button"
            onClick={() =>
              void onSubmitGemeloUpdate({
                ...gemeloUpdateForm,
                consultaId: selectedConsultaId,
              })
            }
            disabled={!gemelo || consultas.length === 0 || isGemeloPending}
          >
            {isGemeloPending ? "Actualizando..." : "Actualizar gemelo"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
