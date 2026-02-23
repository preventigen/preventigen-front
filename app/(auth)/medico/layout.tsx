import { ReactNode } from "react";
import { MedicoDashboardLayout } from "@/src/components/medico/layout/MedicoDashboardLayout";
import { requireMedicoSession } from "@/src/lib/auth/require-medico-session";

export default async function MedicoLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = await requireMedicoSession();
  const doctorName = session.user?.name ?? "Medico";

  return <MedicoDashboardLayout userName={doctorName}>{children}</MedicoDashboardLayout>;
}
