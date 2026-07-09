"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { Button, Input, Select } from "@/components/ui";
import { registerPayrollBaseInfo, searchPayrollCandidates } from "@/lib/api/payroll";
import { PAYMENT_METHODS, PayrollCandidate } from "@/lib/types/payroll";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcPension(base: number): number {
  return Math.round(base * 0.046);
}

function calcHealth(base: number): number {
  return Math.round(base * 0.03545);
}

function calcEmployment(base: number): number {
  return Math.round(base * 0.009);
}

function calcIncomeTax(taxableBase: number): number {
  if (taxableBase <= 1_060_000) return 0;
  if (taxableBase <= 1_500_000) return Math.round((taxableBase - 1_060_000) * 0.02);
  if (taxableBase <= 3_000_000) return Math.round(8_800 + (taxableBase - 1_500_000) * 0.04);
  if (taxableBase <= 5_000_000) return Math.round(68_800 + (taxableBase - 3_000_000) * 0.08);
  if (taxableBase <= 10_000_000) return Math.round(228_800 + (taxableBase - 5_000_000) * 0.15);
  return Math.round(978_800 + (taxableBase - 10_000_000) * 0.24);
}

function won(n: number): string {
  return n.toLocaleString("ko-KR");
}

const PAYMENT_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export interface PayrollRegisterInitial {
  employeeId: number;
  baseSalary: number;
  positionAllowance: number;
  mealAllowance: number;
  transportAllowance: number;
  paymentMethodCode: string;
  paymentDay: number;
}

