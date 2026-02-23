import { EmptyState } from "@/src/components/medico/states/EmptyState";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-heading">Configuracion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajustes de perfil y preferencias del medico.
        </p>
      </div>

      <EmptyState
        title="Seccion de configuracion"
        description="Este espacio quedo preparado para gestionar perfil, notificaciones y preferencias."
      />
    </div>
  );
}
