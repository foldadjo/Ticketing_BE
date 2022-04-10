const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/register", authController.register);
Router.patch("/verif", authController.verification);
Router.post("/login", authController.login);
Router.post("/refresh", authController.refresh);
Router.post("/logout", authController.logout);

module.exports = Router;
