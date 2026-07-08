package com.tphr.hr.attendance.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record AttendanceBulkRequest(
        @NotNull LocalDate workDate,
        @NotEmpty List<Long> employeeIds,
        @NotNull String attendanceStatusCode
) {
}
