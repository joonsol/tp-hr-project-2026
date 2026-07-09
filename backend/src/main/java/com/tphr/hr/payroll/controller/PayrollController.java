package com.tphr.hr.payroll.controller;

import com.tphr.hr.payroll.dto.PayrollBulkUpsertRequest;
import com.tphr.hr.payroll.dto.PayrollCandidateResponse;
import com.tphr.hr.payroll.dto.PayrollRowResponse;
import com.tphr.hr.payroll.dto.PayrollSummaryResponse;
import com.tphr.hr.payroll.service.PayrollService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payroll/base-info")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping("/candidates")
    public List<PayrollCandidateResponse> candidates(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        return payrollService.searchCandidates(keyword, status);
    }

    @GetMapping
    public PayrollSummaryResponse list(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long positionId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) LocalDate asOfDate) {
        return payrollService.getSummary(departmentId, positionId, keyword, asOfDate != null ? asOfDate : LocalDate.now());
    }

    @PostMapping
    public void register(@Valid @RequestBody PayrollBulkUpsertRequest request) {
        payrollService.bulkUpsert(request);
    }

    @GetMapping("/{employeeId}/history")
    public List<PayrollRowResponse> history(@PathVariable Long employeeId) {
        return payrollService.getHistory(employeeId);
    }
}
