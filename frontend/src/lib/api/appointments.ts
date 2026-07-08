import { apiFetch, toQueryString } from "@/lib/api/client";
import { Appointment, AppointmentRequest } from "@/lib/types/appointment";
import { Page } from "@/lib/types/employee";

export interface AppointmentSearchParams {
  keyword?: string;
  appointmentType?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export function searchAppointments(params: AppointmentSearchParams): Promise<Page<Appointment>> {
  const qs = toQueryString({
    keyword: params.keyword,
    appointmentType: params.appointmentType,
    fromDate: params.fromDate,
    toDate: params.toDate,
    page: params.page ?? 0,
    size: params.size ?? 10,
  });
  return apiFetch<Page<Appointment>>(`/appointments${qs}`);
}

export function getAppointment(id: number): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}`);
}

export function createAppointment(request: AppointmentRequest): Promise<Appointment> {
  return apiFetch<Appointment>("/appointments", { method: "POST", body: JSON.stringify(request) });
}

export function updateAppointment(id: number, request: AppointmentRequest): Promise<Appointment> {
  return apiFetch<Appointment>(`/appointments/${id}`, { method: "PUT", body: JSON.stringify(request) });
}

export function deleteAppointment(id: number): Promise<void> {
  return apiFetch<void>(`/appointments/${id}`, { method: "DELETE" });
}
