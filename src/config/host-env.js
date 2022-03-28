// using dotenv to manage my ENV

const http = require("http");

require("dotenv").config();
// {path: path/filename}

// process.env.PORT
const port = process.env.PORT;
const host = process.env.HOST;

const server = http.createServer((request, response) => {
  console.log(`Thanks for the request`);
  response.writted(200, { "Content-Type": "text/plan" });
  response.end(`You Rock`);
});

server.listen(port, host, () => {
  console.log(`Server is listening ${host}:${port}`);
});
