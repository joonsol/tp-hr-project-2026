CREATE TABLE attendance (
    attendance_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id            BIGINT NOT NULL,
    work_date              DATE NOT NULL,
    check_in_time          DATETIME NULL,
    check_out_time         DATETIME NULL,
    work_minutes           INT NULL,
    overtime_minutes       INT NULL,
    night_work_minutes     INT NULL,
    late_minutes           INT NULL,
    early_leave_minutes    INT NULL,
    attendance_status_code VARCHAR(30) NULL,
    memo                   VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_attendance_employee_date UNIQUE (employee_id, work_date),
    CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_attendance_work_date ON attendance (work_date);

CREATE TABLE employee_appointment (
    employee_appointment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    appointment_no           VARCHAR(30) NOT NULL,
    employee_id              BIGINT NOT NULL,
    appointment_type         VARCHAR(50) NULL,
    appointment_date         DATE NULL,
    from_department_id       BIGINT NULL,
    to_department_id         BIGINT NULL,
    from_position_name       VARCHAR(100) NULL,
    to_position_name         VARCHAR(100) NULL,
    reason                   VARCHAR(500) NULL,
    memo                     VARCHAR(1000) NULL,
    registered_by            VARCHAR(100) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_appointment_no UNIQUE (appointment_no),
    CONSTRAINT fk_appointment_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
    CONSTRAINT fk_appointment_from_department FOREIGN KEY (from_department_id) REFERENCES department (department_id),
    CONSTRAINT fk_appointment_to_department FOREIGN KEY (to_department_id) REFERENCES department (department_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE employee_event_support (
    employee_event_support_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_no             VARCHAR(30) NOT NULL,
    employee_id                 BIGINT NOT NULL,
    event_type                  VARCHAR(100) NULL,
    family_relation             VARCHAR(100) NULL,
    target_name                 VARCHAR(100) NULL,
    application_date            DATE NULL,
    event_date                  DATE NULL,
    requested_amount            INT NULL,
    event_location               VARCHAR(255) NULL,
    bank_name                    VARCHAR(100) NULL,
    account_number               VARCHAR(100) NULL,
    account_holder               VARCHAR(100) NULL,
    approval_status               VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    memo                          VARCHAR(1000) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_event_support_application_no UNIQUE (application_no),
    CONSTRAINT fk_event_support_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE employee_certificate_issue (
    employee_certificate_issue_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_no                 VARCHAR(30) NOT NULL,
    employee_id                     BIGINT NOT NULL,
    certificate_type                VARCHAR(100) NULL,
    application_date                DATE NULL,
    issue_status                     VARCHAR(30) NOT NULL DEFAULT 'REQUESTED',
    approval_status                   VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    approver_id                       BIGINT NULL,
    purpose                           VARCHAR(500) NULL,
    memo                              VARCHAR(1000) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_certificate_issue_application_no UNIQUE (application_no),
    CONSTRAINT fk_certificate_issue_employee FOREIGN KEY (employee_id) REFERENCES employee (employee_id),
    CONSTRAINT fk_certificate_issue_approver FOREIGN KEY (approver_id) REFERENCES employee (employee_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
