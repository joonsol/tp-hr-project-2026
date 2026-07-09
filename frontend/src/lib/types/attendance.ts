export interface AttendanceRosterEntry {
  employeeId: number;
  employeeNo: string;
  name: string;
  departmentName: string | null;
  positionName: string | null;
  attendanceId: number | null;
  attendanceStatusCode: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  memo: string | null;
}

export interface AttendanceCounts {
  total: number;
  checkIn: number;
  late: number;
  absent: number;
  annualLeave: number;
}

export interface AttendanceSearchResponse {
  content: AttendanceRosterEntry[];
  counts: AttendanceCounts;
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface AttendanceUpsertRequest {
  employeeId: number;
  workDate: string;
  attendanceStatusCode: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  memo: string | null;
}

export interface AttendanceBulkRequest {
  workDate: string;
  employeeIds: number[];
  attendanceStatusCode: string;
}

export const ATTENDANCE_STATUSES: { code: string; label: string }[] = [
  { code: "CHECK_IN", label: "출근" },
  { code: "LATE", label: "지각" },
  { code: "EARLY_LEAVE", label: "조퇴" },
  { code: "ABSENT", label: "결근" },
  { code: "ANNUAL_LEAVE", label: "연차" },
  { code: "HALF_DAY", label: "반차" },
  { code: "CHECK_OUT", label: "퇴근" },
  { code: "TRAINING", label: "교육" },
  { code: "OFFICIAL_LEAVE", label: "공가" },
];

export function attendanceStatusLabel(code: string | null): string {
  if (!code) return "미등록";
  return ATTENDANCE_STATUSES.find((s) => s.code === code)?.label ?? code;
}

export interface MonthlyAttendanceRow {
  employeeId: number;
  employeeNo: string;
  name: string;
  departmentName: string | null;
  days: Record<string, string>;
  checkIn: number;
  late: number;
  annualLeave: number;
  absent: number;
}

export interface MonthlyAttendanceResponse {
  year: number;
  month: number;
  totalWorkDays: number;
  targetHeadcount: number;
  rows: MonthlyAttendanceRow[];
}
