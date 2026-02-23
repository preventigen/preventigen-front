import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireMedicoSession() {
  const session = await auth();

  if (!session) {
    redirect("/credentials");
  }

  if (session.user?.role !== "medico") {
    redirect("/");
  }

  if (!session.backendAccessToken) {
    redirect("/credentials");
  }

  return {
    session,
    token: session.backendAccessToken,
  };
}
