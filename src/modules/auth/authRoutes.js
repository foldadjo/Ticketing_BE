const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.post("/refresh", authController.refresh);
Router.get("/verification/:password", authController.verification);
Router.post("/forgotPassword", authController.forgotPassword);
Router.patch("/resetPassword", authController.resetPassword);
Router.post("/logout", authController.logout);

module.exports = Router;
