package com.tphr.hr.attendance.entity;

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
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

@Getter
@Entity
@Table(name = "attendance")
@SQLRestriction("deleted = false")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Attendance extends BaseEntity {

    public static final String CHECK_IN = "CHECK_IN";
    public static final String LATE = "LATE";
    public static final String EARLY_LEAVE = "EARLY_LEAVE";
    public static final String ABSENT = "ABSENT";
    public static final String ANNUAL_LEAVE = "ANNUAL_LEAVE";
    public static final String HALF_DAY = "HALF_DAY";
    public static final String CHECK_OUT = "CHECK_OUT";
    public static final String TRAINING = "TRAINING";
    public static final String OFFICIAL_LEAVE = "OFFICIAL_LEAVE";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Long attendanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "work_date", nullable = false)
    private LocalDate workDate;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "work_minutes")
    private Integer workMinutes;

    @Column(name = "overtime_minutes")
    private Integer overtimeMinutes;

    @Column(name = "night_work_minutes")
    private Integer nightWorkMinutes;

    @Column(name = "late_minutes")
    private Integer lateMinutes;

    @Column(name = "early_leave_minutes")
    private Integer earlyLeaveMinutes;

    @Column(name = "attendance_status_code", length = 30)
    private String attendanceStatusCode;

    @Column(name = "memo", length = 500)
    private String memo;

    public Attendance(Employee employee, LocalDate workDate) {
        this.employee = employee;
        this.workDate = workDate;
    }

    public void update(String attendanceStatusCode, LocalDateTime checkInTime, LocalDateTime checkOutTime, String memo) {
        this.attendanceStatusCode = attendanceStatusCode;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.memo = memo;
    }
}
