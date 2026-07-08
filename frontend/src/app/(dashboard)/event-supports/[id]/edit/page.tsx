import { EventSupportEdit } from "@/components/eventsupports/EventSupportEdit";

export default async function EventSupportEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventSupportEdit eventSupportId={Number(id)} />;
}
