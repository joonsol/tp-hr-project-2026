import { apiFetch } from "@/lib/api/client";
import { EmploymentType, EmploymentTypeRequest } from "@/lib/types/employmentType";

export function listEmploymentTypes(): Promise<EmploymentType[]> {
  return apiFetch<EmploymentType[]>("/employment-types");
}

export function createEmploymentType(request: EmploymentTypeRequest): Promise<EmploymentType> {
  return apiFetch<EmploymentType>("/employment-types", { method: "POST", body: JSON.stringify(request) });
}

export function updateEmploymentType(id: number, request: EmploymentTypeRequest): Promise<EmploymentType> {
  return apiFetch<EmploymentType>(`/employment-types/${id}`, { method: "PUT", body: JSON.stringify(request) });
}

export function deleteEmploymentType(id: number): Promise<void> {
  return apiFetch<void>(`/employment-types/${id}`, { method: "DELETE" });
}
