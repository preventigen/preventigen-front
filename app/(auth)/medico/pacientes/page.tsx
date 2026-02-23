import { PacientesList } from "@/src/components/medico/pacientes/PacientesList";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { listPacientes } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";

export default async function PacientesPage() {
  const { token } = await requireMedicoSession();

  const pacientesResult = await (async () => {
    try {
      const pacientes = await listPacientes(token);
      return { pacientes };
    } catch (error) {
      return {
        errorMessage:
          error instanceof Error ? error.message : "Intenta nuevamente en unos minutos.",
      };
    }
  })();

  if ("errorMessage" in pacientesResult) {
    return (
      <ErrorState
        title="No se pudo cargar la lista de pacientes"
        description={pacientesResult.errorMessage ?? "Intenta nuevamente."}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Pacientes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Busca, revisa y gestiona los pacientes registrados.
        </p>
      </div>

      <PacientesList pacientes={pacientesResult.pacientes} />
    </div>
  );
}

