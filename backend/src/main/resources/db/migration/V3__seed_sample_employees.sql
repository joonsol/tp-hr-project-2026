-- Sample employees for local testing. All share the password: admin1234!
-- (same BCrypt hash as the seeded ADMIN001 account in V2)
INSERT INTO employee (
    employee_no, department_id, position_id, employment_type_id,
    name, email, phone, hire_date, employee_status_code, password
) VALUES
    ('EMP101', 1, 1, 1, '김철수', 'kim.cs@tphr.com', '010-1111-2222', '2023-03-02', 'ACTIVE', '$2a$10$DCMKrHsPDr3VF1PCx2.AfO9VC9dzAPIRyil.RzPEksXIMLhVzJ422'),
    ('EMP102', 2, 1, 1, '이영희', 'lee.yh@tphr.com', '010-2222-3333', '2023-06-15', 'ACTIVE', '$2a$10$DCMKrHsPDr3VF1PCx2.AfO9VC9dzAPIRyil.RzPEksXIMLhVzJ422'),
    ('EMP103', 2, 1, 1, '박민수', 'park.ms@tphr.com', '010-3333-4444', '2024-01-08', 'ACTIVE', '$2a$10$DCMKrHsPDr3VF1PCx2.AfO9VC9dzAPIRyil.RzPEksXIMLhVzJ422'),
    ('EMP104', 3, 1, 1, '최지은', 'choi.je@tphr.com', '010-4444-5555', '2024-04-22', 'ACTIVE', '$2a$10$DCMKrHsPDr3VF1PCx2.AfO9VC9dzAPIRyil.RzPEksXIMLhVzJ422'),
    ('EMP105', 3, 1, 1, '정다솔', 'jung.ds@tphr.com', '010-5555-6666', '2025-02-10', 'ACTIVE', '$2a$10$DCMKrHsPDr3VF1PCx2.AfO9VC9dzAPIRyil.RzPEksXIMLhVzJ422');
