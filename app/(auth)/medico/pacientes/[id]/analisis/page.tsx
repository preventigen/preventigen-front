import { redirect } from "next/navigation";

interface PacienteAnalisisPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PacienteAnalisisPage({ params }: PacienteAnalisisPageProps) {
  const { id } = await params;
  redirect(`/medico/pacientes/${id}`);
}
