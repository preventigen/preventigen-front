"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";
import { Input } from "@/src/components/magic/ui/input";
import { EmptyState } from "@/src/components/medico/states/EmptyState";
import { formatDate } from "@/src/lib/formatters";
import type { Paciente } from "@/src/lib/api/types";

interface PacientesListProps {
  pacientes: Paciente[];
}

export function PacientesList({ pacientes }: PacientesListProps) {
  const [query, setQuery] = useState("");

  const filteredPacientes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return pacientes;

    return pacientes.filter((paciente) => {
      const byNombre = paciente.nombre.toLowerCase().includes(normalizedQuery);
      const byEmail = (paciente.email ?? "").toLowerCase().includes(normalizedQuery);
      return byNombre || byEmail;
    });
  }, [pacientes, query]);

  if (pacientes.length === 0) {
    return (
      <EmptyState
        title="Aun no hay pacientes cargados"
        description="Comienza creando el primer paciente para iniciar el flujo clinico."
        actionLabel="Crear paciente"
        actionHref="/medico/pacientes/nuevo"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nombre o email..."
          className="w-full max-w-sm"
        />
        <Button asChild>
          <Link href="/medico/pacientes/nuevo">Nuevo paciente</Link>
        </Button>
      </div>

      {filteredPacientes.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No encontramos pacientes con ese criterio de busqueda."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Edad</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telefono</th>
                <th className="px-4 py-3">Alta</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacientes.map((paciente) => (
                <tr key={paciente.id} className="border-t border-border/70">
                  <td className="px-4 py-3 font-medium text-heading">{paciente.nombre}</td>
                  <td className="px-4 py-3 text-muted-foreground">{paciente.edad ?? "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{paciente.email ?? "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{paciente.telefono ?? "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(paciente.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/medico/pacientes/${paciente.id}`}>
                          <Eye className="h-4 w-4" />
                          Ver
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/medico/pacientes/${paciente.id}/editar`}>
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Link>
                      </Button>
                      <Button size="sm" variant="ghost" disabled>
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
