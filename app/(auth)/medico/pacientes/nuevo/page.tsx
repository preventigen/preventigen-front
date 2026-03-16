import { NuevoPacienteWizard } from "@/src/components/medico/pacientes/NuevoPacienteWizard";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";

export default async function NuevoPacientePage() {
  const { token } = await requireMedicoSession();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Nuevo paciente</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sigue el wizard para crear paciente, gemelo digital y estudios opcionales.
        </p>
      </div>

      <NuevoPacienteWizard token={token} />
    </div>
  );
}
