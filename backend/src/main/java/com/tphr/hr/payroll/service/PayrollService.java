package com.tphr.hr.payroll.service;

import com.tphr.hr.common.exception.BusinessException;
import com.tphr.hr.common.exception.ErrorCode;
import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.employee.repository.EmployeeRepository;
import com.tphr.hr.employee.service.EmployeeSpecifications;
import com.tphr.hr.payroll.dto.PayrollBulkUpsertRequest;
import com.tphr.hr.payroll.dto.PayrollCandidateResponse;
import com.tphr.hr.payroll.dto.PayrollRowResponse;
import com.tphr.hr.payroll.dto.PayrollSummaryResponse;
import com.tphr.hr.payroll.entity.PayrollBaseInfo;
import com.tphr.hr.payroll.repository.PayrollBaseInfoRepository;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PayrollService {

    private final EmployeeRepository employeeRepository;
    private final PayrollBaseInfoRepository payrollBaseInfoRepository;

    public List<PayrollCandidateResponse> searchCandidates(String keyword, String status) {
        var spec = EmployeeSpecifications.search(keyword, null, null, Employee.STATUS_ACTIVE);
        List<Employee> employees = employeeRepository.findAll(spec, Sort.by("name"));
        List<Long> ids = employees.stream().map(Employee::getEmployeeId).toList();

        Set<Long> registeredIds = ids.isEmpty() ? Set.of() : payrollBaseInfoRepository
                .findByEmployee_EmployeeIdInAndEffectiveDateLessThanEqual(ids, LocalDate.now()).stream()
                .map(p -> p.getEmployee().getEmployeeId())
                .collect(Collectors.toSet());

        return employees.stream()
                .map(e -> new PayrollCandidateResponse(
                        e.getEmployeeId(), e.getEmployeeNo(), e.getName(),
                        e.getDepartment() != null ? e.getDepartment().getDepartmentName() : null,
                        e.getPosition() != null ? e.getPosition().getPositionName() : null,
                        e.getHireDate(), registeredIds.contains(e.getEmployeeId())))
                .filter(c -> switch (status) {
                    case "REGISTERED" -> c.registered();
                    case "UNREGISTERED" -> !c.registered();
                    default -> true;
                })
                .toList();
    }

    public PayrollSummaryResponse getSummary(Long departmentId, Long positionId, String keyword, LocalDate asOfDate) {
        var spec = EmployeeSpecifications.search(keyword, departmentId, positionId, Employee.STATUS_ACTIVE);
        List<Employee> employees = employeeRepository.findAll(spec, Sort.by("name"));
        List<Long> ids = employees.stream().map(Employee::getEmployeeId).toList();

        Map<Long, PayrollBaseInfo> currentByEmployee = new HashMap<>();
        if (!ids.isEmpty()) {
            for (PayrollBaseInfo p : payrollBaseInfoRepository.findByEmployee_EmployeeIdInAndEffectiveDateLessThanEqual(ids, asOfDate)) {
                currentByEmployee.merge(p.getEmployee().getEmployeeId(), p,
                        (a, b) -> a.getEffectiveDate().isAfter(b.getEffectiveDate()) ? a : b);
            }
        }

        List<PayrollRowResponse> rows = employees.stream()
                .filter(e -> currentByEmployee.containsKey(e.getEmployeeId()))
                .map(e -> toRow(e, currentByEmployee.get(e.getEmployeeId())))
                .toList();

        long totalBaseSalary = rows.stream().mapToLong(PayrollRowResponse::baseSalary).sum();
        long averageBaseSalary = rows.isEmpty() ? 0 : totalBaseSalary / rows.size();
        PayrollRowResponse maxRow = rows.stream().max(Comparator.comparingLong(PayrollRowResponse::baseSalary)).orElse(null);
        long totalAllowance = rows.stream().mapToLong(PayrollRowResponse::allowanceTotal).sum();

        return new PayrollSummaryResponse(
                averageBaseSalary,
                maxRow != null ? maxRow.baseSalary() : 0,
                maxRow != null ? maxRow.name() : null,
                maxRow != null ? maxRow.positionName() : null,
                totalBaseSalary,
                totalAllowance,
                rows.size(),
                employees.size() - rows.size(),
                employees.size(),
                rows
        );
    }

    public List<PayrollRowResponse> getHistory(Long employeeId) {
        Employee employee = findEmployee(employeeId);
        return payrollBaseInfoRepository.findByEmployee_EmployeeIdOrderByEffectiveDateDesc(employeeId).stream()
                .map(info -> toRow(employee, info))
                .toList();
    }

    @Transactional
    public void bulkUpsert(PayrollBulkUpsertRequest request) {
        long positionAllowance = nz(request.positionAllowance());
        long mealAllowance = nz(request.mealAllowance());
        long transportAllowance = nz(request.transportAllowance());

        for (Long employeeId : request.employeeIds()) {
            Employee employee = findEmployee(employeeId);
            PayrollBaseInfo info = payrollBaseInfoRepository
                    .findByEmployee_EmployeeIdAndEffectiveDate(employeeId, request.effectiveDate())
                    .orElseGet(() -> new PayrollBaseInfo(employee, request.baseSalary(), positionAllowance,
                            mealAllowance, transportAllowance, request.paymentMethodCode(), request.paymentDay(),
                            request.effectiveDate()));
            info.update(request.baseSalary(), positionAllowance, mealAllowance, transportAllowance,
                    request.paymentMethodCode(), request.paymentDay(), request.effectiveDate());
            payrollBaseInfoRepository.save(info);
        }
    }

    private long nz(Long value) {
        return value != null ? value : 0L;
    }

    private Employee findEmployee(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND));
    }

    private PayrollRowResponse toRow(Employee e, PayrollBaseInfo info) {
        long base = info.getBaseSalary();
        long positionAllowance = info.getPositionAllowance();
        long mealAllowance = info.getMealAllowance();
        long transportAllowance = info.getTransportAllowance();
        long allowanceTotal = positionAllowance + mealAllowance + transportAllowance;

        long pension = PayrollDeductionCalculator.pension(base);
        long health = PayrollDeductionCalculator.healthInsurance(base);
        long employment = PayrollDeductionCalculator.employmentInsurance(base);
        long incomeTax = PayrollDeductionCalculator.incomeTax(base + positionAllowance);
        long deductionTotal = pension + health + employment + incomeTax;

        long totalPayment = base + allowanceTotal;
        long netPay = totalPayment - deductionTotal;

        return new PayrollRowResponse(
                e.getEmployeeId(), e.getEmployeeNo(), e.getName(),
                e.getDepartment() != null ? e.getDepartment().getDepartmentName() : null,
                e.getPosition() != null ? e.getPosition().getPositionName() : null,
                base, mealAllowance, transportAllowance, positionAllowance, allowanceTotal,
                pension, health, employment, incomeTax, deductionTotal,
                totalPayment, netPay,
                e.getBankName(), e.getAccountNumber(), info.getEffectiveDate()
        );
    }
}
