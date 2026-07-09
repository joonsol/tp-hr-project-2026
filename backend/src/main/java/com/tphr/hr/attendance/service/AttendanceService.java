package com.tphr.hr.attendance.service;

import com.tphr.hr.attendance.dto.AttendanceBulkRequest;
import com.tphr.hr.attendance.dto.AttendanceCounts;
import com.tphr.hr.attendance.dto.AttendanceRosterResponse;
import com.tphr.hr.attendance.dto.AttendanceSearchResponse;
import com.tphr.hr.attendance.dto.AttendanceUpsertRequest;
import com.tphr.hr.attendance.dto.MonthlyAttendanceResponse;
import com.tphr.hr.attendance.dto.MonthlyAttendanceRowResponse;
import com.tphr.hr.attendance.entity.Attendance;
import com.tphr.hr.attendance.repository.AttendanceRepository;
import com.tphr.hr.common.exception.BusinessException;
import com.tphr.hr.common.exception.ErrorCode;
import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.employee.repository.EmployeeRepository;
import com.tphr.hr.employee.service.EmployeeSpecifications;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AttendanceService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;

    public AttendanceSearchResponse search(LocalDate workDate, Long departmentId, String keyword, Pageable pageable) {
        var spec = EmployeeSpecifications.search(keyword, departmentId, null, Employee.STATUS_ACTIVE);

        Page<Employee> employeePage = employeeRepository.findAll(spec, pageable);
        List<Employee> allMatching = employeeRepository.findAll(spec);

        Map<Long, Attendance> byEmployeeId = attendanceMap(workDate, allMatching);

        List<AttendanceRosterResponse> content = employeePage.getContent().stream()
                .map(e -> AttendanceRosterResponse.of(e, byEmployeeId.get(e.getEmployeeId())))
                .toList();

        AttendanceCounts counts = new AttendanceCounts(
                allMatching.size(),
                countByStatus(byEmployeeId, Attendance.CHECK_IN),
                countByStatus(byEmployeeId, Attendance.LATE),
                countByStatus(byEmployeeId, Attendance.ABSENT),
                countByStatus(byEmployeeId, Attendance.ANNUAL_LEAVE)
        );

        return new AttendanceSearchResponse(
                content, counts,
                employeePage.getTotalElements(), employeePage.getTotalPages(),
                employeePage.getNumber(), employeePage.getSize()
        );
    }

    public MonthlyAttendanceResponse getMonthly(YearMonth yearMonth, Long departmentId) {
        var spec = EmployeeSpecifications.search(null, departmentId, null, Employee.STATUS_ACTIVE);
        List<Employee> employees = employeeRepository.findAll(spec, Sort.by("name"));

        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        List<Long> ids = employees.stream().map(Employee::getEmployeeId).toList();

        Map<Long, Map<Integer, Attendance>> byEmployeeAndDay = new HashMap<>();
        if (!ids.isEmpty()) {
            for (Attendance a : attendanceRepository.findByWorkDateBetweenAndEmployee_EmployeeIdIn(startDate, endDate, ids)) {
                byEmployeeAndDay
                        .computeIfAbsent(a.getEmployee().getEmployeeId(), k -> new HashMap<>())
                        .put(a.getWorkDate().getDayOfMonth(), a);
            }
        }

        List<MonthlyAttendanceRowResponse> rows = employees.stream()
                .map(e -> toMonthlyRow(e, byEmployeeAndDay.getOrDefault(e.getEmployeeId(), Map.of())))
                .toList();

        int totalWorkDays = 0;
        for (LocalDate d = startDate; !d.isAfter(endDate); d = d.plusDays(1)) {
            if (d.getDayOfWeek() != DayOfWeek.SATURDAY && d.getDayOfWeek() != DayOfWeek.SUNDAY) {
                totalWorkDays++;
            }
        }

        return new MonthlyAttendanceResponse(yearMonth.getYear(), yearMonth.getMonthValue(), totalWorkDays, employees.size(), rows);
    }

    private MonthlyAttendanceRowResponse toMonthlyRow(Employee employee, Map<Integer, Attendance> byDay) {
        Map<Integer, String> days = new HashMap<>();
        long checkIn = 0;
        long late = 0;
        long annualLeave = 0;
        long absent = 0;
        for (Map.Entry<Integer, Attendance> entry : byDay.entrySet()) {
            String code = entry.getValue().getAttendanceStatusCode();
            days.put(entry.getKey(), code);
            if (Attendance.CHECK_IN.equals(code)) checkIn++;
            else if (Attendance.LATE.equals(code)) late++;
            else if (Attendance.ANNUAL_LEAVE.equals(code)) annualLeave++;
            else if (Attendance.ABSENT.equals(code)) absent++;
        }
        return new MonthlyAttendanceRowResponse(
                employee.getEmployeeId(),
                employee.getEmployeeNo(),
                employee.getName(),
                employee.getDepartment() != null ? employee.getDepartment().getDepartmentName() : null,
                days,
                checkIn, late, annualLeave, absent
        );
    }

    @Transactional
    public AttendanceRosterResponse upsert(AttendanceUpsertRequest request) {
        Employee employee = findEmployee(request.employeeId());
        Attendance attendance = attendanceRepository
                .findByEmployee_EmployeeIdAndWorkDate(request.employeeId(), request.workDate())
                .orElseGet(() -> new Attendance(employee, request.workDate()));

        attendance.update(request.attendanceStatusCode(), request.checkInTime(), request.checkOutTime(), request.memo());
        attendanceRepository.save(attendance);

        return AttendanceRosterResponse.of(employee, attendance);
    }

    @Transactional
    public void bulkUpsert(AttendanceBulkRequest request) {
        for (Long employeeId : request.employeeIds()) {
            Employee employee = findEmployee(employeeId);
            Attendance attendance = attendanceRepository
                    .findByEmployee_EmployeeIdAndWorkDate(employeeId, request.workDate())
                    .orElseGet(() -> new Attendance(employee, request.workDate()));
            attendance.update(request.attendanceStatusCode(), attendance.getCheckInTime(), attendance.getCheckOutTime(), attendance.getMemo());
            attendanceRepository.save(attendance);
        }
    }

    private Map<Long, Attendance> attendanceMap(LocalDate workDate, List<Employee> employees) {
        List<Long> ids = employees.stream().map(Employee::getEmployeeId).toList();
        if (ids.isEmpty()) {
            return Map.of();
        }
        return attendanceRepository.findByWorkDateAndEmployee_EmployeeIdIn(workDate, ids).stream()
                .collect(Collectors.toMap(a -> a.getEmployee().getEmployeeId(), Function.identity()));
    }

    private long countByStatus(Map<Long, Attendance> byEmployeeId, String statusCode) {
        return byEmployeeId.values().stream().filter(a -> statusCode.equals(a.getAttendanceStatusCode())).count();
    }

    private Employee findEmployee(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND));
    }
}
