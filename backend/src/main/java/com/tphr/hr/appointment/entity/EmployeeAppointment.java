package com.tphr.hr.appointment.entity;

import com.tphr.hr.common.entity.DeletableEntity;
import com.tphr.hr.department.entity.Department;
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
@Table(name = "employee_appointment")
@SQLRestriction("deleted = false")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class EmployeeAppointment extends DeletableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_appointment_id")
    private Long employeeAppointmentId;

    @Column(name = "appointment_no", nullable = false, length = 30, unique = true)
    private String appointmentNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "appointment_type", length = 50)
    private String appointmentType;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_department_id")
    private Department fromDepartment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_department_id")
    private Department toDepartment;

    @Column(name = "from_position_name", length = 100)
    private String fromPositionName;

    @Column(name = "to_position_name", length = 100)
    private String toPositionName;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "memo", length = 1000)
    private String memo;

    @Column(name = "registered_by", length = 100)
    private String registeredBy;

    @Builder
    public EmployeeAppointment(String appointmentNo, Employee employee, String appointmentType, LocalDate appointmentDate,
            Department fromDepartment, Department toDepartment, String fromPositionName, String toPositionName,
            String reason, String memo, String registeredBy) {
        this.appointmentNo = appointmentNo;
        this.employee = employee;
        this.appointmentType = appointmentType;
        this.appointmentDate = appointmentDate;
        this.fromDepartment = fromDepartment;
        this.toDepartment = toDepartment;
        this.fromPositionName = fromPositionName;
        this.toPositionName = toPositionName;
        this.reason = reason;
        this.memo = memo;
        this.registeredBy = registeredBy;
    }

    public void update(String appointmentType, LocalDate appointmentDate, Department fromDepartment, Department toDepartment,
            String fromPositionName, String toPositionName, String reason, String memo) {
        this.appointmentType = appointmentType;
        this.appointmentDate = appointmentDate;
        this.fromDepartment = fromDepartment;
        this.toDepartment = toDepartment;
        this.fromPositionName = fromPositionName;
        this.toPositionName = toPositionName;
        this.reason = reason;
        this.memo = memo;
    }
}
