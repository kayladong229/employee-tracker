// Declare dependency constants
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL Username
      user: 'root',
      // TODO: Add MySQL Password
      password: 'rootroot',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

// Query database
db.query()