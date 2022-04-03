const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");
const middlewareUpload = require("../../middleware/uploadMovie");

Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.getMovieByIdRedis,
  userController.getUserById
);
Router.patch(
  "/profile/",
  middlewareAuth.authentication,
  middlewareRedis.clearMovieRedis,
  userController.updateProfile
);
Router.patch(
  "/image/",
  middlewareUpload,
  middlewareAuth.authentication,
  middlewareRedis.clearMovieRedis,
  userController.updateImage
);
Router.patch(
  "/password/",
  middlewareAuth.authentication,
  userController.updatePassword
);

module.exports = Router;
