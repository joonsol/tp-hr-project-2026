package com.tphr.hr.eventsupport.repository;

import com.tphr.hr.eventsupport.entity.EmployeeEventSupport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EmployeeEventSupportRepository
        extends JpaRepository<EmployeeEventSupport, Long>, JpaSpecificationExecutor<EmployeeEventSupport> {

    long countByApplicationNoStartingWith(String prefix);
}
