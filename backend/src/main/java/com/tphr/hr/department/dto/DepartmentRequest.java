package com.tphr.hr.department.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartmentRequest(
        @NotBlank(message = "부서명은 필수입니다.") @Size(max = 100) String departmentName,
        Long parentDepartmentId
) {
}
