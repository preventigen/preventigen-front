"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/src/components/magic/ui/button";

interface SignOutButtonProps {
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
}

export function SignOutButton({ className, variant = "ghost" }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await signOut({ callbackUrl: "/credentials" });
        })
      }
    >
      <LogOut className="h-4 w-4" />
      {isPending ? "Cerrando..." : "Cerrar sesion"}
    </Button>
  );
}
