"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { Input } from "@/src/components/magic/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/magic/ui/select";
import { Textarea } from "@/src/components/magic/ui/textarea";
import { formatDateTime } from "@/src/lib/formatters";
import type { GravedadNovedad, NovedadClinica } from "@/src/lib/api/types";
import {
  GRAVEDADES,
  type NovedadFormState,
} from "@/src/components/medico/pacientes/detail/shared/utils";

interface NovedadesTabProps {
  novedades: NovedadClinica[];
  isPending: boolean;
  onCreateNovedad: (payload: NovedadFormState) => Promise<boolean>;
  onRemoveNovedad: (id: string) => Promise<void>;
}

const initialNovedadForm: NovedadFormState = {
  tipoEvento: "",
  descripcion: "",
  zonaAfectada: "",
  gravedad: "",
  observaciones: "",
};

export function NovedadesTab({
  novedades,
  isPending,
  onCreateNovedad,
  onRemoveNovedad,
}: NovedadesTabProps) {
  const [novedadForm, setNovedadForm] = useState<NovedadFormState>(initialNovedadForm);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await onCreateNovedad(novedadForm);
    if (!created) return;

    setNovedadForm(initialNovedadForm);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novedades clinicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Tipo de evento"
              value={novedadForm.tipoEvento}
              onChange={(event) =>
                setNovedadForm((prev) => ({ ...prev, tipoEvento: event.target.value }))
              }
            />
            <Select
              value={novedadForm.gravedad}
              onValueChange={(value) =>
                setNovedadForm((prev) => ({ ...prev, gravedad: value as GravedadNovedad | "" }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Gravedad" />
              </SelectTrigger>
              <SelectContent>
                {GRAVEDADES.map((gravedad) => (
                  <SelectItem key={gravedad} value={gravedad}>
                    {gravedad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Descripcion"
              value={novedadForm.descripcion}
              onChange={(event) =>
                setNovedadForm((prev) => ({ ...prev, descripcion: event.target.value }))
              }
            />
            <Input
              placeholder="Zona afectada"
              value={novedadForm.zonaAfectada}
              onChange={(event) =>
                setNovedadForm((prev) => ({ ...prev, zonaAfectada: event.target.value }))
              }
            />
          </div>

          <Textarea
            placeholder="Observaciones"
            value={novedadForm.observaciones}
            onChange={(event) =>
              setNovedadForm((prev) => ({ ...prev, observaciones: event.target.value }))
            }
            className="min-h-24"
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Agregar novedad"}
          </Button>
        </form>

        <div className="space-y-3">
          {novedades.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin novedades clinicas.</p>
          ) : (
            novedades.map((novedad) => (
              <div
                key={novedad.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium text-heading">
                    {novedad.tipoEvento?.trim() || "Novedad sin tipo"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(novedad.createdAt)} · {novedad.gravedad ?? "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {novedad.descripcion?.trim() || "Sin descripcion"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {novedad.observaciones?.trim() || "Sin observaciones"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => void onRemoveNovedad(novedad.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
