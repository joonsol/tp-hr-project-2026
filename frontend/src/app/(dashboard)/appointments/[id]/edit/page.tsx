import { AppointmentEdit } from "@/components/appointments/AppointmentEdit";

export default async function AppointmentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AppointmentEdit appointmentId={Number(id)} />;
}
