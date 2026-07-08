"use client";

import { FormEvent, useEffect, useState } from "react";
import { listEmployees } from "@/lib/api/employees";
import { Employee } from "@/lib/types/employee";
import { CertificateIssue, CertificateIssueRequest } from "@/lib/types/certificateIssue";
import { ApiError } from "@/lib/api/client";
import { Button, Card, ErrorText, Field, Input, Select } from "@/components/ui";

export interface CertificateIssueFormValues {
  employeeId: string;
  certificateType: string;
  applicationDate: string;
  issueStatus: string;
  approvalStatus: string;
  approverId: string;
  purpose: string;
  memo: string;
}

function toFormValues(c?: CertificateIssue | null): CertificateIssueFormValues {
  return {
    employeeId: c?.employeeId?.toString() ?? "",
    certificateType: c?.certificateType ?? "재직증명서",
    applicationDate: c?.applicationDate ?? "",
    issueStatus: c?.issueStatus ?? "REQUESTED",
    approvalStatus: c?.approvalStatus ?? "PENDING",
    approverId: c?.approverId?.toString() ?? "",
    purpose: c?.purpose ?? "",
    memo: c?.memo ?? "",
  };
}

export function toRequest(values: CertificateIssueFormValues): CertificateIssueRequest {
  return {
    employeeId: Number(values.employeeId),
    certificateType: values.certificateType || null,
    applicationDate: values.applicationDate || null,
    issueStatus: values.issueStatus || null,
    approvalStatus: values.approvalStatus || null,
    approverId: values.approverId ? Number(values.approverId) : null,
    purpose: values.purpose || null,
    memo: values.memo || null,
  };
}

export function CertificateIssueForm({
  certificateIssue,
  onSubmit,
  submitLabel,
}: {
  certificateIssue?: CertificateIssue | null;
  onSubmit: (values: CertificateIssueFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<CertificateIssueFormValues>(() => toFormValues(certificateIssue));
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listEmployees().then(setEmployees);
  }, []);

  function set<K extends keyof CertificateIssueFormValues>(key: K, value: CertificateIssueFormValues[K]) {
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
          <Field label="증명서종류">
            <Select value={values.certificateType} onChange={(e) => set("certificateType", e.target.value)}>
              <option value="재직증명서">재직증명서</option>
              <option value="경력증명서">경력증명서</option>
              <option value="퇴직증명서">퇴직증명서</option>
              <option value="소득증명서">소득증명서</option>
            </Select>
          </Field>
          <Field label="신청일">
            <Input type="date" value={values.applicationDate} onChange={(e) => set("applicationDate", e.target.value)} />
          </Field>
          <Field label="발급상태">
            <Select value={values.issueStatus} onChange={(e) => set("issueStatus", e.target.value)}>
              <option value="REQUESTED">요청</option>
              <option value="ISSUED">발급완료</option>
            </Select>
          </Field>
          <Field label="승인상태">
            <Select value={values.approvalStatus} onChange={(e) => set("approvalStatus", e.target.value)}>
              <option value="PENDING">대기</option>
              <option value="APPROVED">승인</option>
              <option value="REJECTED">반려</option>
            </Select>
          </Field>
          <Field label="승인자">
            <Select value={values.approverId} onChange={(e) => set("approverId", e.target.value)}>
              <option value="">미지정</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.employeeNo} · {emp.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="용도">
          <Input value={values.purpose} onChange={(e) => set("purpose", e.target.value)} />
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
