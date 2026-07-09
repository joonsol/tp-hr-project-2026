import { apiFetch, toQueryString } from "@/lib/api/client";
import {
  AttendanceBulkRequest,
  AttendanceSearchResponse,
  AttendanceUpsertRequest,
  MonthlyAttendanceResponse,
} from "@/lib/types/attendance";

export interface AttendanceSearchParams {
  workDate: string;
  departmentId?: number;
  keyword?: string;
  page?: number;
  size?: number;
}

export function searchAttendance(params: AttendanceSearchParams): Promise<AttendanceSearchResponse> {
  const qs = toQueryString({
    workDate: params.workDate,
    departmentId: params.departmentId,
    keyword: params.keyword,
    page: params.page ?? 0,
    size: params.size ?? 50,
  });
  return apiFetch<AttendanceSearchResponse>(`/attendance${qs}`);
}

export function upsertAttendance(request: AttendanceUpsertRequest) {
  return apiFetch(`/attendance`, { method: "POST", body: JSON.stringify(request) });
}

export function bulkUpsertAttendance(request: AttendanceBulkRequest) {
  return apiFetch<void>(`/attendance/bulk`, { method: "POST", body: JSON.stringify(request) });
}

export interface MonthlyAttendanceParams {
  year: number;
  month: number;
  departmentId?: number;
}

export function getMonthlyAttendance(params: MonthlyAttendanceParams): Promise<MonthlyAttendanceResponse> {
  const qs = toQueryString({
    year: params.year,
    month: params.month,
    departmentId: params.departmentId,
  });
  return apiFetch<MonthlyAttendanceResponse>(`/attendance/monthly${qs}`);
}
