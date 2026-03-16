import { redirect } from "next/navigation";

interface NuevoDatoMedicoPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NuevoDatoMedicoPage({ params }: NuevoDatoMedicoPageProps) {
  const { id } = await params;
  redirect(`/medico/pacientes/${id}`);
}
