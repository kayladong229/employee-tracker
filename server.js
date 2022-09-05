// Declare dependency constants
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // MySQL username
    user: 'root',
    // MySQL password
    password: 'rootroot',
    database: 'employees_db'
  }
);

// Connect to database
db.connect((err) => {
  if(err) {
    console.log('An error has occurred.')
  }
  console.log('\nSuccessfully connected to the employees_db database under ID ' + db.threadId + '.\n');
  startApp();
});

const startApp = () => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do? Press CTRL + C to exit this application.',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update Employee Role']
      },
    ])
    .then ((answer) => {
      switch(answer.choice) {
        case 'View All Departments':
          viewDepartments();
          break;
        case 'View All Roles':
          viewRoles();
          break;
        case 'View All Employees':
          viewEmployees();
          break;
        case 'Add A Department':
          addDepartment();
          break;
        case 'Add An Employee':
          addEmployee();
          break;
      }
    })
};

// Function to view all departments
const viewDepartments = () => {
  db.query("SELECT * FROM department", function(err, results) {
    console.table('\nAll departments: ', results);
    startApp();
  })
}

// Function to view all roles
const viewRoles = () => {
  db.query("SELECT * FROM role", function(err, results) {
    console.table('\nAll roles: ', results);
    startApp();
  })
}

// // Function to view all employees
const viewEmployees = () => {
  db.query("SELECT * FROM employee", function(err, results) {
    console.table('\nAll employees: ', results);
    startApp();
  })
};

// // Function to add a department
const addDepartment = () => {
  return inquirer
  .prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: "What is the name of your new department?"
    }
  ])
  .then (answer => {
    db.query('INSERT INTO department (name) VALUES (?)', answer.departmentName, (err, result) => {
      if (err) {
        console.log("An error has occurred.");
        return;
      }
    console.log(`\nSuccessfully added ${answer.departmentName} to the departments table.\n`);
    // Log updated department table to console
    viewDepartments();
    })
  })
  startApp();
};

// // Function to add an employee
// const addEmployee = () => {
//   return inquirer
//   .prompt([
//     {
//       type: 'text',
//       name: 'firstname',
//       message: "What is this employee's first name?"
//     }
//     {
//       type: 'text',
//       name: 'lastname',,
//       message: "What is this employee's last name?"
//     }
//     {
//       type: 'text',
//       name: 'role',
//       message: "What is this employee's role?"
//     }
//     {
//       type: 'text',
//       name: ''
//     }
//   ])
// }