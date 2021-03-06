DROP DATABASE IF EXISTS teamMate;

CREATE DATABASE teamMate; 
USE teamMate;   

CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR (33) NOT NULL 
);



CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    departments_id INTEGER,
    salery DECIMAL, 
    title VARCHAR (33) NOT NULL, 
    FOREIGN KEY (departments_id) REFERENCES departments(id)
);



CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR (33) NOT NULL, 
    last_name VARCHAR (33) NOT NULL, 
    role_id INTEGER, 
    managers_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
    FOREIGN KEY (managers_id) REFERENCES employees(id)
);


