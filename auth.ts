import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(1, "Password requerida"),
});

const medicoLoginSchema = z.object({
  access_token: z.string(),
  medico: z.object({
    id: z.union([z.string(), z.number()]),
    nombre: z.string(),
    email: z.string().email(),
  }),
});

const adminLoginSchema = z.object({
  access_token: z.string(),
  admin: z.object({
    id: z.union([z.string(), z.number()]),
    nombre: z.string(),
    email: z.string().email(),
  }),
});

const backendLoginSchema = z.union([medicoLoginSchema, adminLoginSchema]);
type BackendLogin = z.infer<typeof backendLoginSchema>;

function mapBackendUser(data: BackendLogin): User {
  if ("medico" in data) {
    return {
      id: String(data.medico.id),
      name: data.medico.nombre,
      email: data.medico.email,
      role: "medico",
      backendAccessToken: data.access_token,
    };
  }

  return {
    id: String(data.admin.id),
    name: data.admin.nombre,
    email: data.admin.email,
    role: "admin",
    backendAccessToken: data.access_token,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (rawCredentials) => {
  const parsedCredentials = loginSchema.safeParse(rawCredentials);
  if (!parsedCredentials.success) {
    console.log("❌ Credenciales inválidas por zod", parsedCredentials.error.flatten());
    return null;
  }

  if (!process.env.BACKEND_URL) {
    console.log("❌ Falta BACKEND_URL");
    throw new Error("BACKEND_URL no definido");
  }

  const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedCredentials.data),
    cache: "no-store",
  });

  console.log("➡️ /auth/login status:", res.status);

  if (!res.ok) {
    const txt = await res.text();
    console.log("❌ Backend login error:", txt);
    return null;
  }

  const json = await res.json();
  console.log("✅ Backend login response:", json);

  const parsedResponse = backendLoginSchema.safeParse(json);
  if (!parsedResponse.success) {
    console.log("❌ Respuesta backend no matchea schema", parsedResponse.error.flatten());
    return null;
  }

  return mapBackendUser(parsedResponse.data);
},
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
        token.backendAccessToken = user.backendAccessToken;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as "medico" | "admin";
      }
      session.backendAccessToken = token.backendAccessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/credentials",
  },
});
