package com.tphr.hr.auth.service;

import com.tphr.hr.auth.dto.LoginRequest;
import com.tphr.hr.auth.dto.LoginResponse;
import com.tphr.hr.common.exception.BusinessException;
import com.tphr.hr.common.exception.ErrorCode;
import com.tphr.hr.employee.dto.EmployeeResponse;
import com.tphr.hr.employee.dto.EmployeeSummaryResponse;
import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.employee.repository.EmployeeRepository;
import com.tphr.hr.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponse login(LoginRequest request) {
        Employee employee = employeeRepository.findByEmployeeNoOrEmail(request.loginId(), request.loginId())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.password(), employee.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
        if (!employee.isLoginable()) {
            throw new BusinessException(ErrorCode.ACCOUNT_INACTIVE);
        }

        String token = jwtTokenProvider.createToken(employee.getEmployeeId());
        return LoginResponse.of(token, jwtTokenProvider.getExpirationMs(), EmployeeSummaryResponse.from(employee));
    }

    public EmployeeResponse getMe(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EMPLOYEE_NOT_FOUND));
        return EmployeeResponse.from(employee);
    }
}
