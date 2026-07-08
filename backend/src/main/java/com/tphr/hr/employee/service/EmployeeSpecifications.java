package com.tphr.hr.employee.service;

import com.tphr.hr.employee.entity.Employee;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class EmployeeSpecifications {

    private EmployeeSpecifications() {
    }

    public static Specification<Employee> search(String keyword, Long departmentId, Long positionId, String status) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (StringUtils.hasText(keyword)) {
                String like = "%" + keyword.trim().toLowerCase() + "%";
                predicates = cb.and(predicates, cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("employeeNo")), like),
                        cb.like(cb.lower(root.get("email")), like)
                ));
            }
            if (departmentId != null) {
                predicates = cb.and(predicates, cb.equal(root.get("department").get("departmentId"), departmentId));
            }
            if (positionId != null) {
                predicates = cb.and(predicates, cb.equal(root.get("position").get("positionId"), positionId));
            }
            if (StringUtils.hasText(status)) {
                predicates = cb.and(predicates, cb.equal(root.get("employeeStatusCode"), status));
            }
            return predicates;
        };
    }
}
