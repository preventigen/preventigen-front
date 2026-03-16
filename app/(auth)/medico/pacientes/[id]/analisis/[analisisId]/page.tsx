import { redirect } from "next/navigation";

interface AnalisisDetallePageProps {
  params: Promise<{
    id: string;
    analisisId: string;
  }>;
}

export default async function AnalisisDetallePage({ params }: AnalisisDetallePageProps) {
  const { id } = await params;
  redirect(`/medico/pacientes/${id}`);
}
