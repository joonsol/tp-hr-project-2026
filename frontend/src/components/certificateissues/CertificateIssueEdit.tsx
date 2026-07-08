"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCertificateIssue, updateCertificateIssue } from "@/lib/api/certificateIssues";
import { CertificateIssue } from "@/lib/types/certificateIssue";
import {
  CertificateIssueForm,
  CertificateIssueFormValues,
  toRequest,
} from "@/components/certificateissues/CertificateIssueForm";
import { PageHeader } from "@/components/ui";

export function CertificateIssueEdit({ certificateIssueId }: { certificateIssueId: number }) {
  const router = useRouter();
  const [certificateIssue, setCertificateIssue] = useState<CertificateIssue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCertificateIssue(certificateIssueId)
      .then(setCertificateIssue)
      .finally(() => setLoading(false));
  }, [certificateIssueId]);

  async function handleSubmit(values: CertificateIssueFormValues) {
    await updateCertificateIssue(certificateIssueId, toRequest(values));
    router.replace("/certificate-issues");
  }

  if (loading) {
    return <p className="text-slate-400">불러오는 중...</p>;
  }
  if (!certificateIssue) {
    return <p className="text-slate-400">발급 내역을 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <PageHeader title="증명서 발급 수정" />
      <CertificateIssueForm certificateIssue={certificateIssue} onSubmit={handleSubmit} submitLabel="저장" />
    </div>
  );
}
