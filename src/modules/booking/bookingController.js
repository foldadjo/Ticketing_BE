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
        totalTicket,
        totalPayment,
        paymentMethod,
        statusPayment,
        statusUsed,
      };

      const bookingId = scheduleId;
      const seatData = {
        bookingId,
        seat,
      };
      const result = await bookingModel.createBooking(setData);
      await bookingModel.createBookingseat(seatData);

      return helperWrapper.response(response, 200, "Success Booking", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  //   updateBooking: async (request, response) => {
  //     try {
  //       const { id } = request.params;
  //       const { name, category, synopsis, cast, director, duration } =
  //         request.body;
  //       const setData = {
  //         name,
  //         category,
  //         synopsis,
  //         cast,
  //         director,
  //         duration,
  //         updateAt: new Date(Date.now()),
  //       };

  //       // eslint-disable-next-line no-restricted-syntax
  //       for (const data in setData) {
  //         if (!setData[data]) {
  //           delete setData[data];
  //         }
  //       }

  //       const result = await bookingModel.updateBooking(id, setData);

  //       return helperWrapper.response(
  //         response,
  //         200,
  //         "Success update data !",
  //         result
  //       );
  //     } catch (error) {
  //       return helperWrapper.response(response, 400, "Bad Request", null);
  //     }
  //   },
};
