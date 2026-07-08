CREATE TABLE department (
    department_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_name      VARCHAR(100) NOT NULL,
    parent_department_id BIGINT NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted               BOOLEAN NOT NULL DEFAULT FALSE,
    active                BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_department_parent FOREIGN KEY (parent_department_id)
        REFERENCES department (department_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE position (
    position_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    position_name VARCHAR(100) NOT NULL,
    level         INT NULL,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted       BOOLEAN NOT NULL DEFAULT FALSE,
    active        BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE employment_type (
    employment_type_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    employment_type_name VARCHAR(100) NOT NULL,
    created_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted                BOOLEAN NOT NULL DEFAULT FALSE,
    active                 BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE employee (
    employee_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_no          VARCHAR(30) NOT NULL,
    department_id        BIGINT NULL,
    position_id          BIGINT NULL,
    employment_type_id   BIGINT NULL,
    name                  VARCHAR(100) NOT NULL,
    birth_date            DATE NULL,
    phone                 VARCHAR(30) NULL,
    email                 VARCHAR(100) NULL,
    address               VARCHAR(255) NULL,
    hire_date             DATE NULL,
    resignation_date      DATE NULL,
    employee_status_code  VARCHAR(30) NULL,
    bank_name             VARCHAR(100) NULL,
    account_number        VARCHAR(100) NULL,
    account_holder        VARCHAR(100) NULL,
    password              VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_employee_no UNIQUE (employee_no),
    CONSTRAINT uq_employee_email UNIQUE (email),
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES department (department_id),
    CONSTRAINT fk_employee_position FOREIGN KEY (position_id) REFERENCES position (position_id),
    CONSTRAINT fk_employee_employment_type FOREIGN KEY (employment_type_id) REFERENCES employment_type (employment_type_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE INDEX idx_employee_department ON employee (department_id);
CREATE INDEX idx_employee_status ON employee (employee_status_code);
