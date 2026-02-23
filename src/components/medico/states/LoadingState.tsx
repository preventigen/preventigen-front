import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  description?: string;
}

export function LoadingState({
  title = "Cargando informacion",
  description = "Espera un momento mientras traemos los datos.",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted p-8 text-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <h2 className="mt-4 text-lg font-semibold text-heading">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
