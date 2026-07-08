package com.tphr.hr.department.dto;

import java.util.ArrayList;
import java.util.List;

public record DepartmentTreeNode(
        Long departmentId,
        String departmentName,
        List<DepartmentTreeNode> children
) {

    public static DepartmentTreeNode of(Long departmentId, String departmentName) {
        return new DepartmentTreeNode(departmentId, departmentName, new ArrayList<>());
    }
}
