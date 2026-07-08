"use client";

import { FormEvent, useEffect, useState } from "react";
import { listDepartments } from "@/lib/api/departments";
import { listEmployees } from "@/lib/api/employees";
import { Department } from "@/lib/types/department";
import { Employee } from "@/lib/types/employee";
import { Appointment, AppointmentRequest } from "@/lib/types/appointment";
import { ApiError } from "@/lib/api/client";
import { Button, Card, ErrorText, Field, Input, Select } from "@/components/ui";

export interface AppointmentFormValues {
  employeeId: string;
  appointmentType: string;
  appointmentDate: string;
  fromDepartmentId: string;
  toDepartmentId: string;
  fromPositionName: string;
  toPositionName: string;
  reason: string;
  memo: string;
}

function toFormValues(appointment?: Appointment | null): AppointmentFormValues {
  return {
    employeeId: appointment?.employeeId?.toString() ?? "",
    appointmentType: appointment?.appointmentType ?? "승진",
    appointmentDate: appointment?.appointmentDate ?? "",
    fromDepartmentId: appointment?.fromDepartmentId?.toString() ?? "",
    toDepartmentId: appointment?.toDepartmentId?.toString() ?? "",
    fromPositionName: appointment?.fromPositionName ?? "",
    toPositionName: appointment?.toPositionName ?? "",
    reason: appointment?.reason ?? "",
    memo: appointment?.memo ?? "",
  };
}

export function toRequest(values: AppointmentFormValues): AppointmentRequest {
  return {
    employeeId: Number(values.employeeId),
    appointmentType: values.appointmentType || null,
    appointmentDate: values.appointmentDate || null,
    fromDepartmentId: values.fromDepartmentId ? Number(values.fromDepartmentId) : null,
    toDepartmentId: values.toDepartmentId ? Number(values.toDepartmentId) : null,
    fromPositionName: values.fromPositionName || null,
    toPositionName: values.toPositionName || null,
    reason: values.reason || null,
    memo: values.memo || null,
  };
}

export function AppointmentForm({
  appointment,
  onSubmit,
  submitLabel,
}: {
  appointment?: Appointment | null;
  onSubmit: (values: AppointmentFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<AppointmentFormValues>(() => toFormValues(appointment));
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listEmployees().then(setEmployees);
    listDepartments().then(setDepartments);
  }, []);

  function set<K extends keyof AppointmentFormValues>(key: K, value: AppointmentFormValues[K]) {
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
          <Field label="사원">
            <Select value={values.employeeId} onChange={(e) => set("employeeId", e.target.value)} required>
              <option value="">선택</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeNo} · {emp.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="발령유형">
            <Select value={values.appointmentType} onChange={(e) => set("appointmentType", e.target.value)}>
              <option value="승진">승진</option>
              <option value="전보">전보</option>
              <option value="겸직">겸직</option>
            </Select>
          </Field>
          <Field label="발령일">
            <Input
              type="date"
              value={values.appointmentDate}
              onChange={(e) => set("appointmentDate", e.target.value)}
            />
          </Field>
          <div />
          <Field label="전부서">
            <Select value={values.fromDepartmentId} onChange={(e) => set("fromDepartmentId", e.target.value)}>
              <option value="">미지정</option>
              {departments.map((d) => (
                <option key={d.departmentId} value={d.departmentId}>
                  {d.departmentName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="전직급">
            <Input value={values.fromPositionName} onChange={(e) => set("fromPositionName", e.target.value)} />
          </Field>
          <Field label="후부서">
            <Select value={values.toDepartmentId} onChange={(e) => set("toDepartmentId", e.target.value)}>
              <option value="">미지정</option>
              {departments.map((d) => (
                <option key={d.departmentId} value={d.departmentId}>
                  {d.departmentName}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="후직급">
            <Input value={values.toPositionName} onChange={(e) => set("toPositionName", e.target.value)} />
          </Field>
        </div>
        <Field label="사유">
          <textarea
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            rows={2}
            value={values.reason}
            onChange={(e) => set("reason", e.target.value)}
          />
        </Field>
        <Field label="비고">
          <textarea
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            rows={2}
            value={values.memo}
            onChange={(e) => set("memo", e.target.value)}
          />
        </Field>
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
