package com.tphr.hr.payroll.repository;

import com.tphr.hr.payroll.entity.PayrollBaseInfo;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayrollBaseInfoRepository extends JpaRepository<PayrollBaseInfo, Long> {

    Optional<PayrollBaseInfo> findByEmployee_EmployeeIdAndEffectiveDate(Long employeeId, LocalDate effectiveDate);

    List<PayrollBaseInfo> findByEmployee_EmployeeIdInAndEffectiveDateLessThanEqual(List<Long> employeeIds, LocalDate asOfDate);

    List<PayrollBaseInfo> findByEmployee_EmployeeIdOrderByEffectiveDateDesc(Long employeeId);
}
