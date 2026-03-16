"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Cog,
  LayoutDashboard,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/src/components/medico/layout/SignOutButton";

const sidebarItems = [
  { href: "/medico", label: "Dashboard", icon: LayoutDashboard },
  { href: "/medico/pacientes/nuevo", label: "Nuevo paciente", icon: UserPlus },
  { href: "/medico/pacientes", label: "Pacientes", icon: Users },
  { href: "/medico/consultas", label: "Consultas", icon: Stethoscope },
  { href: "/medico/configuracion", label: "Configuracion", icon: Cog },
];

function isItemActive(pathname: string, href: string) {
  if (href === "/medico") return pathname === "/medico";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MedicoSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-border/70 bg-surface md:sticky md:top-0 md:h-screen md:border-r">
      <div className="flex h-full flex-col">
        <div className="border-border/70 border-b px-4 py-5">
          <Link href="/medico" className="flex items-center gap-2 font-semibold text-heading">
            <Activity className="h-5 w-5 text-primary" />
            PreventiGen
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Panel medico</p>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-visible">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-heading"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-border/70 mt-auto border-t p-3">
          <SignOutButton className="w-full justify-start" variant="outline" />
        </div>
      </div>
    </aside>
  );
}
