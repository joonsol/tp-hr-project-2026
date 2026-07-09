"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { bulkUpsertAttendance, searchAttendance, upsertAttendance } from "@/lib/api/attendance";
import { listDepartments } from "@/lib/api/departments";
import { Department } from "@/lib/types/department";
import {
  ATTENDANCE_STATUSES,
  AttendanceRosterEntry,
  AttendanceSearchResponse,
  attendanceStatusLabel,
} from "@/lib/types/attendance";
import { Button, Card, Input, Select } from "@/components/ui";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function toTimeInput(iso: string | null): string {
  if (!iso) return "";
  return iso.slice(11, 16);
}

function timeToIso(workDate: string, time: string): string | null {
  if (!time) return null;
  return `${workDate}T${time}:00`;
}

export default function AttendancePage() {
  const [workDate, setWorkDate] = useState(todayStr());
  const [departmentId, setDepartmentId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [data, setData] = useState<AttendanceSearchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [memo, setMemo] = useState("");
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listDepartments().then(setDepartments);
  }, []);

  function load() {
    searchAttendance({
      workDate,
      departmentId: departmentId ? Number(departmentId) : undefined,
      keyword: keyword || undefined,
    })
      .then((res) => {
        setData(res);
        setCheckedIds(new Set());
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [workDate, departmentId, keyword]);

  const selectedEmployee = useMemo(
    () => data?.content.find((e) => e.employeeId === selectedEmployeeId) ?? null,
    [data, selectedEmployeeId]
  );

  function selectRow(entry: AttendanceRosterEntry) {
    setSelectedEmployeeId(entry.employeeId);
    setSelectedStatus(entry.attendanceStatusCode ?? "");
    setCheckInTime(toTimeInput(entry.checkInTime));
    setMemo(entry.memo ?? "");
  }

  function resetForm() {
    setSelectedEmployeeId(null);
    setSelectedStatus("");
    setCheckInTime("");
    setMemo("");
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!selectedEmployeeId) return;
    setSaving(true);
    try {
      await upsertAttendance({
        employeeId: selectedEmployeeId,
        workDate,
        attendanceStatusCode: selectedStatus || null,
        checkInTime: timeToIso(workDate, checkInTime),
        checkOutTime: null,
        memo: memo || null,
      });
      resetForm();
      load();
    } finally {
      setSaving(false);
    }
  }

  function toggleChecked(employeeId: number) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) next.delete(employeeId);
      else next.add(employeeId);
      return next;
    });
  }

  function toggleCheckAll() {
    if (!data) return;
    setCheckedIds((prev) =>
      prev.size === data.content.length ? new Set() : new Set(data.content.map((e) => e.employeeId))
    );
  }

  async function handleBulkRegister() {
    if (checkedIds.size === 0 || !selectedStatus) {
      alert("근태 유형을 선택하고, 목록에서 대상을 체크하세요.");
      return;
    }
    await bulkUpsertAttendance({
      workDate,
      employeeIds: Array.from(checkedIds),
      attendanceStatusCode: selectedStatus,
    });
    setCheckedIds(new Set());
    load();
  }

  const counts = data?.counts;

  return (
    <div>
      <div className="mb-4 text-sm text-slate-500">근태관리 &gt; 근태관리 &gt; 일일근태등록</div>
      <h1 className="text-xl font-semibold text-slate-900">일일근태등록</h1>
      <p className="mb-4 mt-1 text-sm text-slate-500">날짜별 직원 근태 현황을 등록하고 수정합니다.</p>

      <Card className="mb-6 flex flex-wrap items-center gap-3 p-3">
        <div className="flex items-center gap-1">
          <Button variant="secondary" onClick={() => setWorkDate((d) => shiftDate(d, -1))}>
            ◀
          </Button>
          <Input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} className="w-40" />
          <Button variant="secondary" onClick={() => setWorkDate((d) => shiftDate(d, 1))}>
            ▶
          </Button>
        </div>
        <Button variant="secondary" onClick={() => setWorkDate(todayStr())}>
          오늘
        </Button>
        <Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="w-40">
          <option value="">전체 부서</option>
          {departments.map((d) => (
            <option key={d.departmentId} value={d.departmentId}>
              {d.departmentName}
            </option>
          ))}
        </Select>
        <Input
          placeholder="사원명 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-40"
        />
        <div className="ml-auto flex flex-wrap items-center gap-3 text-sm">
          <CountPill color="bg-slate-500" label="전체" count={counts?.total ?? 0} />
          <CountPill color="bg-blue-500" label="출근" count={counts?.checkIn ?? 0} />
          <CountPill color="bg-amber-500" label="지각" count={counts?.late ?? 0} />
          <CountPill color="bg-red-500" label="결근" count={counts?.absent ?? 0} />
          <CountPill color="bg-green-500" label="연차" count={counts?.annualLeave ?? 0} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">근태 등록</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{workDate}</span>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">사원 선택 *</label>
              <div className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">
                {selectedEmployee
                  ? `${selectedEmployee.name} · ${selectedEmployee.departmentName ?? "-"}`
                  : "목록에서 사원을 선택하세요"}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">근태 유형 *</label>
              <div className="grid grid-cols-3 gap-2">
                {ATTENDANCE_STATUSES.map((s) => (
                  <button
                    type="button"
                    key={s.code}
                    onClick={() => setSelectedStatus(s.code)}
                    className={`rounded-md border px-2 py-1.5 text-sm ${
                      selectedStatus === s.code
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">출근 시간</label>
              <Input type="time" value={checkInTime} onChange={(e) => setCheckInTime(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">비고</label>
              <textarea
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                rows={3}
                placeholder="특이사항을 입력하세요"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={resetForm}>
                초기화
              </Button>
              <Button type="submit" disabled={!selectedEmployeeId || saving}>
                {saving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">{workDate} 근태 목록</span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                총 {data?.content.length ?? 0}명
              </span>
              <Button variant="secondary" onClick={handleBulkRegister}>
                일괄등록
              </Button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={!!data && checkedIds.size === data.content.length && data.content.length > 0}
                    onChange={toggleCheckAll}
                  />
                </th>
                <th className="px-3 py-2">사원번호</th>
                <th className="px-3 py-2">성명</th>
                <th className="px-3 py-2">부서</th>
                <th className="px-3 py-2">직급</th>
                <th className="px-3 py-2">근태유형</th>
                <th className="px-3 py-2">출근시간</th>
                <th className="px-3 py-2">퇴근시간</th>
                <th className="px-3 py-2">비고</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-3 py-4 text-slate-400" colSpan={9}>
                    불러오는 중...
                  </td>
                </tr>
              )}
              {!loading && data?.content.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-slate-400" colSpan={9}>
                    대상 사원이 없습니다.
                  </td>
                </tr>
              )}
              {data?.content.map((entry) => (
                <tr
                  key={entry.employeeId}
                  onClick={() => selectRow(entry)}
                  className={`cursor-pointer border-b border-slate-100 hover:bg-slate-50 ${
                    selectedEmployeeId === entry.employeeId ? "bg-slate-50" : ""
                  }`}
                >
                  <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={checkedIds.has(entry.employeeId)}
                      onChange={() => {
                        toggleChecked(entry.employeeId);
                        selectRow(entry);
                      }}
                    />
                  </td>
                  <td className="px-3 py-2">{entry.employeeNo}</td>
                  <td className="px-3 py-2 font-medium">{entry.name}</td>
                  <td className="px-3 py-2">{entry.departmentName ?? "-"}</td>
                  <td className="px-3 py-2">{entry.positionName ?? "-"}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        entry.attendanceStatusCode ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {attendanceStatusLabel(entry.attendanceStatusCode)}
                    </span>
                  </td>
                  <td className="px-3 py-2">{toTimeInput(entry.checkInTime) || "-"}</td>
                  <td className="px-3 py-2">{toTimeInput(entry.checkOutTime) || "-"}</td>
                  <td className="px-3 py-2">{entry.memo ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function CountPill({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <span className="flex items-center gap-1.5 text-slate-600">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label} {count}명
    </span>
  );
}
