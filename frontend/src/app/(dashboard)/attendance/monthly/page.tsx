"use client";

import { useEffect, useMemo, useState } from "react";
import { getMonthlyAttendance } from "@/lib/api/attendance";
import { listDepartments } from "@/lib/api/departments";
import { Department } from "@/lib/types/department";
import { MonthlyAttendanceResponse, attendanceStatusLabel } from "@/lib/types/attendance";
import { Button, Card, Select } from "@/components/ui";

function currentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function isWeekend(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month - 1, day).getDay();
  return dow === 0 || dow === 6;
}

const LEGEND: { color: string; label: string }[] = [
  { color: "bg-slate-400", label: "출근" },
  { color: "bg-amber-500", label: "지각" },
  { color: "bg-green-500", label: "연차" },
  { color: "bg-sky-500", label: "반차" },
  { color: "bg-red-500", label: "결근" },
  { color: "bg-slate-200", label: "휴일" },
];

export default function MonthlyAttendancePage() {
  const [{ year, month }, setYearMonth] = useState(currentYearMonth());
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [data, setData] = useState<MonthlyAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listDepartments().then(setDepartments);
  }, []);

  function load() {
    setLoading(true);
    getMonthlyAttendance({ year, month, departmentId: departmentId ? Number(departmentId) : undefined })
      .then(setData)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, departmentId]);

  function shiftMonth(delta: number) {
    setYearMonth((prev) => {
      const total = prev.year * 12 + (prev.month - 1) + delta;
      return { year: Math.floor(total / 12), month: (total % 12) + 1 };
    });
  }

  const days = useMemo(() => Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1), [year, month]);

  return (
    <div>
      <div className="mb-4 text-sm text-slate-500">근태관리 &gt; 근태관리 &gt; 월근태현황</div>
      <h1 className="text-xl font-semibold text-slate-900">월근태현황</h1>
      <p className="mb-4 mt-1 text-sm text-slate-500">부서별·직원별 월간 근태 현황을 조회하고 관리합니다.</p>

      <Card className="mb-6 flex flex-wrap items-center gap-3 p-3">
        <div className="flex items-center gap-1">
          <Button variant="secondary" onClick={() => shiftMonth(-1)}>
            ◀
          </Button>
          <span className="w-32 text-center text-sm font-medium text-slate-700">
            {year}년 {String(month).padStart(2, "0")}월
          </span>
          <Button variant="secondary" onClick={() => shiftMonth(1)}>
            ▶
          </Button>
        </div>
        <Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="w-40">
          <option value="">전체 부서</option>
          {departments.map((d) => (
            <option key={d.departmentId} value={d.departmentId}>
              {d.departmentName}
            </option>
          ))}
        </Select>
        <Button onClick={load}>조회</Button>

        <div className="ml-auto flex flex-wrap items-center gap-3 text-sm">
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-slate-600">
              <span className={`h-2 w-2 rounded-full ${l.color}`} />
              {l.label}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="text-sm font-semibold text-slate-700">
            {year}년 {month}월 근태현황
          </span>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              총 근무일 {data?.totalWorkDays ?? 0}일
            </span>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              대상 인원 {data?.targetHeadcount ?? 0}명
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="sticky left-0 z-10 whitespace-nowrap bg-slate-50 px-3 py-2">성명</th>
                <th className="whitespace-nowrap px-3 py-2">부서</th>
                {days.map((d) => (
                  <th
                    key={d}
                    className={`whitespace-nowrap px-2 py-2 text-center ${
                      isWeekend(year, month, d) ? "bg-slate-100" : ""
                    }`}
                  >
                    {d}
                  </th>
                ))}
                <th className="whitespace-nowrap px-2 py-2 text-center">출근</th>
                <th className="whitespace-nowrap px-2 py-2 text-center">지각</th>
                <th className="whitespace-nowrap px-2 py-2 text-center">연차</th>
                <th className="whitespace-nowrap px-2 py-2 text-center">결근</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-3 py-4 text-slate-400" colSpan={days.length + 6}>
                    불러오는 중...
                  </td>
                </tr>
              )}
              {!loading && data?.rows.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-slate-400" colSpan={days.length + 6}>
                    대상 사원이 없습니다.
                  </td>
                </tr>
              )}
              {data?.rows.map((row) => (
                <tr key={row.employeeId} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="sticky left-0 z-10 whitespace-nowrap bg-white px-3 py-2 font-medium">
                    {row.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">{row.departmentName ?? "-"}</td>
                  {days.map((d) => {
                    const code = row.days[String(d)];
                    return (
                      <td
                        key={d}
                        className={`px-2 py-2 text-center text-xs text-slate-600 ${
                          isWeekend(year, month, d) ? "bg-slate-50" : ""
                        }`}
                      >
                        {code ? attendanceStatusLabel(code) : "-"}
                      </td>
                    );
                  })}
                  <td className="px-2 py-2 text-center">{row.checkIn}</td>
                  <td className="px-2 py-2 text-center">{row.late}</td>
                  <td className="px-2 py-2 text-center">{row.annualLeave}</td>
                  <td className="px-2 py-2 text-center text-red-600">{row.absent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
