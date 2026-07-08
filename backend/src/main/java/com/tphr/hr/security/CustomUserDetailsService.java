package com.tphr.hr.security;

import com.tphr.hr.employee.entity.Employee;
import com.tphr.hr.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * "username" here is the employeeId (as a string), since the JWT subject is the employee id
 * and there is no separate username-based form login in this API.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String employeeId) throws UsernameNotFoundException {
        Long id;
        try {
            id = Long.valueOf(employeeId);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Invalid employee id: " + employeeId);
        }
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Employee not found: " + employeeId));
        return new CustomUserDetails(employee);
    }
}
