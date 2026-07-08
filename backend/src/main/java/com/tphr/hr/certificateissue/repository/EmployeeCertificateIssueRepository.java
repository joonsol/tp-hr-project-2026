package com.tphr.hr.certificateissue.repository;

import com.tphr.hr.certificateissue.entity.EmployeeCertificateIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EmployeeCertificateIssueRepository
        extends JpaRepository<EmployeeCertificateIssue, Long>, JpaSpecificationExecutor<EmployeeCertificateIssue> {

    long countByApplicationNoStartingWith(String prefix);
}
