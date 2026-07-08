package com.tphr.hr.eventsupport.service;

import com.tphr.hr.common.exception.BusinessException;
import com.tphr.hr.common.exception.ErrorCode;
import com.tphr.hr.common.util.DocumentNumberGenerator;
import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.employee.repository.EmployeeRepository;
import com.tphr.hr.eventsupport.dto.EventSupportRequest;
import com.tphr.hr.eventsupport.dto.EventSupportResponse;
import com.tphr.hr.eventsupport.entity.EmployeeEventSupport;
import com.tphr.hr.eventsupport.repository.EmployeeEventSupportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EventSupportService {

    private static final String PREFIX = "EVT";

    private final EmployeeEventSupportRepository eventSupportRepository;
    private final EmployeeRepository employeeRepository;

    public Page<EventSupportResponse> search(String keyword, String approvalStatus, Pageable pageable) {
        return eventSupportRepository.findAll(EventSupportSpecifications.search(keyword, approvalStatus), pageable)
                .map(EventSupportResponse::from);
    }

    public EventSupportResponse getById(Long id) {
        return EventSupportResponse.from(findActive(id));
    }

    @Transactional
    public EventSupportResponse create(EventSupportRequest request) {
        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND));

        String yearPrefix = DocumentNumberGenerator.prefixForThisYear(PREFIX);
        long count = eventSupportRepository.countByApplicationNoStartingWith(yearPrefix);
        String applicationNo = DocumentNumberGenerator.next(yearPrefix, count);

        EmployeeEventSupport eventSupport = EmployeeEventSupport.builder()
                .applicationNo(applicationNo)
                .employee(employee)
                .eventType(request.eventType())
                .familyRelation(request.familyRelation())
                .targetName(request.targetName())
                .applicationDate(request.applicationDate())
                .eventDate(request.eventDate())
                .requestedAmount(request.requestedAmount())
                .eventLocation(request.eventLocation())
                .bankName(request.bankName())
                .accountNumber(request.accountNumber())
                .accountHolder(request.accountHolder())
                .memo(request.memo())
                .build();

        return EventSupportResponse.from(eventSupportRepository.save(eventSupport));
    }

    @Transactional
    public EventSupportResponse update(Long id, EventSupportRequest request) {
        EmployeeEventSupport eventSupport = findActive(id);
        eventSupport.update(
                request.eventType(), request.familyRelation(), request.targetName(),
                request.applicationDate(), request.eventDate(), request.requestedAmount(),
                request.eventLocation(), request.bankName(), request.accountNumber(), request.accountHolder(),
                request.approvalStatus() != null ? request.approvalStatus() : eventSupport.getApprovalStatus(),
                request.memo()
        );
        return EventSupportResponse.from(eventSupport);
    }

    @Transactional
    public void delete(Long id) {
        findActive(id).markDeleted();
    }

    private EmployeeEventSupport findActive(Long id) {
        return eventSupportRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_SUPPORT_NOT_FOUND));
    }
}
