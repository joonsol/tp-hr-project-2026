"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { getPayrollHistory } from "@/lib/api/payroll";
import { PayrollRow } from "@/lib/types/payroll";

function won(n: number): string {
  return n.toLocaleString("ko-KR");
}

export function PayrollHistoryModal({
  employeeId,
  employeeName,
  onClose,
}: {
  employeeId: number;
  employeeName: string;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<PayrollRow[] | null>(null);

  useEffect(() => {
    getPayrollHistory(employeeId).then(setRows);
  }, [employeeId]);

  return (
    <Modal title={`${employeeName} 급여정보 이력`} onClose={onClose} widthClassName="max-w-2xl">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-3 py-2">적용시작일</th>
            <th className="px-3 py-2">기본급</th>
            <th className="px-3 py-2">수당합계</th>
            <th className="px-3 py-2">공제합계</th>
            <th className="px-3 py-2">실수령액</th>
          </tr>
        </thead>
        <tbody>
          {rows === null && (
            <tr>
              <td className="px-3 py-4 text-slate-400" colSpan={5}>
                불러오는 중...
              </td>
            </tr>
          )}
          {rows?.length === 0 && (
            <tr>
              <td className="px-3 py-4 text-slate-400" colSpan={5}>
                등록된 이력이 없습니다.
              </td>
            </tr>
          )}
          {rows?.map((r) => (
            <tr key={r.effectiveDate} className="border-b border-slate-100 last:border-b-0">
              <td className="px-3 py-2">{r.effectiveDate}</td>
              <td className="px-3 py-2">{won(r.baseSalary)}원</td>
              <td className="px-3 py-2">{won(r.allowanceTotal)}원</td>
              <td className="px-3 py-2">{won(r.deductionTotal)}원</td>
              <td className="px-3 py-2 font-medium">{won(r.netPay)}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
