package com.tphr.hr.attendance.repository;

import com.tphr.hr.attendance.entity.Attendance;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByEmployee_EmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);

    List<Attendance> findByWorkDateAndEmployee_EmployeeIdIn(LocalDate workDate, List<Long> employeeIds);
}
