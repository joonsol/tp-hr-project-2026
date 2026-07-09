package com.tphr.hr.payroll.dto;

import java.time.LocalDate;

public record PayrollCandidateResponse(
        Long employeeId,
        String employeeNo,
        String name,
        String departmentName,
        String positionName,
        LocalDate hireDate,
        boolean registered
) {
}
