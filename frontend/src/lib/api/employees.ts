import { apiFetch, toQueryString } from "@/lib/api/client";
import { Employee, EmployeeCreateRequest, EmployeeUpdateRequest, Page } from "@/lib/types/employee";

export interface EmployeeSearchParams {
  keyword?: string;
  departmentId?: number;
  positionId?: number;
  status?: string;
  page?: number;
  size?: number;
}

export function searchEmployees(params: EmployeeSearchParams): Promise<Page<Employee>> {
  const qs = toQueryString({
    keyword: params.keyword,
    departmentId: params.departmentId,
    positionId: params.positionId,
    status: params.status,
    page: params.page ?? 0,
    size: params.size ?? 20,
  });
  return apiFetch<Page<Employee>>(`/employees${qs}`);
}

export async function listEmployees(): Promise<Employee[]> {
  const page = await searchEmployees({ status: "ACTIVE", page: 0, size: 200 });
  return page.content;
}

export function getEmployee(id: number): Promise<Employee> {
  return apiFetch<Employee>(`/employees/${id}`);
}

export function createEmployee(request: EmployeeCreateRequest): Promise<Employee> {
  return apiFetch<Employee>("/employees", { method: "POST", body: JSON.stringify(request) });
}

export function updateEmployee(id: number, request: EmployeeUpdateRequest): Promise<Employee> {
  return apiFetch<Employee>(`/employees/${id}`, { method: "PUT", body: JSON.stringify(request) });
}

export function deleteEmployee(id: number): Promise<void> {
  return apiFetch<void>(`/employees/${id}`, { method: "DELETE" });
}
