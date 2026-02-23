import { DatoMedicoForm } from "@/src/components/medico/datos-medicos/DatoMedicoForm";
import { ErrorState } from "@/src/components/medico/states/ErrorState";
import { getPacienteById } from "@/src/lib/api/pacientes";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";

interface NuevoDatoMedicoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NuevoDatoMedicoPage({ params }: NuevoDatoMedicoPageProps) {
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
        actionLabel="Volver al listado"
        actionHref="/medico/pacientes"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Agregar dato medico</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paciente: {pacienteResult.paciente.nombre}. Carga informacion clinica en texto libre.
        </p>
      </div>

      <DatoMedicoForm
        token={token}
        pacienteId={pacienteId}
        cancelHref={`/medico/pacientes/${pacienteId}`}
        backHref={`/medico/pacientes/${pacienteId}`}
      />
    </div>
  );
}

