"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { searchEmployees } from "@/lib/api/employees";
import { listDepartments } from "@/lib/api/departments";
import { listPositions } from "@/lib/api/positions";
import { Department } from "@/lib/types/department";
import { Position } from "@/lib/types/position";
import { Employee, Page } from "@/lib/types/employee";
import { Button, Card, Input, Select } from "@/components/ui";

const PAGE_SIZE = 10;

interface Filters {
  employeeNo: string;
  departmentId: string;
  positionId: string;
  status: string;
}

const EMPTY_FILTERS: Filters = { employeeNo: "", departmentId: "", positionId: "", status: "" };

export default function EmployeesPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Page<Employee> | null>(null);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    listDepartments().then(setDepartments);
    listPositions().then(setPositions);
  }, []);

  useEffect(() => {
    searchEmployees({
      keyword: appliedFilters.employeeNo || undefined,
      departmentId: appliedFilters.departmentId ? Number(appliedFilters.departmentId) : undefined,
      positionId: appliedFilters.positionId ? Number(appliedFilters.positionId) : undefined,
      status: appliedFilters.status || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then(setData)
      .finally(() => setLoading(false));
  }, [appliedFilters, page]);

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
      <div className="mb-4 text-sm text-slate-500">인사관리 &gt; 인사정보 &gt; 인사정보등록</div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">인사정보등록</h1>
          <p className="mt-1 text-sm text-slate-500">직원의 인사정보를 등록하고 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            PDF 다운로드
          </Button>
          <Link href="/employees/new">
            <Button>신규등록</Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6 p-4">
        <form onSubmit={handleSearch} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">사원번호</label>
            <Input
              value={filters.employeeNo}
              onChange={(e) => setFilters((f) => ({ ...f, employeeNo: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">부서</label>
            <Select
              value={filters.departmentId}
              onChange={(e) => setFilters((f) => ({ ...f, departmentId: e.target.value }))}
            >
              <option value="">전체</option>
              {departments.map((d) => (
                <option key={d.departmentId} value={d.departmentId}>
                  {d.departmentName}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">직급</label>
            <Select
              value={filters.positionId}
              onChange={(e) => setFilters((f) => ({ ...f, positionId: e.target.value }))}
            >
              <option value="">전체</option>
              {positions.map((p) => (
                <option key={p.positionId} value={p.positionId}>
                  {p.positionName}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">재직상태</label>
            <Select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="">전체</option>
              <option value="ACTIVE">재직</option>
              <option value="RESIGNED">퇴사</option>
            </Select>
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
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2">NO</th>
              <th className="px-4 py-2">사원번호</th>
              <th className="px-4 py-2">성명</th>
              <th className="px-4 py-2">부서</th>
              <th className="px-4 py-2">직급</th>
              <th className="px-4 py-2">입사일</th>
              <th className="px-4 py-2">연락처</th>
              <th className="px-4 py-2">이메일</th>
              <th className="px-4 py-2">재직상태</th>
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
                  조건에 맞는 사원이 없습니다.
                </td>
              </tr>
            )}
            {data?.content.map((employee, index) => (
              <tr key={employee.employeeId} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-500">{page * PAGE_SIZE + index + 1}</td>
                <td className="px-4 py-2">{employee.employeeNo}</td>
                <td className="px-4 py-2">{employee.name}</td>
                <td className="px-4 py-2">{employee.departmentName ?? "-"}</td>
                <td className="px-4 py-2">{employee.positionName ?? "-"}</td>
                <td className="px-4 py-2">{employee.hireDate ?? "-"}</td>
                <td className="px-4 py-2">{employee.phone ?? "-"}</td>
                <td className="px-4 py-2">{employee.email ?? "-"}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      employee.employeeStatusCode === "RESIGNED"
                        ? "bg-slate-200 text-slate-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {employee.employeeStatusCode === "RESIGNED" ? "퇴사" : "재직"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Link href={`/employees/${employee.employeeId}/edit`}>
                    <Button variant="secondary">수정</Button>
                  </Link>
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
