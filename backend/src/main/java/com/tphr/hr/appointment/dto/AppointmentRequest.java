package com.tphr.hr.appointment.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record AppointmentRequest(
        @NotNull Long employeeId,
        String appointmentType,
        LocalDate appointmentDate,
        Long fromDepartmentId,
        Long toDepartmentId,
        String fromPositionName,
        String toPositionName,
        String reason,
        String memo
) {
}
