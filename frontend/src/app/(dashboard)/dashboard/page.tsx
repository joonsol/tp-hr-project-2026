"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { Card, PageHeader } from "@/components/ui";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="대시보드" />
      <Card className="p-6">
        <p className="text-slate-700">
          안녕하세요, <span className="font-medium">{user?.name}</span>님. 인사관리시스템에 오신 것을 환영합니다.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          사번 {user?.employeeNo} · {user?.departmentName ?? "부서 미지정"} · {user?.employeeStatusCode}
        </p>
      </Card>
    </div>
  );
}
