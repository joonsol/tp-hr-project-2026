package com.tphr.hr.appointment.repository;

import com.tphr.hr.appointment.entity.EmployeeAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EmployeeAppointmentRepository
        extends JpaRepository<EmployeeAppointment, Long>, JpaSpecificationExecutor<EmployeeAppointment> {

    long countByAppointmentNoStartingWith(String prefix);
}
