"use client";

import { useRouter } from "next/navigation";
import { createEventSupport } from "@/lib/api/eventSupports";
import { EventSupportForm, EventSupportFormValues, toRequest } from "@/components/eventsupports/EventSupportForm";
import { PageHeader } from "@/components/ui";

export default function NewEventSupportPage() {
  const router = useRouter();

  async function handleSubmit(values: EventSupportFormValues) {
    await createEventSupport(toRequest(values));
    router.replace("/event-supports");
  }

  return (
    <div>
      <PageHeader title="경조비 신청등록" />
      <EventSupportForm onSubmit={handleSubmit} submitLabel="등록" />
    </div>
  );
}
