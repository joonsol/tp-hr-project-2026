package com.tphr.hr.auth.controller;

import com.tphr.hr.auth.dto.LoginRequest;
import com.tphr.hr.auth.dto.LoginResponse;
import com.tphr.hr.auth.service.AuthService;
import com.tphr.hr.employee.dto.EmployeeResponse;
import com.tphr.hr.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public EmployeeResponse me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return authService.getMe(userDetails.getEmployeeId());
    }
}
