package com.tphr.hr.payroll.dto;

import java.util.List;

public record PayrollSummaryResponse(
        long averageBaseSalary,
        long maxBaseSalary,
        String maxBaseSalaryEmployeeName,
        String maxBaseSalaryPositionName,
        long totalLaborCost,
        long totalAllowance,
        int registeredCount,
        int unregisteredCount,
        int totalCount,
        List<PayrollRowResponse> rows
) {
}
