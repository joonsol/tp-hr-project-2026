package com.tphr.hr.appointment.service;

import com.tphr.hr.appointment.dto.AppointmentRequest;
import com.tphr.hr.appointment.dto.AppointmentResponse;
import com.tphr.hr.appointment.entity.EmployeeAppointment;
import com.tphr.hr.appointment.repository.EmployeeAppointmentRepository;
import com.tphr.hr.common.exception.BusinessException;
import com.tphr.hr.common.exception.ErrorCode;
import com.tphr.hr.common.util.DocumentNumberGenerator;
import com.tphr.hr.department.entity.Department;
import com.tphr.hr.department.repository.DepartmentRepository;
import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.employee.repository.EmployeeRepository;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppointmentService {

    private static final String PREFIX = "APT";

    private final EmployeeAppointmentRepository appointmentRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public Page<AppointmentResponse> search(String keyword, String appointmentType, LocalDate fromDate, LocalDate toDate,
            Pageable pageable) {
        return appointmentRepository
                .findAll(AppointmentSpecifications.search(keyword, appointmentType, fromDate, toDate), pageable)
                .map(AppointmentResponse::from);
    }

    public AppointmentResponse getById(Long id) {
        return AppointmentResponse.from(findActive(id));
    }

    @Transactional
    public AppointmentResponse create(AppointmentRequest request, String registeredBy) {
        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND));

        String yearPrefix = DocumentNumberGenerator.prefixForThisYear(PREFIX);
        long count = appointmentRepository.countByAppointmentNoStartingWith(yearPrefix);
        String appointmentNo = DocumentNumberGenerator.next(yearPrefix, count);

        EmployeeAppointment appointment = EmployeeAppointment.builder()
                .appointmentNo(appointmentNo)
                .employee(employee)
                .appointmentType(request.appointmentType())
                .appointmentDate(request.appointmentDate())
                .fromDepartment(resolveDepartment(request.fromDepartmentId()))
                .toDepartment(resolveDepartment(request.toDepartmentId()))
                .fromPositionName(request.fromPositionName())
                .toPositionName(request.toPositionName())
                .reason(request.reason())
                .memo(request.memo())
                .registeredBy(registeredBy)
                .build();

        return AppointmentResponse.from(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse update(Long id, AppointmentRequest request) {
        EmployeeAppointment appointment = findActive(id);
        appointment.update(
                request.appointmentType(),
                request.appointmentDate(),
                resolveDepartment(request.fromDepartmentId()),
                resolveDepartment(request.toDepartmentId()),
                request.fromPositionName(),
                request.toPositionName(),
                request.reason(),
                request.memo()
        );
        return AppointmentResponse.from(appointment);
    }

    @Transactional
    public void delete(Long id) {
        findActive(id).markDeleted();
    }

    private EmployeeAppointment findActive(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.APPOINTMENT_NOT_FOUND));
    }

    private Department resolveDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND));
    }
}
