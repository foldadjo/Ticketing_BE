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

      // const setDataMidtrans = {
      //   id: uuidv4(),
      //   total: totalPayment,
      // };

      // const resultMidtrans = await helperMidtrans.post(setDataMidtrans);

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

      return helperWrapper.response(
        response,
        200,
        "Success post data !",
        result
        // redirectUrl: resultMidtrans.redirect_url,
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  // postMidtransNotification: async (request, response) => {
  //   try {
  //     console.log(request.body);
  //     const result = await helperMidtrans.notif(request.body);
  //     const orderId = result.order_id;
  //     const transactionStatus = result.transaction_status;
  //     const fraudStatus = result.fraud_status;

  //     console.log(
  //       `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
  //     );

  //     // Sample transactionStatus handling logic

  //     if (transactionStatus === "capture") {
  //       // capture only applies to card transaction, which you need to check for the fraudStatus
  //       if (fraudStatus === "challenge") {
  //         // TODO set transaction status on your databaase to 'challenge'
  //         // UBAH STATUS PEMBAYARAN MENJADI PENDING
  //         // PROSES MEMANGGIL MODEL untuk mengubah data di dalam database
  //         // id = orderId;
  //         const setData = {
  //           paymentMethod: result.payment_type,
  //           statusPayment: "PENDING",
  //           // updatedAt: ...
  //         };
  //       } else if (fraudStatus === "accept") {
  //         // TODO set transaction status on your databaase to 'success'
  //         // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
  //         // id = orderId;
  //         const setData = {
  //           paymentMethod: result.payment_type,
  //           statusPayment: "SUCCESS",
  //           // updatedAt: ...
  //         };
  //       }
  //     } else if (transactionStatus === "settlement") {
  //       // TODO set transaction status on your databaase to 'success'
  //       // UBAH STATUS PEMBAYARAN MENJADI SUCCESS
  //       // id = orderId;
  //       const setData = {
  //         paymentMethod: result.payment_type,
  //         statusPayment: "SUCCESS",
  //         // updatedAt: ...
  //       };
  //       console.log(
  //         `Sukses melakukan pembayaran dengan id ${orderId} dan data yang diubah ${JSON.stringify(
  //           setData
  //         )}`
  //       );
  //     } else if (transactionStatus === "deny") {
  //       // TODO you can ignore 'deny', because most of the time it allows payment retries
  //       // and later can become success
  //       // UBAH STATUS PEMBAYARAN MENJADI FAILED
  //     } else if (
  //       transactionStatus === "cancel" ||
  //       transactionStatus === "expire"
  //     ) {
  //       // TODO set transaction status on your databaase to 'failure'
  //       // UBAH STATUS PEMBAYARAN MENJADI FAILED
  //     } else if (transactionStatus === "pending") {
  //       // TODO set transaction status on your databaase to 'pending' / waiting payment
  //       // UBAH STATUS PEMBAYARAN MENJADI PENDING
  //     }
  //   } catch (error) {
  //     return helperWrapper.response(response, 400, "Bad Request", null);
  //   }
  // },
  getBookingById: async (request, response) => {
    try {
      const user = request.decodeToken;
      const userId = user.id;
      const allData = await bookingModel.getBookingById(userId);
      const seat = allData.map((item) => item.seat);
      const result = {
        ...allData[0],
        seat,
      };

      if (seat.length <= 0) {
        return helperWrapper.response(
          response,
          404,
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
