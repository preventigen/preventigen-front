import Link from "next/link";
import { Brain, FilePlus2, UserPlus } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/magic/ui/card";
import { EmptyState } from "@/src/components/medico/states/EmptyState";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { listAnalisisIaByPaciente } from "@/src/lib/api/analisis-ia";
import { listDatosMedicosByPaciente } from "@/src/lib/api/datos-medicos";
import { listPacientes } from "@/src/lib/api/pacientes";
import type { AnalisisIA, DatoMedico, Paciente } from "@/src/lib/api/types";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";
import { formatDateTime, textPreview } from "@/src/lib/formatters";

function sortByNewest<T extends { createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return bTime - aTime;
  });
}

async function getDashboardData(token: string) {
  const pacientes = await listPacientes(token);

  const datosResults = await Promise.all(
    pacientes.map(async (paciente) => {
      try {
        return await listDatosMedicosByPaciente(paciente.id, token);
      } catch {
        return [] as DatoMedico[];
      }
    })
  );

  const analisisResults = await Promise.all(
    pacientes.map(async (paciente) => {
      try {
        return await listAnalisisIaByPaciente(paciente.id, token);
      } catch {
        return [] as AnalisisIA[];
      }
    })
  );

  const datosMedicos = datosResults.flat();
  const analisis = analisisResults.flat();

  const recentPatients = sortByNewest<Paciente>(pacientes).slice(0, 5);
  const recentAnalisis = sortByNewest<AnalisisIA>(analisis).slice(0, 5);

  return {
    pacientes,
    datosMedicos,
    analisis,
    recentPatients,
    recentAnalisis,
  };
}

export default async function MedicoDashboardPage() {
  const { session, token } = await requireMedicoSession();

  const dashboardResult = await (async () => {
    try {
      const data = await getDashboardData(token);
      return { data };
    } catch (error) {
      return {
        errorMessage:
          error instanceof Error
            ? error.message
            : "Hubo un problema al cargar los datos del panel medico.",
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

  const { pacientes, datosMedicos, analisis, recentPatients, recentAnalisis } = dashboardResult.data;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-5">
        <h1 className="text-2xl font-semibold text-heading">
          Bienvenido, {session.user?.name ?? "Medico"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aqui tienes un resumen rapido de tus pacientes y actividad clinica reciente.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/medico/pacientes/nuevo">
              <UserPlus className="h-4 w-4" />
              Crear paciente
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/medico/pacientes">
              <FilePlus2 className="h-4 w-4" />
              Cargar dato medico
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/medico/analisis">
              <Brain className="h-4 w-4" />
              Analizar con IA
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total de pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-heading">{pacientes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Registros medicos cargados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-heading">{datosMedicos.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Analisis IA generados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-heading">{analisis.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Consultas pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-heading">0</p>
            <p className="mt-1 text-xs text-muted-foreground">Placeholder para siguiente etapa</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pacientes modificados recientemente</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPatients.length === 0 ? (
              <EmptyState
                title="Sin actividad de pacientes"
                description="Cuando cargues pacientes, apareceran aqui."
                actionLabel="Crear paciente"
                actionHref="/medico/pacientes/nuevo"
              />
            ) : (
              <ul className="space-y-3">
                {recentPatients.map((paciente) => (
                  <li key={paciente.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-heading">{paciente.nombre}</p>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/medico/pacientes/${paciente.id}`}>Ver</Link>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Alta: {formatDateTime(paciente.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analisis IA recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAnalisis.length === 0 ? (
              <EmptyState
                title="Sin analisis recientes"
                description="Aun no se generaron analisis con IA."
              />
            ) : (
              <ul className="space-y-3">
                {recentAnalisis.map((item) => (
                  <li key={item.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs uppercase text-muted-foreground">
                        {item.tipoPrompt ?? "sistema"}
                      </p>
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/medico/pacientes/${item.pacienteId}/analisis/${item.id}`}>
                          Ver
                        </Link>
                      </Button>
                    </div>
                    <p className="mt-1 text-sm text-heading">{textPreview(item.respuesta, 160)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(item.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {pacientes.length === 0 ? (
        <EmptyState
          title="El panel esta listo para comenzar"
          description="Tu primer paso es crear un paciente y cargar datos medicos para iniciar analisis IA."
          actionLabel="Crear primer paciente"
          actionHref="/medico/pacientes/nuevo"
        />
      ) : null}
    </div>
  );
}

