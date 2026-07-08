package com.tphr.hr.appointment.dto;

import com.tphr.hr.appointment.entity.EmployeeAppointment;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record AppointmentResponse(
        Long employeeAppointmentId,
        String appointmentNo,
        Long employeeId,
        String employeeNo,
        String employeeName,
        String appointmentType,
        LocalDate appointmentDate,
        Long fromDepartmentId,
        String fromDepartmentName,
        Long toDepartmentId,
        String toDepartmentName,
        String fromPositionName,
        String toPositionName,
        String reason,
        String memo,
        String registeredBy,
        LocalDateTime createdAt
) {

    public static AppointmentResponse from(EmployeeAppointment a) {
        return new AppointmentResponse(
                a.getEmployeeAppointmentId(),
                a.getAppointmentNo(),
                a.getEmployee().getEmployeeId(),
                a.getEmployee().getEmployeeNo(),
                a.getEmployee().getName(),
                a.getAppointmentType(),
                a.getAppointmentDate(),
                a.getFromDepartment() != null ? a.getFromDepartment().getDepartmentId() : null,
                a.getFromDepartment() != null ? a.getFromDepartment().getDepartmentName() : null,
                a.getToDepartment() != null ? a.getToDepartment().getDepartmentId() : null,
                a.getToDepartment() != null ? a.getToDepartment().getDepartmentName() : null,
                a.getFromPositionName(),
                a.getToPositionName(),
                a.getReason(),
                a.getMemo(),
                a.getRegisteredBy(),
                a.getCreatedAt()
        );
    }
}
