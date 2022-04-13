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
  "/id",
  middlewareAuth.authentication,
  bookingController.getBookingById
);
Router.get("/user/:userId", bookingController.getBookingByUserId);
Router.get(
  "/dashboard",
  middlewareAuth.isAdmin,
  bookingController.getDashboard
);
Router.post(
  "/",
  middlewareAuth.authentication,
  bookingController.createBooking
);
Router.patch(
  "/:id",
  middlewareAuth.isAdmin,
  bookingController.updateStatusBooking
);
// Router.delete("/:id", bookingController.deleteBooking);

// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;
