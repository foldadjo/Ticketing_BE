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

      const totalTicket = seat.length;
      const statusPayment = "Success";
      const statusUsed = "Active";

      const setData = {
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
      const scheduleId = allData.map((item) => item.scheduleId)[0];
      const dateBooking = allData.map((item) => item.dateBooking)[0];
      const timeBooking = allData.map((item) => item.timeBooking)[0];
      const totalTicket = allData.map((item) => item.totalTicket)[0];
      const totalPayment = allData.map((item) => item.totalPayment)[0];
      const paymentMethod = allData.map((item) => item.paymentMethod)[0];
      const statusPayment = allData.map((item) => item.statusPayment)[0];
      const statusUsed = allData.map((item) => item.statusUsed)[0];
      const seat = allData.map((item) => item.seat);
      const createdAt = allData.map((item) => item.createdAt)[0];
      const updateAt = allData.map((item) => item.updateAt)[0];
      const name = allData.map((item) => item.name)[0];
      const category = allData.map((item) => item.category)[0];

      // const bookingId = allData.booking[0];
      const result = {
        id,
        scheduleId,
        dateBooking,
        timeBooking,
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment,
        statusUsed,
        seat,
        createdAt,
        updateAt,
        name,
        category,
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
          `Search movie by '${scheduleId}' is not found`,
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
