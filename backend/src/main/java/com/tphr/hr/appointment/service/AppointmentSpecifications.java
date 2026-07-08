package com.tphr.hr.appointment.service;

import com.tphr.hr.appointment.entity.EmployeeAppointment;
import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class AppointmentSpecifications {

    private AppointmentSpecifications() {
    }

    public static Specification<EmployeeAppointment> search(String keyword, String appointmentType,
            LocalDate fromDate, LocalDate toDate) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (StringUtils.hasText(keyword)) {
                String like = "%" + keyword.trim().toLowerCase() + "%";
                predicates = cb.and(predicates, cb.or(
                        cb.like(cb.lower(root.get("employee").get("name")), like),
                        cb.like(cb.lower(root.get("employee").get("employeeNo")), like)
                ));
            }
            if (StringUtils.hasText(appointmentType)) {
                predicates = cb.and(predicates, cb.equal(root.get("appointmentType"), appointmentType));
            }
            if (fromDate != null) {
                predicates = cb.and(predicates, cb.greaterThanOrEqualTo(root.get("appointmentDate"), fromDate));
            }
            if (toDate != null) {
                predicates = cb.and(predicates, cb.lessThanOrEqualTo(root.get("appointmentDate"), toDate));
            }
            return predicates;
        };
    }
}
