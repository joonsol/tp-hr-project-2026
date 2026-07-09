package com.tphr.hr.payroll.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record PayrollBulkUpsertRequest(
        @NotEmpty List<Long> employeeIds,
        @NotNull Long baseSalary,
        Long positionAllowance,
        Long mealAllowance,
        Long transportAllowance,
        @NotNull String paymentMethodCode,
        @NotNull Integer paymentDay,
        @NotNull LocalDate effectiveDate
) {
}
