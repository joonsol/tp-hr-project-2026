CREATE TABLE payroll_base_info (
    payroll_base_info_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id          BIGINT NOT NULL,
    base_salary           BIGINT NOT NULL,
    position_allowance     BIGINT NOT NULL DEFAULT 0,
    meal_allowance          BIGINT NOT NULL DEFAULT 0,
    transport_allowance      BIGINT NOT NULL DEFAULT 0,
    payment_method_code       VARCHAR(30) NOT NULL DEFAULT 'BANK_TRANSFER',
    payment_day                INT NOT NULL DEFAULT 10,
    effective_date              DATE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_payroll_base_info_employee_date UNIQUE (employee_id, effective_date),
    CONSTRAINT fk_payroll_base_info_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_payroll_base_info_effective_date ON payroll_base_info (effective_date);
