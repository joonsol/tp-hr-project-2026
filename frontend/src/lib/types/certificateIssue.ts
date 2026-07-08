export interface CertificateIssue {
  employeeCertificateIssueId: number;
  applicationNo: string;
  employeeId: number;
  employeeNo: string;
  employeeName: string;
  certificateType: string | null;
  applicationDate: string | null;
  issueStatus: string;
  approvalStatus: string;
  approverId: number | null;
  approverName: string | null;
  purpose: string | null;
  memo: string | null;
}

export interface CertificateIssueRequest {
  employeeId: number;
  certificateType: string | null;
  applicationDate: string | null;
  issueStatus: string | null;
  approvalStatus: string | null;
  approverId: number | null;
  purpose: string | null;
  memo: string | null;
}
