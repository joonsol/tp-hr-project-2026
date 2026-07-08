"use client";

import { FormEvent, useEffect, useState } from "react";
import { listDepartments } from "@/lib/api/departments";
import { listPositions } from "@/lib/api/positions";
import { listEmploymentTypes } from "@/lib/api/employmentTypes";
import { Department } from "@/lib/types/department";
import { Position } from "@/lib/types/position";
import { EmploymentType } from "@/lib/types/employmentType";
import { Employee } from "@/lib/types/employee";
import { ApiError } from "@/lib/api/client";
import { Button, Card, ErrorText, Field, Input, Select } from "@/components/ui";

export interface EmployeeFormValues {
  employeeNo: string;
  password: string;
  departmentId: string;
  positionId: string;
  employmentTypeId: string;
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  hireDate: string;
  resignationDate: string;
  employeeStatusCode: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

function toFormValues(employee?: Employee | null): EmployeeFormValues {
  return {
    employeeNo: employee?.employeeNo ?? "",
    password: "",
    departmentId: employee?.departmentId?.toString() ?? "",
    positionId: employee?.positionId?.toString() ?? "",
    employmentTypeId: employee?.employmentTypeId?.toString() ?? "",
    name: employee?.name ?? "",
    birthDate: employee?.birthDate ?? "",
    phone: employee?.phone ?? "",
    email: employee?.email ?? "",
    address: employee?.address ?? "",
    hireDate: employee?.hireDate ?? "",
    resignationDate: employee?.resignationDate ?? "",
    employeeStatusCode: employee?.employeeStatusCode ?? "ACTIVE",
    bankName: employee?.bankName ?? "",
    accountNumber: employee?.accountNumber ?? "",
    accountHolder: employee?.accountHolder ?? "",
  };
}

export function EmployeeForm({
  mode,
  employee,
  onSubmit,
  submitLabel,
}: {
  mode: "create" | "edit";
  employee?: Employee | null;
  onSubmit: (values: EmployeeFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<EmployeeFormValues>(() => toFormValues(employee));
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [employmentTypes, setEmploymentTypes] = useState<EmploymentType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listDepartments().then(setDepartments);
    listPositions().then(setPositions);
    listEmploymentTypes().then(setEmploymentTypes);
  }, []);

  function set<K extends keyof EmployeeFormValues>(key: K, value: EmployeeFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mode === "create" && (
            <Field label="사번">
              <Input value={values.employeeNo} onChange={(e) => set("employeeNo", e.target.value)} required />
            </Field>
          )}
          <Field label="이름">
            <Input value={values.name} onChange={(e) => set("name", e.target.value)} required />
          </Field>
          {mode === "create" && (
            <Field label="비밀번호">
              <Input
                type="password"
                value={values.password}
                onChange={(e) => set("password", e.target.value)}
                required
                minLength={4}
              />
            </Field>
          )}
          <Field label="이메일">
            <Input type="email" value={values.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="전화번호">
            <Input value={values.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="생년월일">
            <Input type="date" value={values.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
          </Field>
          <Field label="주소">
            <Input value={values.address} onChange={(e) => set("address", e.target.value)} />
          </Field>
          <Field label="부서">
            <Select value={values.departmentId} onChange={(e) => set("departmentId", e.target.value)}>
              <option value="">미지정</option>
              {departments.map((d) => (
                <option key={d.departmentId} value={d.departmentId}>
                  {d.departmentName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="직책">
            <Select value={values.positionId} onChange={(e) => set("positionId", e.target.value)}>
              <option value="">미지정</option>
              {positions.map((p) => (
                <option key={p.positionId} value={p.positionId}>
                  {p.positionName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="사원타입">
            <Select value={values.employmentTypeId} onChange={(e) => set("employmentTypeId", e.target.value)}>
              <option value="">미지정</option>
              {employmentTypes.map((t) => (
                <option key={t.employmentTypeId} value={t.employmentTypeId}>
                  {t.employmentTypeName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="입사일">
            <Input type="date" value={values.hireDate} onChange={(e) => set("hireDate", e.target.value)} />
          </Field>
          {mode === "edit" && (
            <Field label="퇴사일">
              <Input
                type="date"
                value={values.resignationDate}
                onChange={(e) => set("resignationDate", e.target.value)}
              />
            </Field>
          )}
          <Field label="재직 상태">
            <Select value={values.employeeStatusCode} onChange={(e) => set("employeeStatusCode", e.target.value)}>
              <option value="ACTIVE">재직</option>
              <option value="RESIGNED">퇴사</option>
            </Select>
          </Field>
          <Field label="은행명">
            <Input value={values.bankName} onChange={(e) => set("bankName", e.target.value)} />
          </Field>
          <Field label="계좌번호">
            <Input value={values.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} />
          </Field>
          <Field label="예금주">
            <Input value={values.accountHolder} onChange={(e) => set("accountHolder", e.target.value)} />
          </Field>
        </div>
        <ErrorText>{error}</ErrorText>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "저장 중..." : submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
