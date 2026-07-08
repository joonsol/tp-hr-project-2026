"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { deleteAppointment, searchAppointments } from "@/lib/api/appointments";
import { Appointment } from "@/lib/types/appointment";
import { Page } from "@/lib/types/employee";
import { Button, Card, Input, Select } from "@/components/ui";

const PAGE_SIZE = 10;

const TYPE_BADGE: Record<string, string> = {
  승진: "bg-green-100 text-green-700",
  전보: "bg-amber-100 text-amber-700",
  겸직: "bg-purple-100 text-purple-700",
};

interface Filters {
  keyword: string;
  appointmentType: string;
  fromDate: string;
  toDate: string;
}

const EMPTY_FILTERS: Filters = { keyword: "", appointmentType: "", fromDate: "", toDate: "" };

export default function AppointmentsPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Page<Appointment> | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    searchAppointments({
      keyword: appliedFilters.keyword || undefined,
      appointmentType: appliedFilters.appointmentType || undefined,
      fromDate: appliedFilters.fromDate || undefined,
      toDate: appliedFilters.toDate || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then(setData)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [appliedFilters, page]);

  async function handleDelete(id: number) {
    if (!confirm("이 발령 이력을 삭제하시겠습니까?")) return;
    await deleteAppointment(id);
    load();
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    setPage(0);
    setAppliedFilters(filters);
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(0);
  }

  const totalPages = data?.totalPages ?? 0;

  return (
    <div>
      <div className="mb-4 text-sm text-slate-500">인사관리 &gt; 인사정보 &gt; 인사발령등록</div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">인사발령등록</h1>
          <p className="mt-1 text-sm text-slate-500">직원의 인사발령 이력을 등록하고 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            PDF 다운로드
          </Button>
          <Link href="/appointments/new">
            <Button>발령등록</Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6 p-4">
        <div className="mb-3 text-sm font-medium text-slate-600">검색조건</div>
        <form onSubmit={handleSearch} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">사원검색</label>
            <Input
              placeholder="사원번호 또는 성명"
              value={filters.keyword}
              onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">발령유형</label>
            <Select
              value={filters.appointmentType}
              onChange={(e) => setFilters((f) => ({ ...f, appointmentType: e.target.value }))}
            >
              <option value="">전체</option>
              <option value="승진">승진</option>
              <option value="전보">전보</option>
              <option value="겸직">겸직</option>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">발령일 (시작)</label>
            <Input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">발령일 (종료)</label>
            <Input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
            />
          </div>
          <div className="col-span-2 flex items-end gap-2 sm:col-span-4 sm:justify-end">
            <Button type="submit">조회</Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              초기화
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="text-sm font-medium text-slate-700">발령 이력</span>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            총 {data?.totalElements ?? 0}건
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">NO</th>
              <th className="px-4 py-2">발령번호</th>
              <th className="px-4 py-2">사원번호</th>
              <th className="px-4 py-2">성명</th>
              <th className="px-4 py-2">발령유형</th>
              <th className="px-4 py-2">전부서/직급</th>
              <th className="px-4 py-2">후부서/직급</th>
              <th className="px-4 py-2">발령일</th>
              <th className="px-4 py-2">등록자</th>
              <th className="px-4 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={10}>
                  불러오는 중...
                </td>
              </tr>
            )}
            {!loading && data?.content.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-400" colSpan={10}>
                  조건에 맞는 발령 이력이 없습니다.
                </td>
              </tr>
            )}
            {data?.content.map((a, index) => (
              <tr key={a.employeeAppointmentId} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-500">{page * PAGE_SIZE + index + 1}</td>
                <td className="px-4 py-2">{a.appointmentNo}</td>
                <td className="px-4 py-2">{a.employeeNo}</td>
                <td className="px-4 py-2 font-medium">{a.employeeName}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      TYPE_BADGE[a.appointmentType ?? ""] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {a.appointmentType ?? "-"}
                  </span>
                </td>
                <td className="px-4 py-2 leading-tight">
                  {a.fromDepartmentName ?? "-"}
                  <br />
                  <span className="text-slate-500">{a.fromPositionName ?? "-"}</span>
                </td>
                <td className="px-4 py-2 leading-tight">
                  {a.toDepartmentName ?? "-"}
                  <br />
                  <span className="text-slate-500">{a.toPositionName ?? "-"}</span>
                </td>
                <td className="px-4 py-2">{a.appointmentDate ?? "-"}</td>
                <td className="px-4 py-2">{a.registeredBy ?? "-"}</td>
                <td className="px-4 py-2 space-x-1">
                  <Link href={`/appointments/${a.employeeAppointmentId}/edit`}>
                    <Button variant="secondary">수정</Button>
                  </Link>
                  <Button variant="danger" onClick={() => handleDelete(a.employeeAppointmentId)}>
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-slate-500">총 {data?.totalElements ?? 0}건</span>
        {totalPages > 1 && (
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-md text-sm font-medium ${
                  p === page ? "bg-slate-900 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {p + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
