const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadUser");

Router.get("/:id", userController.getUserById);
Router.patch(
  "/profile/:id",
  middlewareAuth.authentication,
  userController.updateProfile
);
Router.patch(
  "/image/:id",
  middlewareUpload,
  middlewareAuth.authentication,
  userController.updateImage
);
Router.patch(
  "/password/:id",
  middlewareAuth.authentication,
  userController.updatePassword
);
Router.delete(
  "/delimage/:id",
  middlewareAuth.authentication,
  userController.deleteImage
);

module.exports = Router;
