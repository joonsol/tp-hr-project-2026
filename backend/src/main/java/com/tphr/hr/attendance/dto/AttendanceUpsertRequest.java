package com.tphr.hr.attendance.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record AttendanceUpsertRequest(
        @NotNull Long employeeId,
        @NotNull LocalDate workDate,
        String attendanceStatusCode,
        LocalDateTime checkInTime,
        LocalDateTime checkOutTime,
        String memo
) {
}
