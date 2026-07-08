package com.tphr.hr.certificateissue.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record CertificateIssueRequest(
        @NotNull Long employeeId,
        String certificateType,
        LocalDate applicationDate,
        String issueStatus,
        String approvalStatus,
        Long approverId,
        String purpose,
        String memo
) {
}
