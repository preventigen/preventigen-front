"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/src/components/magic/ui/badge";
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
import { LongTextBlock } from "@/src/components/medico/pacientes/detail/shared/LongTextBlock";
import { formatDateTime } from "@/src/lib/formatters";
import type { DatoMedico, TipoDatoMedico } from "@/src/lib/api/types";
import {
  TIPOS_DATO_MEDICO,
  type DatoMedicoFormState,
} from "@/src/components/medico/pacientes/detail/shared/utils";

interface DatosMedicosTabProps {
  datosMedicos: DatoMedico[];
  isPending: boolean;
  onCreateDato: (payload: DatoMedicoFormState) => Promise<boolean>;
  onUpdateDato: (id: string, payload: DatoMedicoFormState) => Promise<boolean>;
  onRemoveDato: (id: string) => Promise<void>;
}

export function DatosMedicosTab({
  datosMedicos,
  isPending,
  onCreateDato,
  onUpdateDato,
  onRemoveDato,
}: DatosMedicosTabProps) {
  const [datoTipo, setDatoTipo] = useState<TipoDatoMedico>("otro");
  const [datoContenido, setDatoContenido] = useState("");
  const [editingDatoId, setEditingDatoId] = useState<string | null>(null);
  const [editingDatoTipo, setEditingDatoTipo] = useState<TipoDatoMedico>("otro");
  const [editingDatoContenido, setEditingDatoContenido] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await onCreateDato({
      tipo: datoTipo,
      contenido: datoContenido,
    });

    if (!created) return;

    setDatoContenido("");
    setDatoTipo("otro");
  }

  async function handleSave(id: string) {
    const updated = await onUpdateDato(id, {
      tipo: editingDatoTipo,
      contenido: editingDatoContenido,
    });

    if (!updated) return;

    setEditingDatoId(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos medicos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="grid gap-4 md:grid-cols-[220px,1fr] md:items-start" onSubmit={handleSubmit}>
          <div className="grid gap-1.5">
            <Label>Tipo</Label>
            <Select value={datoTipo} onValueChange={(value) => setDatoTipo(value as TipoDatoMedico)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_DATO_MEDICO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="datoContenido">Contenido</Label>
            <Textarea
              id="datoContenido"
              value={datoContenido}
              onChange={(event) => setDatoContenido(event.target.value)}
              className="min-h-28"
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Agregar dato medico"}
            </Button>
          </div>
        </form>

        {datosMedicos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos medicos cargados aun.</p>
        ) : (
          <div className="space-y-3">
            {datosMedicos.map((dato) => (
              <div key={dato.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{dato.tipo}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(dato.fechaCarga ?? dato.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingDatoId(dato.id);
                        setEditingDatoTipo(dato.tipo);
                        setEditingDatoContenido(dato.contenido);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => void onRemoveDato(dato.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>

                {editingDatoId === dato.id ? (
                  <div className="mt-3 grid gap-3">
                    <Select
                      value={editingDatoTipo}
                      onValueChange={(value) => setEditingDatoTipo(value as TipoDatoMedico)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_DATO_MEDICO.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      value={editingDatoContenido}
                      onChange={(event) => setEditingDatoContenido(event.target.value)}
                      className="min-h-24"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => void handleSave(dato.id)}
                        disabled={isPending}
                      >
                        Guardar
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingDatoId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <LongTextBlock
                    value={dato.contenido}
                    previewLines={7}
                    collapseAfter={420}
                    className="mt-3"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
