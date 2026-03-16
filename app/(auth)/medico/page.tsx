import Link from "next/link";
import { FilePlus2, Stethoscope, UserPlus } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { EmptyState } from "@/src/components/medico/states/EmptyState";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { listConsultas } from "@/src/lib/api/consultas";
import { isApiError } from "@/src/lib/api/http";
import { listPacientes } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";
import { formatDateTime } from "@/src/lib/formatters";
import { redirect } from "next/navigation";

function sortByNewest<T extends { createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

export default async function MedicoDashboardPage() {
  const { session, token } = await requireMedicoSession();

  const dashboardResult = await (async () => {
    try {
      const [pacientes, consultas] = await Promise.all([
        listPacientes(token),
        listConsultas(token),
      ]);

      return { pacientes, consultas };
    } catch (error) {
      if (isApiError(error) && (error.status === 401 || error.status === 403)) {
        redirect("/credentials");
      }

      return {
        errorMessage:
          error instanceof Error
            ? error.message
            : "Hubo un problema al cargar el dashboard medico.",
      };
    }
  })();

  if ("errorMessage" in dashboardResult) {
    return (
      <ErrorState
        title="No pudimos cargar el dashboard"
        description={dashboardResult.errorMessage ?? "Intenta nuevamente."}
        actionLabel="Ir a pacientes"
        actionHref="/medico/pacientes"
      />
    );
  }

  const recentPacientes = dashboardResult.pacientes.slice(0, 5);
  const recentConsultas = sortByNewest(dashboardResult.consultas).slice(0, 5);
  const consultasBorrador = dashboardResult.consultas.filter(
    (consulta) => consulta.estado === "borrador"
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h1 className="text-2xl font-semibold text-heading">
          Bienvenido, {session.user?.name ?? "Medico"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen del panel medico adaptado al nuevo flujo clinico.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/medico/pacientes/nuevo">
              <UserPlus className="h-4 w-4" />
              Nuevo paciente
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/medico/pacientes">
              <FilePlus2 className="h-4 w-4" />
              Ver pacientes
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/medico/consultas">
              <Stethoscope className="h-4 w-4" />
              Ir a consultas
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-heading">
              {dashboardResult.pacientes.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Consultas totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-heading">
              {dashboardResult.consultas.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Consultas borrador</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-heading">{consultasBorrador.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Consultas cerradas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-heading">
              {dashboardResult.consultas.filter((consulta) => consulta.estado === "cerrada").length}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pacientes recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPacientes.length === 0 ? (
              <EmptyState
                title="Sin pacientes aun"
                description="Cuando cargues pacientes, apareceran aqui."
                actionLabel="Crear paciente"
                actionHref="/medico/pacientes/nuevo"
              />
            ) : (
              <div className="space-y-3">
                {recentPacientes.map((paciente) => (
                  <div key={paciente.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-heading">
                          {paciente.nombre} {paciente.apellido}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {paciente.genero} · {paciente.fechaNacimiento}
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/medico/pacientes/${paciente.id}`}>Ver ficha</Link>
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
            <CardTitle>Consultas recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentConsultas.length === 0 ? (
              <EmptyState
                title="Sin consultas aun"
                description="Crea una consulta desde la ficha del paciente o desde la seccion Consultas."
                actionLabel="Ir a consultas"
                actionHref="/medico/consultas"
              />
            ) : (
              <div className="space-y-3">
                {recentConsultas.map((consulta) => (
                  <div key={consulta.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-heading">
                          {consulta.paciente
                            ? `${consulta.paciente.nombre} ${consulta.paciente.apellido}`
                            : consulta.pacienteId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(consulta.createdAt)} · {consulta.estado}
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/medico/pacientes/${consulta.pacienteId}#consultas`}>
                          Abrir
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
