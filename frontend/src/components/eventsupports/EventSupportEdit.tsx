"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEventSupport, updateEventSupport } from "@/lib/api/eventSupports";
import { EventSupport } from "@/lib/types/eventSupport";
import { EventSupportForm, EventSupportFormValues, toRequest } from "@/components/eventsupports/EventSupportForm";
import { PageHeader } from "@/components/ui";

export function EventSupportEdit({ eventSupportId }: { eventSupportId: number }) {
  const router = useRouter();
  const [eventSupport, setEventSupport] = useState<EventSupport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventSupport(eventSupportId)
      .then(setEventSupport)
      .finally(() => setLoading(false));
  }, [eventSupportId]);

  async function handleSubmit(values: EventSupportFormValues) {
    await updateEventSupport(eventSupportId, toRequest(values));
    router.replace("/event-supports");
  }

  if (loading) {
    return <p className="text-slate-400">불러오는 중...</p>;
  }
  if (!eventSupport) {
    return <p className="text-slate-400">신청 내역을 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <PageHeader title="경조비 신청 수정" />
      <EventSupportForm eventSupport={eventSupport} onSubmit={handleSubmit} submitLabel="저장" />
    </div>
  );
}
