import { apiFetch } from "@/lib/api/client";
import { Department, DepartmentRequest, DepartmentTreeNode } from "@/lib/types/department";

export function listDepartments(): Promise<Department[]> {
  return apiFetch<Department[]>("/departments");
}

export function getDepartmentTree(): Promise<DepartmentTreeNode[]> {
  return apiFetch<DepartmentTreeNode[]>("/departments/tree");
}

export function getDepartment(id: number): Promise<Department> {
  return apiFetch<Department>(`/departments/${id}`);
}

export function createDepartment(request: DepartmentRequest): Promise<Department> {
  return apiFetch<Department>("/departments", { method: "POST", body: JSON.stringify(request) });
}

export function updateDepartment(id: number, request: DepartmentRequest): Promise<Department> {
  return apiFetch<Department>(`/departments/${id}`, { method: "PUT", body: JSON.stringify(request) });
}

export function deleteDepartment(id: number): Promise<void> {
  return apiFetch<void>(`/departments/${id}`, { method: "DELETE" });
}
