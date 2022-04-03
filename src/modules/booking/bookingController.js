/* eslint-disable no-shadow */
const helperWrapper = require("../../helpers/wrapper");
// --
const bookingModel = require("./bookingModel");
// --
module.exports = {
  createBooking: async (request, response) => {
    try {
      const {
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        seat,
      } = request.body;

      const user = request.decodeToken;
      const userId = user.id;

      const totalTicket = seat.length;
      const statusPayment = "Success";
      const statusUsed = "Active";

      const setData = {
        userId,
        scheduleId,
        dateBooking,
        timeBooking,
        paymentMethod,
        totalPayment,
        statusPayment,
        totalTicket,
        statusUsed,
      };

      const booking = await bookingModel.createBooking(setData);

      const bookingId = booking.id;

      await seat.map(async (seat) => {
        const seatData = { bookingId, seat };
        await bookingModel.createBookingseat(seatData);
        return seat;
      });
      const result = { bookingId, ...setData };

      return helperWrapper.response(response, 200, "Success Booking", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getBookingById: async (request, response) => {
    try {
      const { id } = request.params;

      const allData = await bookingModel.getBookingById(id);

      const seat = allData.map((item) => item.seat);

      const result = {
        id,
        ...allData[0],
        seat,
      };

      if (seat.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
          null
        );
      }

      return helperWrapper.response(
        response,
        200,
        `Success get data by id ${id}`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getBookingByUserId: async (request, response) => {
    try {
      const { userId } = request.params;
      const allData = await bookingModel.getBookingByUserId(userId);
      const seat = allData.map((item) => item.seat);
      const result = {
        userId,
        ...allData[0],
        seat,
      };

      if (seat.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `User id ${userId} is missing or never booking`,
          null
        );
      }

      return helperWrapper.response(
        response,
        200,
        `Success get data booking by user id ${userId}`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getSeatBooking: async (request, response) => {
    try {
      const { scheduleId, dateBooking, timeBooking } = request.query;

      const seatBooking = await bookingModel.getSeatBooking(
        scheduleId,
        dateBooking,
        timeBooking
      );

      const result = seatBooking.map((item) => item.seat);
      // console.log(result);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Search booking by '${scheduleId}' is not found`,
          null
        );
      }
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getDashboard: async (request, response) => {
    try {
      const { scheduleId, movieId, location } = request.query;

      const result = await bookingModel.getDashboard(
        scheduleId,
        movieId,
        location
      );

      if (result.length <= 0) {
        return helperWrapper.response(response, 404, `total is 0`, null);
      }
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateStatusBooking: async (request, response) => {
    try {
      const { id } = request.params;
      const statusUsed = "notActive";
      const setData = {
        statusUsed,
        updateAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await bookingModel.updateStatusBooking(id, setData);

      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
