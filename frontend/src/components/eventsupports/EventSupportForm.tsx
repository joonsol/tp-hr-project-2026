"use client";

import { FormEvent, useEffect, useState } from "react";
import { listEmployees } from "@/lib/api/employees";
import { Employee } from "@/lib/types/employee";
import { EventSupport, EventSupportRequest } from "@/lib/types/eventSupport";
import { ApiError } from "@/lib/api/client";
import { Button, Card, ErrorText, Field, Input, Select } from "@/components/ui";

export interface EventSupportFormValues {
  employeeId: string;
  eventType: string;
  familyRelation: string;
  targetName: string;
  applicationDate: string;
  eventDate: string;
  requestedAmount: string;
  eventLocation: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  approvalStatus: string;
  memo: string;
}

function toFormValues(e?: EventSupport | null): EventSupportFormValues {
  return {
    employeeId: e?.employeeId?.toString() ?? "",
    eventType: e?.eventType ?? "결혼",
    familyRelation: e?.familyRelation ?? "",
    targetName: e?.targetName ?? "",
    applicationDate: e?.applicationDate ?? "",
    eventDate: e?.eventDate ?? "",
    requestedAmount: e?.requestedAmount?.toString() ?? "",
    eventLocation: e?.eventLocation ?? "",
    bankName: e?.bankName ?? "",
    accountNumber: e?.accountNumber ?? "",
    accountHolder: e?.accountHolder ?? "",
    approvalStatus: e?.approvalStatus ?? "PENDING",
    memo: e?.memo ?? "",
  };
}

export function toRequest(values: EventSupportFormValues): EventSupportRequest {
  return {
    employeeId: Number(values.employeeId),
    eventType: values.eventType || null,
    familyRelation: values.familyRelation || null,
    targetName: values.targetName || null,
    applicationDate: values.applicationDate || null,
    eventDate: values.eventDate || null,
    requestedAmount: values.requestedAmount ? Number(values.requestedAmount) : null,
    eventLocation: values.eventLocation || null,
    bankName: values.bankName || null,
    accountNumber: values.accountNumber || null,
    accountHolder: values.accountHolder || null,
    approvalStatus: values.approvalStatus || null,
    memo: values.memo || null,
  };
}

export function EventSupportForm({
  eventSupport,
  onSubmit,
  submitLabel,
}: {
  eventSupport?: EventSupport | null;
  onSubmit: (values: EventSupportFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<EventSupportFormValues>(() => toFormValues(eventSupport));
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    listEmployees().then(setEmployees);
  }, []);

  function set<K extends keyof EventSupportFormValues>(key: K, value: EventSupportFormValues[K]) {
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
          <Field label="경조유형">
            <Select value={values.eventType} onChange={(e) => set("eventType", e.target.value)}>
              <option value="결혼">결혼</option>
              <option value="출산">출산</option>
              <option value="사망">사망</option>
              <option value="기타">기타</option>
            </Select>
          </Field>
          <Field label="가족관계">
            <Input value={values.familyRelation} onChange={(e) => set("familyRelation", e.target.value)} />
          </Field>
          <Field label="대상자">
            <Input value={values.targetName} onChange={(e) => set("targetName", e.target.value)} />
          </Field>
          <Field label="신청일">
            <Input type="date" value={values.applicationDate} onChange={(e) => set("applicationDate", e.target.value)} />
          </Field>
          <Field label="경조일">
            <Input type="date" value={values.eventDate} onChange={(e) => set("eventDate", e.target.value)} />
          </Field>
          <Field label="신청금액">
            <Input
              type="number"
              value={values.requestedAmount}
              onChange={(e) => set("requestedAmount", e.target.value)}
            />
          </Field>
          <Field label="장소">
            <Input value={values.eventLocation} onChange={(e) => set("eventLocation", e.target.value)} />
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
          <Field label="승인상태">
            <Select value={values.approvalStatus} onChange={(e) => set("approvalStatus", e.target.value)}>
              <option value="PENDING">대기</option>
              <option value="APPROVED">승인</option>
              <option value="REJECTED">반려</option>
            </Select>
          </Field>
        </div>
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
