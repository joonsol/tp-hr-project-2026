"use client";

import { useRouter } from "next/navigation";
import { createEmployee } from "@/lib/api/employees";
import { EmployeeForm, EmployeeFormValues } from "@/components/employees/EmployeeForm";
import { PageHeader } from "@/components/ui";

export default function NewEmployeePage() {
  const router = useRouter();

  async function handleSubmit(values: EmployeeFormValues) {
    const created = await createEmployee({
      employeeNo: values.employeeNo,
      password: values.password,
      departmentId: values.departmentId ? Number(values.departmentId) : null,
      positionId: values.positionId ? Number(values.positionId) : null,
      employmentTypeId: values.employmentTypeId ? Number(values.employmentTypeId) : null,
      name: values.name,
      birthDate: values.birthDate || null,
      phone: values.phone || null,
      email: values.email || null,
      address: values.address || null,
      hireDate: values.hireDate || null,
      employeeStatusCode: values.employeeStatusCode || null,
      bankName: values.bankName || null,
      accountNumber: values.accountNumber || null,
      accountHolder: values.accountHolder || null,
    });
    router.replace(`/employees/${created.employeeId}`);
  }

  return (
    <div>
      <PageHeader title="사원 추가" />
      <EmployeeForm mode="create" onSubmit={handleSubmit} submitLabel="등록" />
    </div>
  );
}
