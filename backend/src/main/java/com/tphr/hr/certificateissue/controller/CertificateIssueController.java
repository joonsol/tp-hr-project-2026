package com.tphr.hr.certificateissue.controller;

import com.tphr.hr.certificateissue.dto.CertificateIssueRequest;
import com.tphr.hr.certificateissue.dto.CertificateIssueResponse;
import com.tphr.hr.certificateissue.service.CertificateIssueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/certificate-issues")
@RequiredArgsConstructor
public class CertificateIssueController {

    private final CertificateIssueService certificateIssueService;

    @GetMapping
    public Page<CertificateIssueResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String issueStatus,
            @RequestParam(required = false) String approvalStatus,
            Pageable pageable) {
        return certificateIssueService.search(keyword, issueStatus, approvalStatus, pageable);
    }

    @GetMapping("/{id}")
    public CertificateIssueResponse getById(@PathVariable Long id) {
        return certificateIssueService.getById(id);
    }

    @PostMapping
    public ResponseEntity<CertificateIssueResponse> create(@Valid @RequestBody CertificateIssueRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(certificateIssueService.create(request));
    }

    @PutMapping("/{id}")
    public CertificateIssueResponse update(@PathVariable Long id, @Valid @RequestBody CertificateIssueRequest request) {
        return certificateIssueService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        certificateIssueService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
