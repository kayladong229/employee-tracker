INSERT INTO department (name)
VALUES ("Billing"),
       ("Customer Service"),
       ("Human Resources"),
       ("Information Technology");

INSERT INTO role (title, salary, department_id)
VALUES ("Billing Manager", 90000, 1),
       ("Billing Clerk", 50000, 1),
       ("Customer Service Lead", 65000, 2),
       ("Customer Service Representative", 30000, 2),
       ("HR Manager", 75000, 3),
       ("Payroll Clerk", 45000, 3),
       ("IT Lead", 80000, 4),
       ("Help Desk Analyst", 35000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Hannah", "Kim", 1, null),
       ("John", "Doe", 2, 1),
       ("Mohammed", "Hakim", 3, null),
       ("Victoria", "Gonzalez", 4, 3),
       ("Lisa", "Jones", 5, null),
       ("Kenji", "Kobayashi", 6, 5),
       ("Leonardo", "Torres", 7, null),
       ("Daisy", "Phillips", 8, 7);

-- Call tables
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
        