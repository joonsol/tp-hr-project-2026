"use client";

import { useEffect, useState } from "react";
import { getPayrollSummary } from "@/lib/api/payroll";
import { listDepartments } from "@/lib/api/departments";
import { listPositions } from "@/lib/api/positions";
import { Department } from "@/lib/types/department";
import { Position } from "@/lib/types/position";
import { PayrollRow, PayrollSummary } from "@/lib/types/payroll";
import { Button, Card, Input, Select } from "@/components/ui";
import { PayrollRegisterModal, PayrollRegisterInitial } from "@/components/payroll/PayrollRegisterModal";
import { PayrollHistoryModal } from "@/components/payroll/PayrollHistoryModal";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function won(n: number): string {
  return n.toLocaleString("ko-KR");
}

export default function PayrollPage() {
  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [asOfDate, setAsOfDate] = useState(todayStr());
  const [keyword, setKeyword] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [data, setData] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const [showRegister, setShowRegister] = useState(false);
  const [editRow, setEditRow] = useState<PayrollRow | null>(null);
  const [historyEmployee, setHistoryEmployee] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    listDepartments().then(setDepartments);
    listPositions().then(setPositions);
  }, []);

  function load() {
    setLoading(true);
    getPayrollSummary({
      departmentId: departmentId ? Number(departmentId) : undefined,
      positionId: positionId ? Number(positionId) : undefined,
      keyword: keyword || undefined,
      asOfDate,
    })
      .then(setData)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentId, positionId, asOfDate, keyword]);

  function resetFilters() {
    setDepartmentId("");
    setPositionId("");
    setAsOfDate(todayStr());
    setKeyword("");
  }

  function editInitial(row: PayrollRow): PayrollRegisterInitial {
    return {
      employeeId: row.employeeId,
      baseSalary: row.baseSalary,
      positionAllowance: row.positionAllowance,
      mealAllowance: row.mealAllowance,
      transportAllowance: row.transportAllowance,
      paymentMethodCode: "BANK_TRANSFER",
      paymentDay: 10,
    };
  }

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-4 text-sm text-slate-500">급여관리 &gt; 급여기본정보관리</div>
          <h1 className="text-xl font-semibold text-slate-900">급여기본정보관리</h1>
          <p className="mt-1 text-sm text-slate-500">직원별 기본급여 및 수당 기준 정보를 등록하고 관리합니다.</p>
        </div>
        <Button onClick={() => setShowRegister(true)}>+ 급여정보등록</Button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg bg-slate-900 p-4 text-white">
          <div className="text-xs text-slate-300">평균 기본급</div>
          <div className="mt-1 text-xl font-semibold">{won(data?.averageBaseSalary ?? 0)}원</div>
        </div>
        <Card className="p-4">
          <div className="text-xs text-slate-500">최고 기본급</div>
          <div className="mt-1 text-xl font-semibold text-slate-900">{won(data?.maxBaseSalary ?? 0)}원</div>
          {data?.maxBaseSalaryEmployeeName && (
            <span className="mt-1 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
              {data.maxBaseSalaryEmployeeName} · {data.maxBaseSalaryPositionName ?? "-"}
            </span>
          )}
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">월 총 인건비</div>
          <div className="mt-1 text-xl font-semibold text-blue-600">{won(data?.totalLaborCost ?? 0)}원</div>
          <div className="mt-1 text-xs text-slate-400">기본급 합계 기준</div>
        </Card>
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
          <div className="text-xs text-amber-700">월 총 수당</div>
          <div className="mt-1 text-xl font-semibold text-amber-600">{won(data?.totalAllowance ?? 0)}원</div>
          <div className="mt-1 text-xs text-amber-500">수당 합계 기준</div>
        </div>
        <div className="rounded-lg border border-green-100 bg-green-50 p-4">
          <div className="text-xs text-green-700">등록 인원</div>
          <div className="mt-1 text-xl font-semibold text-green-600">{data?.registeredCount ?? 0}명</div>
          <div className="mt-1 text-xs text-green-500">미등록 {data?.unregisteredCount ?? 0}명</div>
        </div>
      </div>

      <Card className="mb-6 flex flex-wrap items-center gap-3 p-3">
        <Select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="w-36">
          <option value="">전체 부서</option>
          {departments.map((d) => (
            <option key={d.departmentId} value={d.departmentId}>
              {d.departmentName}
            </option>
          ))}
        </Select>
        <Select value={positionId} onChange={(e) => setPositionId(e.target.value)} className="w-32">
          <option value="">전체 직급</option>
          {positions.map((p) => (
            <option key={p.positionId} value={p.positionId}>
              {p.positionName}
            </option>
          ))}
        </Select>
        <Input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} className="w-40" />
        <Input
          placeholder="사원명 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-40"
        />
        <Button onClick={load}>조회</Button>
        <Button variant="secondary" onClick={resetFilters}>
          초기화
        </Button>
      </Card>

      <Card>
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="text-sm font-semibold text-slate-700">직원별 급여 기본정보</span>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            총 {data?.rows.length ?? 0}명
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-3 py-2">사원번호</th>
                <th className="px-3 py-2">성명</th>
                <th className="px-3 py-2">부서</th>
                <th className="px-3 py-2">직급</th>
                <th className="px-3 py-2 text-blue-600">기본급</th>
                <th className="px-3 py-2">식대</th>
                <th className="px-3 py-2">교통비</th>
                <th className="px-3 py-2">직급수당</th>
                <th className="px-3 py-2 text-amber-600">수당합계</th>
                <th className="px-3 py-2">은행</th>
                <th className="px-3 py-2">계좌번호</th>
                <th className="px-3 py-2">적용시작일</th>
                <th className="px-3 py-2">관리</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-3 py-4 text-slate-400" colSpan={13}>
                    불러오는 중...
                  </td>
                </tr>
              )}
              {!loading && data?.rows.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-slate-400" colSpan={13}>
                    등록된 급여 정보가 없습니다.
                  </td>
                </tr>
              )}
              {data?.rows.map((row) => (
                <tr key={row.employeeId} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2">{row.employeeNo}</td>
                  <td className="px-3 py-2 font-medium">{row.name}</td>
                  <td className="px-3 py-2">{row.departmentName ?? "-"}</td>
                  <td className="px-3 py-2">{row.positionName ?? "-"}</td>
                  <td className="px-3 py-2 font-medium text-slate-900">{won(row.baseSalary)}</td>
                  <td className="px-3 py-2">{won(row.mealAllowance)}</td>
                  <td className="px-3 py-2">{won(row.transportAllowance)}</td>
                  <td className="px-3 py-2">{won(row.positionAllowance)}</td>
                  <td className="px-3 py-2 font-medium text-amber-600">{won(row.allowanceTotal)}</td>
                  <td className="px-3 py-2">{row.bankName ?? "-"}</td>
                  <td className="px-3 py-2">{row.accountNumber ?? "-"}</td>
                  <td className="px-3 py-2">{row.effectiveDate}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setEditRow(row)}>
                        ✏ 수정
                      </Button>
                      <Button
                        variant="secondary"
                        className="px-2 py-1 text-xs"
                        onClick={() => setHistoryEmployee({ id: row.employeeId, name: row.name })}
                      >
                        🕐 이력
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {data && data.rows.length > 0 && (
                <tr className="bg-slate-50 font-semibold text-slate-700">
                  <td className="px-3 py-2" colSpan={4}>
                    Σ 합계 ({data.rows.length}명)
                  </td>
                  <td className="px-3 py-2">{won(data.rows.reduce((s, r) => s + r.baseSalary, 0))}</td>
                  <td className="px-3 py-2">{won(data.rows.reduce((s, r) => s + r.mealAllowance, 0))}</td>
                  <td className="px-3 py-2">{won(data.rows.reduce((s, r) => s + r.transportAllowance, 0))}</td>
                  <td className="px-3 py-2">{won(data.rows.reduce((s, r) => s + r.positionAllowance, 0))}</td>
                  <td className="px-3 py-2">{won(data.rows.reduce((s, r) => s + r.allowanceTotal, 0))}</td>
                  <td className="px-3 py-2" colSpan={3}>
                    -
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-slate-400">총 {data?.rows.length ?? 0}명 조회</div>
      </Card>

      {showRegister && (
        <PayrollRegisterModal onClose={() => setShowRegister(false)} onRegistered={load} />
      )}
      {editRow && (
        <PayrollRegisterModal
          onClose={() => setEditRow(null)}
          onRegistered={load}
          initial={editInitial(editRow)}
        />
      )}
      {historyEmployee && (
        <PayrollHistoryModal
          employeeId={historyEmployee.id}
          employeeName={historyEmployee.name}
          onClose={() => setHistoryEmployee(null)}
        />
      )}
    </div>
  );
}
