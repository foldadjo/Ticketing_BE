const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");

// Router.get("/", bookingController.getAllBooking);
// Router.get("/:id", bookingController.getBookingById);
Router.post("/", bookingController.createBooking);
// Router.patch("/:id", bookingController.updateBooking);
// Router.delete("/:id", bookingController.deleteBooking);

// Router.get("/hello", movieController.getHello);
// Router.get("/hello", (request, response) => {
//   response.status(200);
//   response.send("Hello World");
// });

module.exports = Router;
