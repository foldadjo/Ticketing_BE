const express = require("express");

const Router = express.Router();

const movieRoutes = require("../modules/movie/movieRoutes");

Router.use("/movie", movieRoutes);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;
