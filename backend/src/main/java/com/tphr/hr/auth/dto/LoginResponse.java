package com.tphr.hr.auth.dto;

import com.tphr.hr.employee.dto.EmployeeSummaryResponse;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        EmployeeSummaryResponse employee
) {

    public static LoginResponse of(String accessToken, long expiresInMs, EmployeeSummaryResponse employee) {
        return new LoginResponse(accessToken, "Bearer", expiresInMs / 1000, employee);
    }
}
