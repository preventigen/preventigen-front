import { NextResponse } from "next/server";
import { auth } from "@/auth";

function getDefaultRouteByRole(role?: string) {
  if (role === "admin") return "/admin";
  return "/medico"; // fallback por defecto
}

export const proxy = auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  const isLoggedIn = !!session;
  const role = session?.user?.role;

  const pathname = nextUrl.pathname;

  const isCredentialsPage = pathname === "/credentials";
  const isMedicoRoute = pathname.startsWith("/medico");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedRoute = isMedicoRoute || isAdminRoute;

  // 1) Si NO está logueado y quiere ruta protegida -> login
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL("/credentials", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 2) Si está logueado y entra a /credentials -> mandar a su panel
  if (isLoggedIn && isCredentialsPage) {
    const target = getDefaultRouteByRole(role);
    return NextResponse.redirect(new URL(target, nextUrl.origin));
  }

  // 3) Si está logueado pero intenta entrar a panel que no corresponde por rol
  if (isLoggedIn && isMedicoRoute && role !== "medico") {
    return NextResponse.redirect(new URL(getDefaultRouteByRole(role), nextUrl.origin));
  }

  if (isLoggedIn && isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL(getDefaultRouteByRole(role), nextUrl.origin));
  }

  return NextResponse.next();
});

// Solo ejecuta el proxy en las rutas que nos interesan
export const config = {
  matcher: ["/credentials", "/medico/:path*", "/admin/:path*"],
};