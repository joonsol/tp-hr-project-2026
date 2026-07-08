"use client";

import { useRouter } from "next/navigation";
import { createCertificateIssue } from "@/lib/api/certificateIssues";
import {
  CertificateIssueForm,
  CertificateIssueFormValues,
  toRequest,
} from "@/components/certificateissues/CertificateIssueForm";
import { PageHeader } from "@/components/ui";

export default function NewCertificateIssuePage() {
  const router = useRouter();

  async function handleSubmit(values: CertificateIssueFormValues) {
    await createCertificateIssue(toRequest(values));
    router.replace("/certificate-issues");
  }

  return (
    <div>
      <PageHeader title="증명서 발급신청등록" />
      <CertificateIssueForm onSubmit={handleSubmit} submitLabel="등록" />
    </div>
  );
}
