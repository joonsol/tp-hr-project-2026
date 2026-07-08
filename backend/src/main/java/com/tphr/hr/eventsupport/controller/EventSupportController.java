package com.tphr.hr.eventsupport.controller;

import com.tphr.hr.eventsupport.dto.EventSupportRequest;
import com.tphr.hr.eventsupport.dto.EventSupportResponse;
import com.tphr.hr.eventsupport.service.EventSupportService;
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
@RequestMapping("/api/event-supports")
@RequiredArgsConstructor
public class EventSupportController {

    private final EventSupportService eventSupportService;

    @GetMapping
    public Page<EventSupportResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String approvalStatus,
            Pageable pageable) {
        return eventSupportService.search(keyword, approvalStatus, pageable);
    }

    @GetMapping("/{id}")
    public EventSupportResponse getById(@PathVariable Long id) {
        return eventSupportService.getById(id);
    }

    @PostMapping
    public ResponseEntity<EventSupportResponse> create(@Valid @RequestBody EventSupportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventSupportService.create(request));
    }

    @PutMapping("/{id}")
    public EventSupportResponse update(@PathVariable Long id, @Valid @RequestBody EventSupportRequest request) {
        return eventSupportService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        eventSupportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
