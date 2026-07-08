package com.tphr.hr.employmenttype.dto;

import com.tphr.hr.employmenttype.entity.EmploymentType;

public record EmploymentTypeResponse(
        Long employmentTypeId,
        String employmentTypeName
) {

    public static EmploymentTypeResponse from(EmploymentType employmentType) {
        return new EmploymentTypeResponse(employmentType.getEmploymentTypeId(), employmentType.getEmploymentTypeName());
    }
}
