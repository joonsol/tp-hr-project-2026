package com.tphr.hr.attendance.dto;

import java.util.List;

public record AttendanceSearchResponse(
        List<AttendanceRosterResponse> content,
        AttendanceCounts counts,
        long totalElements,
        int totalPages,
        int number,
        int size
) {
}
