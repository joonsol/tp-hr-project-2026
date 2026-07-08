package com.tphr.hr.certificateissue.service;

import com.tphr.hr.certificateissue.entity.EmployeeCertificateIssue;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class CertificateIssueSpecifications {

    private CertificateIssueSpecifications() {
    }

    public static Specification<EmployeeCertificateIssue> search(String keyword, String issueStatus, String approvalStatus) {
        return (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (StringUtils.hasText(keyword)) {
                String like = "%" + keyword.trim().toLowerCase() + "%";
                predicates = cb.and(predicates, cb.or(
                        cb.like(cb.lower(root.get("employee").get("name")), like),
                        cb.like(cb.lower(root.get("employee").get("employeeNo")), like),
                        cb.like(cb.lower(root.get("applicationNo")), like)
                ));
            }
            if (StringUtils.hasText(issueStatus)) {
                predicates = cb.and(predicates, cb.equal(root.get("issueStatus"), issueStatus));
            }
            if (StringUtils.hasText(approvalStatus)) {
                predicates = cb.and(predicates, cb.equal(root.get("approvalStatus"), approvalStatus));
            }
            return predicates;
        };
    }
}
