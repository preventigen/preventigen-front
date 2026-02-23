import type { Session } from "next-auth";
import type { AppRole } from "@/src/lib/api/types";

export interface SessionAuthContext {
  userId: string;
  role: AppRole;
  name: string;
  email: string;
  backendAccessToken: string;
}

export function getSessionAuthContext(session: Session | null): SessionAuthContext {
  const userId = session?.user?.id;
  const role = session?.user?.role;
  const name = session?.user?.name;
  const email = session?.user?.email;
  const backendAccessToken = session?.backendAccessToken;

  if (!session || !userId || !role || !name || !email || !backendAccessToken) {
    throw new Error("Sesion invalida o incompleta.");
  }

  return {
    userId,
    role,
    name,
    email,
    backendAccessToken,
  };
}
