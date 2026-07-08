package com.tphr.hr.certificateissue.service;

import com.tphr.hr.certificateissue.dto.CertificateIssueRequest;
import com.tphr.hr.certificateissue.dto.CertificateIssueResponse;
import com.tphr.hr.certificateissue.entity.EmployeeCertificateIssue;
import com.tphr.hr.certificateissue.repository.EmployeeCertificateIssueRepository;
import com.tphr.hr.common.exception.BusinessException;
import com.tphr.hr.common.exception.ErrorCode;
import com.tphr.hr.common.util.DocumentNumberGenerator;
import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CertificateIssueService {

    private static final String PREFIX = "CERT";

    private final EmployeeCertificateIssueRepository certificateIssueRepository;
    private final EmployeeRepository employeeRepository;

    public Page<CertificateIssueResponse> search(String keyword, String issueStatus, String approvalStatus, Pageable pageable) {
        return certificateIssueRepository
                .findAll(CertificateIssueSpecifications.search(keyword, issueStatus, approvalStatus), pageable)
                .map(CertificateIssueResponse::from);
    }

    public CertificateIssueResponse getById(Long id) {
        return CertificateIssueResponse.from(findActive(id));
    }

    @Transactional
    public CertificateIssueResponse create(CertificateIssueRequest request) {
        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND));

        String yearPrefix = DocumentNumberGenerator.prefixForThisYear(PREFIX);
        long count = certificateIssueRepository.countByApplicationNoStartingWith(yearPrefix);
        String applicationNo = DocumentNumberGenerator.next(yearPrefix, count);

        EmployeeCertificateIssue certificateIssue = EmployeeCertificateIssue.builder()
                .applicationNo(applicationNo)
                .employee(employee)
                .certificateType(request.certificateType())
                .applicationDate(request.applicationDate())
                .purpose(request.purpose())
                .memo(request.memo())
                .build();

        return CertificateIssueResponse.from(certificateIssueRepository.save(certificateIssue));
    }

    @Transactional
    public CertificateIssueResponse update(Long id, CertificateIssueRequest request) {
        EmployeeCertificateIssue certificateIssue = findActive(id);
        Employee approver = resolveApprover(request.approverId());
        certificateIssue.update(
                request.certificateType(),
                request.applicationDate(),
                request.issueStatus() != null ? request.issueStatus() : certificateIssue.getIssueStatus(),
                request.approvalStatus() != null ? request.approvalStatus() : certificateIssue.getApprovalStatus(),
                approver,
                request.purpose(),
                request.memo()
        );
        return CertificateIssueResponse.from(certificateIssue);
    }

    @Transactional
    public void delete(Long id) {
        findActive(id).markDeleted();
    }

    private EmployeeCertificateIssue findActive(Long id) {
        return certificateIssueRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CERTIFICATE_ISSUE_NOT_FOUND));
    }

    private Employee resolveApprover(Long approverId) {
        if (approverId == null) {
            return null;
        }
        return employeeRepository.findById(approverId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND));
    }
}
