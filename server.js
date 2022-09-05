// Declare dependency constants
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Database constant
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
        case 'Add A Role':
          addRole();
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

// Function to add a department
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

// // Function to add a role
const addRole = () => {
  db.query('SELECT * FROM department', (err, result) => {
    if (err) {
      console.log("An error has occurred.");
      return;
    }
    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'roleName',
          message: "What is the name of your new role?"
        },
        {
          type: 'input',
          name: 'salary',
          message: "What is the annual salary for this role?"
        },
        {
          type: 'list',
          name: 'department',
          message: "What department is this role under?",
          choices: function() {
            let departmentArray = [];
            for (let i = 0; i < result.length; i++) {
            departmentArray.push(result[i].name);
          }
          return departmentArray;
          }
        }
    ])
    .then (answer => {
      let department_id;
      for (let j = 0; j < result.length; j++) {
        if (result[j].name == answer.department) {
          department_id = result[j].id;
        }
      }
  
      db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', 
        [answer.roleName, answer.salary, department_id], 
        (err, result) => {
          if (err) {
            console.log("An error has occurred.");
            return;
          }
        console.log(`\nSuccessfully added ${answer.roleName} to the role table.\n`);
        // Log updated role table to console
        viewRoles();
        startApp();
        })
      })
    })
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