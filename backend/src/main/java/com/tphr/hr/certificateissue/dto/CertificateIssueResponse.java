package com.tphr.hr.certificateissue.dto;

import com.tphr.hr.certificateissue.entity.EmployeeCertificateIssue;
import java.time.LocalDate;

public record CertificateIssueResponse(
        Long employeeCertificateIssueId,
        String applicationNo,
        Long employeeId,
        String employeeNo,
        String employeeName,
        String certificateType,
        LocalDate applicationDate,
        String issueStatus,
        String approvalStatus,
        Long approverId,
        String approverName,
        String purpose,
        String memo
) {

    public static CertificateIssueResponse from(EmployeeCertificateIssue c) {
        return new CertificateIssueResponse(
                c.getEmployeeCertificateIssueId(),
                c.getApplicationNo(),
                c.getEmployee().getEmployeeId(),
                c.getEmployee().getEmployeeNo(),
                c.getEmployee().getName(),
                c.getCertificateType(),
                c.getApplicationDate(),
                c.getIssueStatus(),
                c.getApprovalStatus(),
                c.getApprover() != null ? c.getApprover().getEmployeeId() : null,
                c.getApprover() != null ? c.getApprover().getName() : null,
                c.getPurpose(),
                c.getMemo()
        );
    }
}
