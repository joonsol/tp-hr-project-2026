import { apiFetch } from "@/lib/api/client";
import { Employee, EmployeeSummary } from "@/lib/types/employee";

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  employee: EmployeeSummary;
}

export function login(request: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(request),
    skipAuth: true,
  });
}

export function getMe(): Promise<Employee> {
  return apiFetch<Employee>("/auth/me");
}
