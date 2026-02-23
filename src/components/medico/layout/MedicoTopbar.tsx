import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/src/components/magic/ui/badge";
import { Button } from "@/src/components/magic/ui/button";
import { SignOutButton } from "@/src/components/medico/layout/SignOutButton";

interface MedicoTopbarProps {
  userName: string;
  roleLabel: string;
}

export function MedicoTopbar({ userName, roleLabel }: MedicoTopbarProps) {
  const showEnvironmentBadge = process.env.NODE_ENV !== "production";

  return (
    <header className="border-border/70 bg-surface/90 sticky top-0 z-10 border-b px-4 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-heading">{userName}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="outline">{roleLabel}</Badge>
            {showEnvironmentBadge ? (
              <Badge variant="outline" className="border-amber-300 text-amber-700">
                {process.env.NODE_ENV}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/medico/pacientes/nuevo">
              <PlusCircle className="h-4 w-4" />
              Nuevo paciente
            </Link>
          </Button>
          <SignOutButton className="hidden sm:inline-flex" variant="ghost" />
        </div>
      </div>
    </header>
  );
}
