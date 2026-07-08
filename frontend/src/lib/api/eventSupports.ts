import { apiFetch, toQueryString } from "@/lib/api/client";
import { EventSupport, EventSupportRequest } from "@/lib/types/eventSupport";
import { Page } from "@/lib/types/employee";

export interface EventSupportSearchParams {
  keyword?: string;
  approvalStatus?: string;
  page?: number;
  size?: number;
}

export function searchEventSupports(params: EventSupportSearchParams): Promise<Page<EventSupport>> {
  const qs = toQueryString({
    keyword: params.keyword,
    approvalStatus: params.approvalStatus,
    page: params.page ?? 0,
    size: params.size ?? 10,
  });
  return apiFetch<Page<EventSupport>>(`/event-supports${qs}`);
}

export function getEventSupport(id: number): Promise<EventSupport> {
  return apiFetch<EventSupport>(`/event-supports/${id}`);
}

export function createEventSupport(request: EventSupportRequest): Promise<EventSupport> {
  return apiFetch<EventSupport>("/event-supports", { method: "POST", body: JSON.stringify(request) });
}

export function updateEventSupport(id: number, request: EventSupportRequest): Promise<EventSupport> {
  return apiFetch<EventSupport>(`/event-supports/${id}`, { method: "PUT", body: JSON.stringify(request) });
}

export function deleteEventSupport(id: number): Promise<void> {
  return apiFetch<void>(`/event-supports/${id}`, { method: "DELETE" });
}
