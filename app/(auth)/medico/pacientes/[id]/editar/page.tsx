import { PacienteForm } from "@/src/components/medico/pacientes/PacienteForm";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { getPacienteById } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";

interface EditarPacientePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarPacientePage({ params }: EditarPacientePageProps) {
  const { token } = await requireMedicoSession();
  const { id: pacienteId } = await params;

  const pacienteResult = await (async () => {
    try {
      const paciente = await getPacienteById(pacienteId, token);
      return { paciente };
    } catch (error) {
      return {
        errorMessage: error instanceof Error ? error.message : "Intenta nuevamente.",
      };
    }
  })();

  if ("errorMessage" in pacienteResult) {
    return (
      <ErrorState
        title="No se pudo cargar el paciente"
        description={pacienteResult.errorMessage ?? "Intenta nuevamente."}
        actionLabel="Volver al detalle"
        actionHref={`/medico/pacientes/${pacienteId}`}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Editar paciente</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Actualiza los datos personales y clinicos del paciente.
        </p>
      </div>

      <PacienteForm
        mode="edit"
        token={token}
        initialPaciente={pacienteResult.paciente}
        cancelHref={`/medico/pacientes/${pacienteId}`}
      />
    </div>
  );
}

