/* eslint-disable no-shadow */
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const helperMidtrans = require("../../helpers/midtrans");
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
      const statusPayment = "notSuccess";
      const statusUsed = "Active";

      const setData = {
        id: uuidv4(),
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
      const result = { setData };

      const setDataMidtrans = {
        id: bookingId,
        total: totalPayment,
      };

      const resultMidtrans = await helperMidtrans.post(setDataMidtrans);
      console.log(resultMidtrans);

      return helperWrapper.response(response, 200, "Success post data !", {
        ...result,
        redirectUrl: resultMidtrans.redirect_url,
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  postMidtransNotification: async (request, response) => {
    try {
      const result = await helperMidtrans.notif(request.body);
      console.log(request.body);
      const orderId = result.order_id;
      const transactionStatus = result.transaction_status;
      const fraudStatus = result.fraud_status;
      const paymentType = result.payment_type;
      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      if (transactionStatus === "capture") {
        if (fraudStatus === "challenge") {
          const setData = {
            paymentMethod: result.payment_type,
            statusPayment: "notSuccess",
            updatedAt: new Date(Date.now()),
          };
          const resultUpdate = await bookingModel.updateStatusBooking(
            orderId,
            setData
          );
          return helperWrapper.response(
            response,
            200,
            "succes get data !",
            resultUpdate
          );
        }
        if (fraudStatus === "accept") {
          const setData = {
            paymentMethod: paymentType,
            statusPayment: "success",
            updatedAt: new Date(Date.now()),
          };
          const resultUpdate = await bookingModel.updateStatusBooking(
            orderId,
            setData
          );
          return helperWrapper.response(
            response,
            200,
            "succes get data !",
            resultUpdate
          );
        }
      } else if (transactionStatus === "settlement") {
        const setData = {
          paymentMethod: result.payment_type,
          statusPayment: "success",
          updatedAt: new Date(Date.now()),
        };
        const resultUpdate = await bookingModel.updateStatusBooking(
          orderId,
          setData
        );
        return helperWrapper.response(
          response,
          200,
          "succes get data !",
          resultUpdate
        );
      } else if (transactionStatus === "deny") {
        const setData = {
          paymentMethod: paymentType,
          statusPayment: "notSuccess",
          updatedAt: new Date(Date.now()),
        };
        const resultUpdate = await bookingModel.updateStatusBooking(
          orderId,
          setData
        );
        return helperWrapper.response(
          response,
          200,
          "succes get data !",
          resultUpdate
        );
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "expire"
      ) {
        const setData = {
          paymentMethod: paymentType,
          statusPayment: "notSuccess",
          updatedAt: new Date(Date.now()),
        };
        const resultUpdate = await bookingModel.updateStatusBooking(
          orderId,
          setData
        );
        return helperWrapper.response(
          response,
          200,
          "succes get data !",
          resultUpdate
        );
      } else if (transactionStatus === "notSuccess") {
        const setData = {
          paymentMethod: paymentType,
          statusPayment: "notSuccess",
          updatedAt: new Date(Date.now()),
        };
        const resultUpdate = await bookingModel.updateStatusBooking(
          orderId,
          setData
        );
        return helperWrapper.response(
          response,
          200,
          "succes get data !",
          resultUpdate
        );
      }
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getBookingById: async (request, response) => {
    try {
      const { id } = request.params;
      console.log(id);
      const allData = await bookingModel.getBookingById(id);
      const seat = allData.map((item) => item.seat);
      const result = {
        ...allData[0],
        seat,
      };

      if (seat.length <= 0) {
        return helperWrapper.response(
          response,
          200,
          `your account never booking seat`,
          null
        );
      }

      return helperWrapper.response(
        response,
        200,
        `Success get data!!`,
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getBookingByUserId: async (request, response) => {
    try {
      const { userId } = request.params;
      const result = await bookingModel.getBookingByUserId(userId);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          200,
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
      console.log(error);
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

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          200,
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
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getDashboard: async (request, response) => {
    try {
      let { scheduleId, movieId, location } = request.query;

      console.log(typeof scheduleId);
      typeof scheduleId === "undefined"
        ? (scheduleId = "")
        : (scheduleId = scheduleId);
      typeof movieId === "undefined" ? (movieId = "") : (movieId = movieId);
      typeof location === "undefined" ? (location = "") : (location = location);

      const result = await bookingModel.getDashboard(
        scheduleId,
        movieId,
        location
      );

      if (result.length <= 0) {
        return helperWrapper.response(response, 200, `total is 0`, null);
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
