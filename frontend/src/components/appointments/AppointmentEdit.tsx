"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAppointment, updateAppointment } from "@/lib/api/appointments";
import { Appointment } from "@/lib/types/appointment";
import { AppointmentForm, AppointmentFormValues, toRequest } from "@/components/appointments/AppointmentForm";
import { PageHeader } from "@/components/ui";

export function AppointmentEdit({ appointmentId }: { appointmentId: number }) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointment(appointmentId)
      .then(setAppointment)
      .finally(() => setLoading(false));
  }, [appointmentId]);

  async function handleSubmit(values: AppointmentFormValues) {
    await updateAppointment(appointmentId, toRequest(values));
    router.replace("/appointments");
  }

  if (loading) {
    return <p className="text-slate-400">불러오는 중...</p>;
  }
  if (!appointment) {
    return <p className="text-slate-400">발령 이력을 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <PageHeader title="발령 수정" />
      <AppointmentForm appointment={appointment} onSubmit={handleSubmit} submitLabel="저장" />
    </div>
  );
}
