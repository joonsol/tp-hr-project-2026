package com.tphr.hr.attendance.controller;

import com.tphr.hr.attendance.dto.AttendanceBulkRequest;
import com.tphr.hr.attendance.dto.AttendanceRosterResponse;
import com.tphr.hr.attendance.dto.AttendanceSearchResponse;
import com.tphr.hr.attendance.dto.AttendanceUpsertRequest;
import com.tphr.hr.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public AttendanceSearchResponse search(
            @RequestParam LocalDate workDate,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        return attendanceService.search(workDate, departmentId, keyword, pageable);
    }

    @PostMapping
    public AttendanceRosterResponse upsert(@Valid @RequestBody AttendanceUpsertRequest request) {
        return attendanceService.upsert(request);
    }

    @PostMapping("/bulk")
    public void bulkUpsert(@Valid @RequestBody AttendanceBulkRequest request) {
        attendanceService.bulkUpsert(request);
    }
}
