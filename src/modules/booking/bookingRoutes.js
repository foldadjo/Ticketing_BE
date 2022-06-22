const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/seat",
  middlewareAuth.authentication,
  bookingController.getSeatBooking
);
Router.get(
  "/id/:id",
  middlewareAuth.authentication,
  bookingController.getBookingById
);
Router.get("/user/:userId", bookingController.getBookingByUserId);
Router.get(
  "/dash",
  middlewareAuth.authentication,
  bookingController.getDashboard
);
Router.post(
  "/",
  middlewareAuth.authentication,
  bookingController.createBooking
);
Router.patch(
  "/:id",
  // middlewareAuth.isAdmin,
  bookingController.updateStatusBooking
);
Router.post(
  "/midtrans-notification",
  bookingController.postMidtransNotification
);

module.exports = Router;
