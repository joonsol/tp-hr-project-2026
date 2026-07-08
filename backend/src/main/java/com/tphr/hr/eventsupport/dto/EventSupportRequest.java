package com.tphr.hr.eventsupport.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record EventSupportRequest(
        @NotNull Long employeeId,
        String eventType,
        String familyRelation,
        String targetName,
        LocalDate applicationDate,
        LocalDate eventDate,
        Integer requestedAmount,
        String eventLocation,
        String bankName,
        String accountNumber,
        String accountHolder,
        String approvalStatus,
        String memo
) {
}
