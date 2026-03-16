"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { Input } from "@/src/components/magic/ui/input";
import { isApiError } from "@/src/lib/api/http";
import { createConsulta } from "@/src/lib/api/consultas";
import { formatDateTime } from "@/src/lib/formatters";
import type { Consulta, PacienteListado } from "@/src/lib/api/types";

interface ConsultasPageClientProps {
  token: string;
  consultas: Consulta[];
  pacientes: PacienteListado[];
}

function nombreCompleto(paciente: PacienteListado) {
  return `${paciente.nombre} ${paciente.apellido}`.trim();
}

export function ConsultasPageClient({
  token,
  consultas,
  pacientes,
}: ConsultasPageClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pendingPacienteId, setPendingPacienteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredPacientes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return pacientes;

    return pacientes.filter((paciente) =>
      nombreCompleto(paciente).toLowerCase().includes(normalizedQuery)
    );
  }, [pacientes, query]);

  async function handleCreateConsulta(pacienteId: string) {
    setError(null);
    setPendingPacienteId(pacienteId);

    try {
      await createConsulta({ pacienteId }, token);
      router.push(`/medico/pacientes/${pacienteId}#consultas`);
      router.refresh();
    } catch (err) {
      if (isApiError(err) && (err.status === 401 || err.status === 403)) {
        router.push("/credentials");
        return;
      }

      setError(err instanceof Error ? err.message : "No se pudo crear la consulta.");
    } finally {
      setPendingPacienteId(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Ultimas consultas</CardTitle>
        </CardHeader>
        <CardContent>
          {consultas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Todavia no hay consultas registradas.</p>
          ) : (
            <div className="space-y-3">
              {consultas.map((consulta) => (
                <div key={consulta.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-heading">
                        {consulta.paciente
                          ? nombreCompleto(consulta.paciente)
                          : consulta.pacienteId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(consulta.createdAt)}
                      </p>
                    </div>
                    <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                      {consulta.estado}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a href={`/medico/pacientes/${consulta.pacienteId}`}>Ver ficha paciente</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nueva consulta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar paciente por nombre o apellido..."
          />

          {error ? (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <div className="space-y-3">
            {filteredPacientes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay pacientes que coincidan.</p>
            ) : (
              filteredPacientes.map((paciente) => (
                <div
                  key={paciente.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-heading">{nombreCompleto(paciente)}</p>
                    <p className="text-xs text-muted-foreground">
                      {paciente.genero} · {paciente.fechaNacimiento}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleCreateConsulta(paciente.id)}
                    disabled={pendingPacienteId === paciente.id}
                  >
                    {pendingPacienteId === paciente.id ? "Creando..." : "Crear consulta"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
