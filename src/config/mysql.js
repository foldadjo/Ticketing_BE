const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tiketjauhar",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  // eslint-disable-next-line no-console
  console.log("You're now connected db mysql ...");
});

module.exports = connection;

// using dotenv to manage my ENV
const http = require("http");

require("dotenv").config();
// {path: path/filename}

// process.env.PORT
const port = process.env.PORT;
const host = process.env.HOST;
