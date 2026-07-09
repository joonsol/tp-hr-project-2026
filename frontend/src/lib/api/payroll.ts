import { apiFetch, toQueryString } from "@/lib/api/client";
import { PayrollBulkUpsertRequest, PayrollCandidate, PayrollRow, PayrollSummary } from "@/lib/types/payroll";

export interface PayrollCandidateParams {
  keyword?: string;
  status?: "ALL" | "REGISTERED" | "UNREGISTERED";
}

export function searchPayrollCandidates(params: PayrollCandidateParams): Promise<PayrollCandidate[]> {
  const qs = toQueryString({ keyword: params.keyword, status: params.status });
  return apiFetch<PayrollCandidate[]>(`/payroll/base-info/candidates${qs}`);
}

export interface PayrollListParams {
  departmentId?: number;
  positionId?: number;
  keyword?: string;
  asOfDate?: string;
}

export function getPayrollSummary(params: PayrollListParams): Promise<PayrollSummary> {
  const qs = toQueryString({
    departmentId: params.departmentId,
    positionId: params.positionId,
    keyword: params.keyword,
    asOfDate: params.asOfDate,
  });
  return apiFetch<PayrollSummary>(`/payroll/base-info${qs}`);
}

export function registerPayrollBaseInfo(request: PayrollBulkUpsertRequest): Promise<void> {
  return apiFetch<void>(`/payroll/base-info`, { method: "POST", body: JSON.stringify(request) });
}

export function getPayrollHistory(employeeId: number): Promise<PayrollRow[]> {
  return apiFetch<PayrollRow[]>(`/payroll/base-info/${employeeId}/history`);
}
