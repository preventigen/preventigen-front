import { EmptyState } from "@/src/components/medico/states/EmptyState";

export default function GemeloDigitalPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Gemelo Digital</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Este modulo queda preparado para la segunda etapa del proyecto.
        </p>
      </div>

      <EmptyState
        title="Modulo en construccion"
        description="Pronto podras simular escenarios clinicos con gemelos digitales de pacientes."
      />
    </div>
  );
}
