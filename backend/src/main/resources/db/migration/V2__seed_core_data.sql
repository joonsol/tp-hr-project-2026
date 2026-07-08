INSERT INTO department (department_id, department_name, parent_department_id)
VALUES (1, '경영지원팀', NULL);

INSERT INTO position (position_id, position_name, level)
VALUES (1, '관리자', 1);

INSERT INTO employment_type (employment_type_id, employment_type_name)
VALUES (1, '정규직');

-- Dev-only seed account. Login: admin@tphr.com / admin1234!
-- Password hash below is BCrypt("admin1234!") — never reuse in a real environment.
INSERT INTO employee (
    employee_id, employee_no, department_id, position_id, employment_type_id,
    name, email, hire_date, employee_status_code, password
) VALUES (
    1, 'ADMIN001', 1, 1, 1,
    '관리자', 'admin@tphr.com', CURRENT_DATE, 'ACTIVE',
    '$2a$10$DCMKrHsPDr3VF1PCx2.AfO9VC9dzAPIRyil.RzPEksXIMLhVzJ422'
);
