import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function MedicoLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  // Sin sesión -> login
  if (!session) {
    redirect("/credentials");
  }

  // Con sesión pero rol incorrecto -> redirigir al panel correcto
  if (session.user?.role !== "medico") {
    if (session.user?.role === "admin") {
      redirect("/admin");
    }
    redirect("/credentials");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Acá podés poner navbar/sidebar del panel médico */}
      {children}
    </div>
  );
}