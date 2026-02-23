import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/src/components/magic/ui/button";

interface ErrorStateProps {
  title?: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function ErrorState({
  title = "Ocurrio un error",
  description,
  actionLabel,
  actionHref,
}: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-6">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 h-5 w-5 text-rose-600" />
        <div>
          <h2 className="text-base font-semibold text-rose-800">{title}</h2>
          <p className="mt-1 text-sm text-rose-700">{description}</p>
          {actionLabel && actionHref ? (
            <Button asChild size="sm" variant="outline" className="mt-4">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
