// using dotenv to manage my ENV

const http = require("http");
const { response } = require("../../helpers/wrapper");

require("dotenv").config();
// {path: path/filename}

// process.env.PORT
let port = process.env.PORT;
let host = process.env.HOST;

let server = http.createServer( (request, response) =>{
    console.log(`Thanks for the request`);
    response.writted(200, {`Content-Type`:`text/plan`});
    response.end(`You Rock`);
})

server.listen(port, host, () =>{
    console.log(`Server is listening ${host}:${port}`)
})
