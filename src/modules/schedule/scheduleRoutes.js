const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/",
  middlewareAuth.authentication,
  scheduleController.getAllSchedule
);
Router.get(
  "/:id",
  middlewareAuth.authentication,
  scheduleController.getScheduleById
);
Router.post("/", middlewareAuth.isAdmin, scheduleController.createSchedule);
Router.patch("/:id", middlewareAuth.isAdmin, scheduleController.updateSchedule);
Router.delete(
  "/:id",
  middlewareAuth.isAdmin,
  scheduleController.deleteSchedule
);

module.exports = Router;
