package com.tphr.hr.department.dto;

import com.tphr.hr.department.entity.Department;

public record DepartmentResponse(
        Long departmentId,
        String departmentName,
        Long parentDepartmentId
) {

    public static DepartmentResponse from(Department department) {
        return new DepartmentResponse(
                department.getDepartmentId(),
                department.getDepartmentName(),
                department.getParentDepartmentId()
        );
    }
}
