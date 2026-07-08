import { apiFetch, toQueryString } from "@/lib/api/client";
import { CertificateIssue, CertificateIssueRequest } from "@/lib/types/certificateIssue";
import { Page } from "@/lib/types/employee";

export interface CertificateIssueSearchParams {
  keyword?: string;
  issueStatus?: string;
  approvalStatus?: string;
  page?: number;
  size?: number;
}

export function searchCertificateIssues(params: CertificateIssueSearchParams): Promise<Page<CertificateIssue>> {
  const qs = toQueryString({
    keyword: params.keyword,
    issueStatus: params.issueStatus,
    approvalStatus: params.approvalStatus,
    page: params.page ?? 0,
    size: params.size ?? 10,
  });
  return apiFetch<Page<CertificateIssue>>(`/certificate-issues${qs}`);
}

export function getCertificateIssue(id: number): Promise<CertificateIssue> {
  return apiFetch<CertificateIssue>(`/certificate-issues/${id}`);
}

export function createCertificateIssue(request: CertificateIssueRequest): Promise<CertificateIssue> {
  return apiFetch<CertificateIssue>("/certificate-issues", { method: "POST", body: JSON.stringify(request) });
}

export function updateCertificateIssue(id: number, request: CertificateIssueRequest): Promise<CertificateIssue> {
  return apiFetch<CertificateIssue>(`/certificate-issues/${id}`, { method: "PUT", body: JSON.stringify(request) });
}

export function deleteCertificateIssue(id: number): Promise<void> {
  return apiFetch<void>(`/certificate-issues/${id}`, { method: "DELETE" });
}
