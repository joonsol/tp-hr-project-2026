package com.tphr.hr.employmenttype.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmploymentTypeRequest(
        @NotBlank(message = "사원타입명은 필수입니다.") @Size(max = 100) String employmentTypeName
) {
}
