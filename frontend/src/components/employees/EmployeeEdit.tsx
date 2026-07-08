"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmployee, updateEmployee } from "@/lib/api/employees";
import { Employee } from "@/lib/types/employee";
import { EmployeeForm, EmployeeFormValues } from "@/components/employees/EmployeeForm";
import { PageHeader } from "@/components/ui";

export function EmployeeEdit({ employeeId }: { employeeId: number }) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployee(employeeId)
      .then(setEmployee)
      .finally(() => setLoading(false));
  }, [employeeId]);

  async function handleSubmit(values: EmployeeFormValues) {
    await updateEmployee(employeeId, {
      departmentId: values.departmentId ? Number(values.departmentId) : null,
      positionId: values.positionId ? Number(values.positionId) : null,
      employmentTypeId: values.employmentTypeId ? Number(values.employmentTypeId) : null,
      name: values.name,
      birthDate: values.birthDate || null,
      phone: values.phone || null,
      email: values.email || null,
      address: values.address || null,
      hireDate: values.hireDate || null,
      resignationDate: values.resignationDate || null,
      employeeStatusCode: values.employeeStatusCode || null,
      bankName: values.bankName || null,
      accountNumber: values.accountNumber || null,
      accountHolder: values.accountHolder || null,
    });
    router.replace(`/employees/${employeeId}`);
  }

  if (loading) {
    return <p className="text-slate-400">불러오는 중...</p>;
  }
  if (!employee) {
    return <p className="text-slate-400">사원 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <PageHeader title={`${employee.name} 정보 수정`} />
      <EmployeeForm mode="edit" employee={employee} onSubmit={handleSubmit} submitLabel="저장" />
    </div>
  );
}
