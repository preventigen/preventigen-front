import { PacienteForm } from "@/src/components/medico/pacientes/PacienteForm";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";

export default async function NuevoPacientePage() {
  const { token } = await requireMedicoSession();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Nuevo paciente</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa los datos para dar de alta un paciente en PreventiGen.
        </p>
      </div>

      <PacienteForm mode="create" token={token} cancelHref="/medico/pacientes" />
    </div>
  );
}
