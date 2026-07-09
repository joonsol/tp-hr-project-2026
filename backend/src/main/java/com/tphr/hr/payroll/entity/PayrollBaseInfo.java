package com.tphr.hr.payroll.entity;

import com.tphr.hr.common.entity.BaseEntity;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

@Getter
@Entity
@Table(name = "payroll_base_info")
@SQLRestriction("deleted = false")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PayrollBaseInfo extends BaseEntity {

    public static final String BANK_TRANSFER = "BANK_TRANSFER";
    public static final String CASH = "CASH";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payroll_base_info_id")
    private Long payrollBaseInfoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "base_salary", nullable = false)
    private Long baseSalary;

    @Column(name = "position_allowance", nullable = false)
    private Long positionAllowance;

    @Column(name = "meal_allowance", nullable = false)
    private Long mealAllowance;

    @Column(name = "transport_allowance", nullable = false)
    private Long transportAllowance;

    @Column(name = "payment_method_code", nullable = false, length = 30)
    private String paymentMethodCode;

    @Column(name = "payment_day", nullable = false)
    private Integer paymentDay;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    public PayrollBaseInfo(Employee employee, Long baseSalary, Long positionAllowance, Long mealAllowance,
            Long transportAllowance, String paymentMethodCode, Integer paymentDay, LocalDate effectiveDate) {
        this.employee = employee;
        this.baseSalary = baseSalary;
        this.positionAllowance = positionAllowance;
        this.mealAllowance = mealAllowance;
        this.transportAllowance = transportAllowance;
        this.paymentMethodCode = paymentMethodCode;
        this.paymentDay = paymentDay;
        this.effectiveDate = effectiveDate;
    }

    public void update(Long baseSalary, Long positionAllowance, Long mealAllowance, Long transportAllowance,
            String paymentMethodCode, Integer paymentDay, LocalDate effectiveDate) {
        this.baseSalary = baseSalary;
        this.positionAllowance = positionAllowance;
        this.mealAllowance = mealAllowance;
        this.transportAllowance = transportAllowance;
        this.paymentMethodCode = paymentMethodCode;
        this.paymentDay = paymentDay;
        this.effectiveDate = effectiveDate;
    }
}
