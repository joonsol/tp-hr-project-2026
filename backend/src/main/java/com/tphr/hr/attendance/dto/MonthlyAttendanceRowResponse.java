package com.tphr.hr.attendance.dto;

import java.util.Map;

public record MonthlyAttendanceRowResponse(
        Long employeeId,
        String employeeNo,
        String name,
        String departmentName,
        Map<Integer, String> days,
        long checkIn,
        long late,
        long annualLeave,
        long absent
) {
}
