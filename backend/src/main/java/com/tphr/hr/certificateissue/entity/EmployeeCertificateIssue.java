package com.tphr.hr.certificateissue.entity;

import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.employee.entity.Employee;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

@Getter
@Entity
@Table(name = "employee_certificate_issue")
@SQLRestriction("deleted = false")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeCertificateIssue extends DeletableEntity {

    public static final String REQUESTED = "REQUESTED";
    public static final String ISSUED = "ISSUED";

    public static final String PENDING = "PENDING";
    public static final String APPROVED = "APPROVED";
    public static final String REJECTED = "REJECTED";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_certificate_issue_id")
    private Long employeeCertificateIssueId;

    @Column(name = "application_no", nullable = false, length = 30, unique = true)
    private String applicationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "certificate_type", length = 100)
    private String certificateType;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    @Column(name = "issue_status", nullable = false, length = 30)
    private String issueStatus = REQUESTED;

    @Column(name = "approval_status", nullable = false, length = 30)
    private String approvalStatus = PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private Employee approver;

    @Column(name = "purpose", length = 500)
    private String purpose;

    @Column(name = "memo", length = 1000)
    private String memo;

    @Builder
    public EmployeeCertificateIssue(String applicationNo, Employee employee, String certificateType,
            LocalDate applicationDate, String purpose, String memo) {
        this.applicationNo = applicationNo;
        this.employee = employee;
        this.certificateType = certificateType;
        this.applicationDate = applicationDate;
        this.purpose = purpose;
        this.memo = memo;
    }

    public void update(String certificateType, LocalDate applicationDate, String issueStatus, String approvalStatus,
            Employee approver, String purpose, String memo) {
        this.certificateType = certificateType;
        this.applicationDate = applicationDate;
        this.issueStatus = issueStatus;
        this.approvalStatus = approvalStatus;
        this.approver = approver;
        this.purpose = purpose;
        this.memo = memo;
    }
}
