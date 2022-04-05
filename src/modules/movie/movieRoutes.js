const express = require("express");

const Router = express.Router();

const movieController = require("./movieController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadMovie");
const middlewareRedis = require("../../middleware/redis");

Router.get("/", movieController.getAllMovie);
Router.get(
  "/:id",
  middlewareRedis.getMovieByIdRedis,
  movieController.getMovieById
);
Router.post(
  "/",
  middlewareAuth.isAdmin,
  middlewareUpload,
  movieController.createMovie
);
Router.patch(
  "/:id",
  middlewareAuth.isAdmin,
  middlewareUpload,
  middlewareRedis.clearMovieRedis,
  movieController.updateMovie
);
Router.delete("/:id", middlewareAuth.isAdmin, movieController.deleteMovie);

// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;
