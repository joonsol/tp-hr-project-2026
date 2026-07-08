package com.tphr.hr.employmenttype.controller;

import com.tphr.hr.employmenttype.dto.EmploymentTypeRequest;
import com.tphr.hr.employmenttype.dto.EmploymentTypeResponse;
import com.tphr.hr.employmenttype.service.EmploymentTypeService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employment-types")
@RequiredArgsConstructor
public class EmploymentTypeController {

    private final EmploymentTypeService employmentTypeService;

    @GetMapping
    public List<EmploymentTypeResponse> findAll() {
        return employmentTypeService.findAll();
    }

    @GetMapping("/{id}")
    public EmploymentTypeResponse getById(@PathVariable Long id) {
        return employmentTypeService.getById(id);
    }

    @PostMapping
    public ResponseEntity<EmploymentTypeResponse> create(@Valid @RequestBody EmploymentTypeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employmentTypeService.create(request));
    }

    @PutMapping("/{id}")
    public EmploymentTypeResponse update(@PathVariable Long id, @Valid @RequestBody EmploymentTypeRequest request) {
        return employmentTypeService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employmentTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
