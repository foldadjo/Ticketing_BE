const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadUser");

Router.get("/:id", middlewareAuth.authentication, userController.getUserById);
Router.patch(
  "/profile",
  middlewareAuth.authentication,
  userController.updateProfile
);
Router.patch(
  "/image",
  middlewareUpload,
  middlewareAuth.authentication,
  userController.updateImage
);
Router.patch(
  "/password",
  middlewareAuth.authentication,
  userController.updatePassword
);

module.exports = Router;
