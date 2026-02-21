import { DefaultSession } from "next-auth";

type AppRole = "admin" | "medico";

declare module "next-auth" {
  interface User {
    id: string;
    role: AppRole;
    backendAccessToken: string;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: AppRole;
    };
    backendAccessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: AppRole;
    backendAccessToken?: string;
  }
}

export {};
