package com.tphr.hr.payroll.dto;

import java.time.LocalDate;

public record PayrollRowResponse(
        Long employeeId,
        String employeeNo,
        String name,
        String departmentName,
        String positionName,
        long baseSalary,
        long mealAllowance,
        long transportAllowance,
        long positionAllowance,
        long allowanceTotal,
        long pension,
        long healthInsurance,
        long employmentInsurance,
        long incomeTax,
        long deductionTotal,
        long totalPayment,
        long netPay,
        String bankName,
        String accountNumber,
        LocalDate effectiveDate
) {
}
