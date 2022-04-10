const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareAuth = require("../../middleware/auth");
const middlewareRedis = require("../../middleware/redis");

Router.get(
  "/",
  middlewareRedis.getScheduleRedis,
  scheduleController.getAllSchedule
);
Router.get(
  "/:id",
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleById
);
Router.post("/", middlewareAuth.isAdmin, scheduleController.createSchedule);
Router.patch(
  "/:id",
  middlewareRedis.clearScheduleRedis,
  middlewareAuth.isAdmin,
  scheduleController.updateSchedule
);
Router.delete(
  "/:id",
  middlewareAuth.isAdmin,
  scheduleController.deleteSchedule
);

module.exports = Router;
