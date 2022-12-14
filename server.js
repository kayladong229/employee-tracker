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
        case 'Update Employee Role':
          updateEmployee();
          break;
      }
    })
};

// Function to view all departments
const viewDepartments = () => {
  db.query("SELECT * FROM department", (err, results) => {
    console.table('\nAll departments: ', results);
    startApp();
  })
}

// Function to view all roles
const viewRoles = () => {
  db.query("SELECT * FROM role", (err, results) => {
    console.table('\nAll roles: ', results);
    startApp();
  })
}

// // Function to view all employees
const viewEmployees = () => {
  db.query("SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title AS title, role.department_id AS department_id, role.salary AS salary, employee.manager_id AS manager_id FROM employee JOIN role ON employee.id = role.id", (err, results) => {
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
};

// // Function to add a role
const addRole = () => {
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
      ])
    .then (answer => {
      let params = [answer.roleName, answer.salary];

      db.query('SELECT * FROM department', (err, result) => {
        if (err) {
          console.log("An error has occurred.");
          return;
        }

        const departments = result.map(({ name, id }) => ({ name: name, value: id }));

        return inquirer
          .prompt([
            {
              type: 'list',
              name: 'department',
              message: "What department is this role under?",
              choices: departments
            }
          ])
          .then (answer => {
            const department = answer.department;
            params.push(department);

            db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', 
            params, 
            (err, result) => {
              if (err) {
                console.log("An error has occurred.");
                return;
              }
            console.log(`\nThe new role has been successfully added to the role table.\n`);
            // Log updated role table to console
            viewRoles();
          })
        })
      })
    })
}

// Function to add an employee
const addEmployee = () => {
  return inquirer
  .prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What is this employee's first name?"
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is this employee's last name?"
    }
  ])
  .then(answer => {
    let params = [answer.firstName, answer.lastName];

    // Acquire roles from role table
    db.query('SELECT * FROM role', (err, result) => {
      if (err) {
        console.log("An error has occurred.");
        return;
      }
      const roles = result.map(({ id, title }) => ({ name: title, value: id }));
      // console.log(roles);

      return inquirer
        .prompt([
          {
            type: 'list',
            name: 'role',
            message: "What is this employee's role?",
            choices: roles
          }
        ])
        .then (answer => {
          const role = answer.role;
          params.push(role);
          // Acquire employees from employee table
          db.query('SELECT * FROM employee WHERE manager_id IS NULL', (err, result) => {
            if (err) {
              console.log("An error has occurred.");
              return;
            }
            const managers = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            // console.log(managers);

            return inquirer
              .prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Who is this employee's manager?",
                  choices: managers
                }
              ])
              .then (answer => {
                const manager = answer.manager;
                params.push(manager);

                db.query('INSERT INTO employee (first_name, last_Name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                params,
                (err, result) => {
                  if (err) {
                    console.log("An error has occurred.");
                    return;
                  }
                  console.log(`\nSuccessfully added new employee to the employee table.\n`);
                  db.query('SELECT first_name, last_name, role_id, manager_id FROM employee', (err, result) => {
                    console.table(result);
                    startApp();
                  });
                })
              })
          })
        })
    })
  })
};

// Function to update an employee's information
const updateEmployee = () => {
  db.query('SELECT * FROM employee', (err, result) => {
    if (err) {
      console.log("An error has occurred.");
      return;
    }
  const employees = result.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }))
  // console.log(employees);

  return inquirer
  .prompt([
    {
      type: 'list',
      name: 'employee',
      message: 'Which employee do you wish to update?',
      choices: employees
    }
  ])
  .then(answer => {
    let params = [];
    const employee = answer.employee;
    params.push(employee);

    db.query('SELECT * FROM role', (err, result) => {
      if(err) {
        console.log("An error has occurred.");
        return;
      }
      const roles = result.map(({ id, title}) => ({ name: title, value: id}));
      // console.log(roles)

      return inquirer
      .prompt([
        {
          type: 'list',
          name: 'role',
          message: "What is the employee's new role?",
          choices: roles
        }
      ])
      .then(answer => {
        const role = answer.role;
        params.push(role);

        let employee = params[0];
        params[0] = role;
        params[1] = employee;
        console.log(params);

        db.query('UPDATE employee SET role_id = ? WHERE id = ?', params, (err, result) => {
        if (err) {
          console.log("An error has occurred.");
          return;
        }
        console.log("\nEmployee information has been successfully updated.\n");
        db.query('SELECT first_name, last_name, role_id FROM employee', (err, result) => {
          console.table(result);
          startApp();
        });
      })
      })
    })
  })
  })
}