"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteEmployee, getEmployee } from "@/lib/api/employees";
import { Employee } from "@/lib/types/employee";
import { Button, Card, PageHeader } from "@/components/ui";

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="col-span-2 text-slate-900">{value || "-"}</dd>
    </div>
  );
}

export function EmployeeDetail({ employeeId }: { employeeId: number }) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployee(employeeId)
      .then(setEmployee)
      .finally(() => setLoading(false));
  }, [employeeId]);

  async function handleDelete() {
    if (!confirm("이 사원을 삭제하시겠습니까?")) return;
    await deleteEmployee(employeeId);
    router.replace("/employees");
  }

  if (loading) {
    return <p className="text-slate-400">불러오는 중...</p>;
  }
  if (!employee) {
    return <p className="text-slate-400">사원 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <PageHeader
        title={`${employee.name} (${employee.employeeNo})`}
        actions={
          <div className="flex gap-2">
            <Link href={`/employees/${employee.employeeId}/edit`}>
              <Button variant="secondary">수정</Button>
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        }
      />
      <Card className="p-6">
        <dl className="divide-y divide-slate-100">
          <Row label="이메일" value={employee.email} />
          <Row label="전화번호" value={employee.phone} />
          <Row label="생년월일" value={employee.birthDate} />
          <Row label="주소" value={employee.address} />
          <Row label="부서" value={employee.departmentName} />
          <Row label="직책" value={employee.positionName} />
          <Row label="사원타입" value={employee.employmentTypeName} />
          <Row label="입사일" value={employee.hireDate} />
          <Row label="퇴사일" value={employee.resignationDate} />
          <Row label="재직 상태" value={employee.employeeStatusCode === "RESIGNED" ? "퇴사" : "재직"} />
          <Row label="은행" value={employee.bankName} />
          <Row label="계좌번호" value={employee.accountNumber} />
          <Row label="예금주" value={employee.accountHolder} />
        </dl>
      </Card>
    </div>
  );
}
