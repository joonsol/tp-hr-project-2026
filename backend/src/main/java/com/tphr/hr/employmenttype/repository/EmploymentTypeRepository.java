package com.tphr.hr.employmenttype.repository;

import com.tphr.hr.employmenttype.entity.EmploymentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmploymentTypeRepository extends JpaRepository<EmploymentType, Long> {
}
