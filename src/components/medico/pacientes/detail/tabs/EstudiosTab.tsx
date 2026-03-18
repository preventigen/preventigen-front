"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { Input } from "@/src/components/magic/ui/input";
import { formatDate } from "@/src/lib/formatters";
import type { EstudioMedico } from "@/src/lib/api/types";
import type { EstudioFormState } from "@/src/components/medico/pacientes/detail/shared/utils";

interface EstudiosTabProps {
  estudios: EstudioMedico[];
  isPending: boolean;
  onCreateEstudio: (payload: EstudioFormState) => Promise<boolean>;
  onRemoveEstudio: (id: string) => Promise<void>;
}

const initialEstudioForm: EstudioFormState = {
  nombreEstudio: "",
  fecha: "",
  observaciones: "",
};

export function EstudiosTab({
  estudios,
  isPending,
  onCreateEstudio,
  onRemoveEstudio,
}: EstudiosTabProps) {
  const [estudioForm, setEstudioForm] = useState<EstudioFormState>(initialEstudioForm);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await onCreateEstudio(estudioForm);
    if (!created) return;

    setEstudioForm(initialEstudioForm);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estudios medicos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Input
            placeholder="Nombre del estudio"
            value={estudioForm.nombreEstudio}
            onChange={(event) =>
              setEstudioForm((prev) => ({ ...prev, nombreEstudio: event.target.value }))
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              type="date"
              value={estudioForm.fecha}
              onChange={(event) =>
                setEstudioForm((prev) => ({ ...prev, fecha: event.target.value }))
              }
            />
            <Input
              placeholder="Observaciones"
              value={estudioForm.observaciones}
              onChange={(event) =>
                setEstudioForm((prev) => ({ ...prev, observaciones: event.target.value }))
              }
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Agregar estudio"}
          </Button>
        </form>

        <div className="space-y-3">
          {estudios.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin estudios cargados.</p>
          ) : (
            estudios.map((estudio) => (
              <div
                key={estudio.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium text-heading">{estudio.nombreEstudio}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(estudio.fecha ?? estudio.createdAt)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {estudio.observaciones?.trim() || "Sin observaciones"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => void onRemoveEstudio(estudio.id)}
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
