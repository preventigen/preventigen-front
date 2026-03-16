import { ConsultasPageClient } from "@/src/components/medico/consultas/ConsultasPageClient";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { listConsultas } from "@/src/lib/api/consultas";
import { isApiError } from "@/src/lib/api/http";
import { listPacientes } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";
import { redirect } from "next/navigation";

export default async function ConsultasPage() {
  const { token } = await requireMedicoSession();

  const consultasResult = await (async () => {
    try {
      const [consultas, pacientes] = await Promise.all([
        listConsultas(token),
        listPacientes(token),
      ]);

      return { consultas, pacientes };
    } catch (error) {
      if (isApiError(error) && (error.status === 401 || error.status === 403)) {
        redirect("/credentials");
      }

      return {
        errorMessage:
          error instanceof Error ? error.message : "No se pudo cargar la seccion de consultas.",
      };
    }
  })();

  if ("errorMessage" in consultasResult) {
    return (
      <ErrorState
        title="No se pudo cargar Consultas"
        description={consultasResult.errorMessage ?? "Intenta nuevamente."}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Consultas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa tus consultas recientes y crea una nueva sin salir del panel.
        </p>
      </div>

      <ConsultasPageClient
        token={token}
        consultas={consultasResult.consultas}
        pacientes={consultasResult.pacientes}
      />
    </div>
  );
}
