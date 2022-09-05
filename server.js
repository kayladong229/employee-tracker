// Declare dependency constants
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

// const PORT = process.env.PORT || 3001;
// const app = express();

// Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

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
  console.log('\nSuccessfully connected to the employees_db database under ID ' + db.threadId + '.');
  startApp();
});

const startApp = () => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do? Press CTRL + C to exit this application.',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add A Role', 'View All Departments', 'Add A Department']
      },
  ])
  .then ((answer) => {
    switch(answer.choice) {
      case 'View All Employees':
        viewEmployees();
        break;
    }
  })
}
// Function to view all employees
const viewEmployees = () => {
  db.query("SELECT * FROM employee", function(err, results) {
    console.log(results);
    startApp();
  })
};