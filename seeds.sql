INSERT INTO departments (name)
VALUES 
("Human Resource"),
("Marketing"),
("Finance"),
("Tech");

INSERT INTO roles (departments_id, salery, title)
VALUES
(4, 80000.00, "Software Engineer"),
(3, 80000.00, "Accountant"),
(2, 80000.00, "The Dude"),
(1, 80000.00, "Tobe");
INSERT INTO managers (first_name, last_name, role_id)
VALUES
("Buster", "Posey", 1);
INSERT INTO employees (first_name, last_name, role_id, managers_id),
VALUES
("Buster", "Posey", 1, NULL),
("Brandon", "Belt", 2, 1),
("Donovan", "Solano", 3, 1),
("Brandon", "Crawford", 4, 1);