export function PayrollRegisterModal({
  onClose,
  onRegistered,
  initial,
}: {
  onClose: () => void;
  onRegistered: () => void;
  initial?: PayrollRegisterInitial;
}) {
  const [status, setStatus] = useState<"ALL" | "UNREGISTERED" | "REGISTERED">("ALL");
  const [keyword, setKeyword] = useState("");
  const [candidates, setCandidates] = useState<PayrollCandidate[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    initial ? new Set([initial.employeeId]) : new Set()
  );

  const [baseSalary, setBaseSalary] = useState(initial ? String(initial.baseSalary) : "");
  const [positionAllowance, setPositionAllowance] = useState(initial ? String(initial.positionAllowance) : "");
  const [mealAllowance, setMealAllowance] = useState(initial ? String(initial.mealAllowance) : "");
  const [transportAllowance, setTransportAllowance] = useState(initial ? String(initial.transportAllowance) : "");
  const [paymentMethodCode, setPaymentMethodCode] = useState(initial?.paymentMethodCode ?? "BANK_TRANSFER");
  const [paymentDay, setPaymentDay] = useState(initial?.paymentDay ?? 10);
  const [saving, setSaving] = useState(false);

  function load() {
    searchPayrollCandidates({ keyword: keyword || undefined, status }).then(setCandidates);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, keyword]);

  function toggle(employeeId: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) next.delete(employeeId);
      else next.add(employeeId);
      return next;
    });
  }

  function toggleAll() {
    setSelectedIds((prev) =>
      prev.size === candidates.length ? new Set() : new Set(candidates.map((c) => c.employeeId))
    );
  }

  const selected = useMemo(
    () => candidates.filter((c) => selectedIds.has(c.employeeId)),
    [candidates, selectedIds]
  );

  const base = Number(baseSalary) || 0;
  const posAllowance = Number(positionAllowance) || 0;
  const meal = Number(mealAllowance) || 0;
  const transport = Number(transportAllowance) || 0;

  const pension = calcPension(base);
  const health = calcHealth(base);
  const employment = calcEmployment(base);
  const incomeTax = calcIncomeTax(base + posAllowance);
  const deductionTotal = pension + health + employment + incomeTax;
  const totalPayment = base + posAllowance + meal + transport;
  const netPay = totalPayment - deductionTotal;

  function reset() {
    setBaseSalary("");
    setPositionAllowance("");
    setMealAllowance("");
    setTransportAllowance("");
    setPaymentMethodCode("BANK_TRANSFER");
    setPaymentDay(10);
  }

  async function handleSubmit() {
    if (selectedIds.size === 0 || base <= 0) {
      alert("사원을 선택하고 기본급을 입력하세요.");
      return;
    }
    setSaving(true);
    try {
      await registerPayrollBaseInfo({
        employeeIds: Array.from(selectedIds),
        baseSalary: base,
        positionAllowance: posAllowance,
        mealAllowance: meal,
        transportAllowance: transport,
        paymentMethodCode,
        paymentDay,
        effectiveDate: todayStr(),
      });
      onRegistered();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const canSubmit = selectedIds.size > 0 && base > 0;

  return (
    <Modal
      title="급여정보 등록"
      subtitle="신규입사자의 급여 정보를 입력하세요"
      onClose={onClose}
      widthClassName="max-w-3xl"
      headerExtra={
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <span className="flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 font-medium text-white">
            1 사원선택
          </span>
          <span>›</span>
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-500">
            2 급여입력
          </span>
        </div>
      }
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">신규입사자 검색</span>
        <span className="text-xs text-slate-500">검색결과 {candidates.length}명</span>
      </div>
      <div className="mb-3 flex gap-2">
        <Select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="w-28">
          <option value="ALL">전체</option>
          <option value="UNREGISTERED">미등록</option>
          <option value="REGISTERED">등록</option>
        </Select>
        <Input
          placeholder="사원명, 사번으로 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1"
        />
        <Button onClick={load}>검색</Button>
      </div>

      <div className="mb-6 max-h-48 overflow-y-auto rounded-md border border-slate-200">
        <table className="w-full text-sm">
          <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="w-10 px-3 py-2">
                <input
                  type="checkbox"
                  checked={candidates.length > 0 && selectedIds.size === candidates.length}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-2">사번</th>
              <th className="px-3 py-2">사원명 · 부서</th>
              <th className="px-3 py-2">직급</th>
              <th className="px-3 py-2">입사일</th>
              <th className="px-3 py-2">등록여부</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-slate-400" colSpan={6}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
            {candidates.map((c) => (
              <tr
                key={c.employeeId}
                onClick={() => toggle(c.employeeId)}
                className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
              >
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selectedIds.has(c.employeeId)} onChange={() => toggle(c.employeeId)} />
                </td>
                <td className="px-3 py-2">{c.employeeNo}</td>
                <td className="px-3 py-2">
                  <span className="font-medium">{c.name}</span>
                  <span className="ml-1 text-slate-400">{c.departmentName ?? "-"}</span>
                </td>
                <td className="px-3 py-2">{c.positionName ?? "-"}</td>
                <td className="px-3 py-2">{c.hireDate ?? "-"}</td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      c.registered ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {c.registered ? "등록" : "미등록"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">급여 정보 입력</span>
        {selected.length > 0 ? (
          <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
            {selected.length === 1
              ? `${selected[0].name} · ${selected[0].departmentName ?? "-"} · ${selected[0].positionName ?? "-"}`
              : `${selected.length}명 선택됨`}
          </span>
        ) : (
          <span className="text-xs text-slate-400">사원을 선택하세요</span>
        )}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">기본급*</label>
          <div className="relative">
            <Input
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              className="pr-8"
            />
            <span className="absolute right-3 top-2 text-sm text-slate-400">원</span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">직급수당*</label>
          <div className="relative">
            <Input
              type="number"
              value={positionAllowance}
              onChange={(e) => setPositionAllowance(e.target.value)}
              className="pr-8"
            />
            <span className="absolute right-3 top-2 text-sm text-slate-400">원</span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">식대</label>
          <div className="relative">
            <Input type="number" value={mealAllowance} onChange={(e) => setMealAllowance(e.target.value)} className="pr-8" />
            <span className="absolute right-3 top-2 text-sm text-slate-400">원</span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">교통비</label>
          <div className="relative">
            <Input
              type="number"
              value={transportAllowance}
              onChange={(e) => setTransportAllowance(e.target.value)}
              className="pr-8"
            />
            <span className="absolute right-3 top-2 text-sm text-slate-400">원</span>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">지급방식*</label>
          <Select value={paymentMethodCode} onChange={(e) => setPaymentMethodCode(e.target.value)}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m.code} value={m.code}>
                {m.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">급여지급일*</label>
          <Select value={paymentDay} onChange={(e) => setPaymentDay(Number(e.target.value))}>
            {PAYMENT_DAYS.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">공제 항목 (자동 계산)</span>
          <span className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
            급여 기준 자동 산정
          </span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <DeductionField label="국민연금 (4.6%)" value={pension} />
          <DeductionField label="건강보험 (3.545%)" value={health} />
          <DeductionField label="고용보험 (0.9%)" value={employment} />
          <DeductionField label="소득세 (간이세액)" value={incomeTax} />
        </div>
      </div>

      <div className="mb-6 rounded-md border border-slate-200 p-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-xs text-slate-500">총 지급액</div>
            <div className="text-lg font-semibold text-slate-900">{won(totalPayment)}원</div>
          </div>
          <span className="text-slate-300">−</span>
          <div>
            <div className="text-xs text-slate-500">총 공제액</div>
            <div className="text-lg font-semibold text-slate-900">{won(deductionTotal)}원</div>
          </div>
          <span className="text-slate-300">=</span>
          <div>
            <div className="text-xs text-slate-500">실 수령액</div>
            <div className="text-lg font-semibold text-blue-700">{won(netPay)}원</div>
          </div>
          <span className="ml-auto text-xs text-slate-400">공제액은 자동 계산됩니다</span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="secondary" onClick={reset}>
          초기화
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit || saving}>
          {saving ? "등록 중..." : "급여정보등록"}
        </Button>
      </div>
    </Modal>
  );
}

function DeductionField({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
      <div className="relative">
        <input
          readOnly
          value={won(value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        />
        <span className="absolute right-2 top-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400">
          자동
        </span>
      </div>
    </div>
  );
}
