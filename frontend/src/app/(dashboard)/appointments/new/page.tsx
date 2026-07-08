"use client";

import { useRouter } from "next/navigation";
import { createAppointment } from "@/lib/api/appointments";
import { AppointmentForm, AppointmentFormValues, toRequest } from "@/components/appointments/AppointmentForm";
import { PageHeader } from "@/components/ui";

export default function NewAppointmentPage() {
  const router = useRouter();

  async function handleSubmit(values: AppointmentFormValues) {
    await createAppointment(toRequest(values));
    router.replace("/appointments");
  }

  return (
    <div>
      <PageHeader title="발령등록" />
      <AppointmentForm onSubmit={handleSubmit} submitLabel="등록" />
    </div>
  );
}
