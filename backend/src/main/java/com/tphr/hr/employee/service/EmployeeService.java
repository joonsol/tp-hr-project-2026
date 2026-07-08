package com.tphr.hr.employee.service;

import com.tphr.hr.common.exception.BusinessException;
import com.tphr.hr.common.exception.ErrorCode;
import com.tphr.hr.department.entity.Department;
import com.tphr.hr.department.repository.DepartmentRepository;
import com.tphr.hr.employee.dto.EmployeeCreateRequest;
import com.tphr.hr.employee.dto.EmployeeResponse;
import com.tphr.hr.employee.dto.EmployeeUpdateRequest;
import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.employee.repository.EmployeeRepository;
import com.tphr.hr.employmenttype.entity.EmploymentType;
import com.tphr.hr.employmenttype.repository.EmploymentTypeRepository;
import com.tphr.hr.position.entity.Position;
import com.tphr.hr.position.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final EmploymentTypeRepository employmentTypeRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<EmployeeResponse> search(String keyword, Long departmentId, Long positionId, String status, Pageable pageable) {
        return employeeRepository.findAll(EmployeeSpecifications.search(keyword, departmentId, positionId, status), pageable)
                .map(EmployeeResponse::from);
    }

    public EmployeeResponse getById(Long employeeId) {
        return EmployeeResponse.from(findActive(employeeId));
    }

    @Transactional
    public EmployeeResponse create(EmployeeCreateRequest request) {
        if (employeeRepository.existsByEmployeeNo(request.employeeNo())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMPLOYEE_NO);
        }
        if (request.email() != null && employeeRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        Employee employee = Employee.builder()
                .employeeNo(request.employeeNo())
                .department(resolveDepartment(request.departmentId()))
                .position(resolvePosition(request.positionId()))
                .employmentType(resolveEmploymentType(request.employmentTypeId()))
                .name(request.name())
                .birthDate(request.birthDate())
                .phone(request.phone())
                .email(request.email())
                .address(request.address())
                .hireDate(request.hireDate())
                .employeeStatusCode(request.employeeStatusCode())
                .bankName(request.bankName())
                .accountNumber(request.accountNumber())
                .accountHolder(request.accountHolder())
                .password(passwordEncoder.encode(request.password()))
                .build();

        return EmployeeResponse.from(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponse update(Long employeeId, EmployeeUpdateRequest request) {
        Employee employee = findActive(employeeId);
        if (request.email() != null && !request.email().equals(employee.getEmail())
                && employeeRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.DUPLICATE_EMAIL);
        }

        employee.update(
                resolveDepartment(request.departmentId()),
                resolvePosition(request.positionId()),
                resolveEmploymentType(request.employmentTypeId()),
                request.name(),
                request.birthDate(),
                request.phone(),
                request.email(),
                request.address(),
                request.hireDate(),
                request.resignationDate(),
                request.employeeStatusCode(),
                request.bankName(),
                request.accountNumber(),
                request.accountHolder()
        );

        return EmployeeResponse.from(employee);
    }

    @Transactional
    public void delete(Long employeeId) {
        Employee employee = findActive(employeeId);
        employee.markDeleted();
    }

    private Employee findActive(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND));
    }

    private Department resolveDepartment(Long departmentId) {
        if (departmentId == null) {
            return null;
        }
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND));
    }

    private Position resolvePosition(Long positionId) {
        if (positionId == null) {
            return null;
        }
        return positionRepository.findById(positionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POSITION_NOT_FOUND));
    }

    private EmploymentType resolveEmploymentType(Long employmentTypeId) {
        if (employmentTypeId == null) {
            return null;
        }
        return employmentTypeRepository.findById(employmentTypeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYMENT_TYPE_NOT_FOUND));
    }
}
