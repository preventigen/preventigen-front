import { ReactNode } from "react";
import { MedicoSidebar } from "@/src/components/medico/layout/MedicoSidebar";
import { MedicoTopbar } from "@/src/components/medico/layout/MedicoTopbar";

interface MedicoDashboardLayoutProps {
  userName: string;
  children: ReactNode;
}

export function MedicoDashboardLayout({ userName, children }: MedicoDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <MedicoSidebar />

        <div className="flex min-h-screen flex-col">
          <MedicoTopbar userName={userName} roleLabel="Medico" />
          <main className="flex-1 px-4 py-5 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
