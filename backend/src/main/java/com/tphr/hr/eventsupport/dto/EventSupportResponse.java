package com.tphr.hr.eventsupport.dto;

import com.tphr.hr.eventsupport.entity.EmployeeEventSupport;
import java.time.LocalDate;

public record EventSupportResponse(
        Long employeeEventSupportId,
        String applicationNo,
        Long employeeId,
        String employeeNo,
        String employeeName,
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

    public static EventSupportResponse from(EmployeeEventSupport e) {
        return new EventSupportResponse(
                e.getEmployeeEventSupportId(),
                e.getApplicationNo(),
                e.getEmployee().getEmployeeId(),
                e.getEmployee().getEmployeeNo(),
                e.getEmployee().getName(),
                e.getEventType(),
                e.getFamilyRelation(),
                e.getTargetName(),
                e.getApplicationDate(),
                e.getEventDate(),
                e.getRequestedAmount(),
                e.getEventLocation(),
                e.getBankName(),
                e.getAccountNumber(),
                e.getAccountHolder(),
                e.getApprovalStatus(),
                e.getMemo()
        );
    }
}
