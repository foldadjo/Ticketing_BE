const helperWrapper = require("../../helpers/wrapper");
// --
const bookingModel = require("./bookingModel");
// --
module.exports = {
  getHello: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("Hello World");
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
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
      const statusPayment = "Active";
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
      const result = await bookingModel.createBooking(setData);
      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
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
