
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const { prompt } = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: 'root',
        // Your MySQL password
        password: 'ClarkBeauxRocky1472!',
        database: 'teamMate'
    }

);

db.connect(err => {
    if (err) throw err;
    app.listen(PORT, () => {
        console.log(`listening on ${PORT}`);
        startPrompt();
    })
})

startPrompt = () => {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: ["departments", "roles", "employees",
            "addDepartment",
            "addRole",
            "addEmployee",
            "updateAnEmployeeRole"]
    }])
        .then(function (val) {
            switch (val.choice) {
                case "departments":
                    viewDepartment();
                    break;
                case "roles":
                    viewRoles();
                    break;
                case "employees":
                    viewEmployees();
                    break;
                case "addDepartment":
                    viewAddDepartment();
                    break;
                case "addRole":
                    viewAddRole();
                    break;
                case "addEmployee":
                    viewAddEmployee();
                    break;
                case "updateAnEmployeeRole":
                    viewUpdateAnEmployeeRole();
                    break;
                default:
                    return;










            }
        })
};



const viewDepartment = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) throw err
        console.table(rows);
    })
};

const viewRoles = () => {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) throw err
        console.table(rows);
    })
};

const viewEmployees = () => {
    const sql = `SELECT * FROM employees`;
    db.query(sql, (err, rows) => {
        if (err) throw err
        console.table(rows);
    })
};

const viewAddDepartment = () => {
    const sql = `SELECT * FROM viewAddDepartment`;
    db.query(sql, (err, rows) => {
        if (err) throw err
        console.table(rows);
    })
};

const viewAddRole = () => {
    const sql = `SELECT * FROM viewAddRole`;
    db.query(sql, (err, rows) => {
        if (err) throw err
        console.table(rows);
    })
};

const viewAddEmployee = () => {
    const sql = `SELECT * FROM viewAddEmployee`;
    db.query(sql, (err, rows) => {
        if (err) throw err
        console.table(rows);
    })
};

const viewUpdateAnEmployeeRole = () => {
    const sql = `SELECT * FROM viewUpdateAnEmployeeRole`;
    db.query(sql, (err, rows) => {
        if (err) throw err
        console.table(rows);
    })
};




