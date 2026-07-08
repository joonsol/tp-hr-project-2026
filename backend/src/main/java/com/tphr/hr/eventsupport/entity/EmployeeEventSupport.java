package com.tphr.hr.eventsupport.entity;

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
@Table(name = "employee_event_support")
@SQLRestriction("deleted = false")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeEventSupport extends DeletableEntity {

    public static final String PENDING = "PENDING";
    public static final String APPROVED = "APPROVED";
    public static final String REJECTED = "REJECTED";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_event_support_id")
    private Long employeeEventSupportId;

    @Column(name = "application_no", nullable = false, length = 30, unique = true)
    private String applicationNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "event_type", length = 100)
    private String eventType;

    @Column(name = "family_relation", length = 100)
    private String familyRelation;

    @Column(name = "target_name", length = 100)
    private String targetName;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "requested_amount")
    private Integer requestedAmount;

    @Column(name = "event_location", length = 255)
    private String eventLocation;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "account_number", length = 100)
    private String accountNumber;

    @Column(name = "account_holder", length = 100)
    private String accountHolder;

    @Column(name = "approval_status", nullable = false, length = 30)
    private String approvalStatus = PENDING;

    @Column(name = "memo", length = 1000)
    private String memo;

    @Builder
    public EmployeeEventSupport(String applicationNo, Employee employee, String eventType, String familyRelation,
            String targetName, LocalDate applicationDate, LocalDate eventDate, Integer requestedAmount,
            String eventLocation, String bankName, String accountNumber, String accountHolder, String memo) {
        this.applicationNo = applicationNo;
        this.employee = employee;
        this.eventType = eventType;
        this.familyRelation = familyRelation;
        this.targetName = targetName;
        this.applicationDate = applicationDate;
        this.eventDate = eventDate;
        this.requestedAmount = requestedAmount;
        this.eventLocation = eventLocation;
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.memo = memo;
    }

    public void update(String eventType, String familyRelation, String targetName, LocalDate applicationDate,
            LocalDate eventDate, Integer requestedAmount, String eventLocation, String bankName, String accountNumber,
            String accountHolder, String approvalStatus, String memo) {
        this.eventType = eventType;
        this.familyRelation = familyRelation;
        this.targetName = targetName;
        this.applicationDate = applicationDate;
        this.eventDate = eventDate;
        this.requestedAmount = requestedAmount;
        this.eventLocation = eventLocation;
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.approvalStatus = approvalStatus;
        this.memo = memo;
    }
}
