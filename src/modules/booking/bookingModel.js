/* eslint-disable no-console */
const connection = require("../../config/mysql");

module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO booking SET ? ",
        data,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  createBookingseat: (seat) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO bookingseat SET ?",
        seat,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...seat,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),
  // getBooking: () =>
  //   new Promise((resolve, reject) => {
  //     connection.query(
  //       `SELECT b.id, b.scheduleId, b.dateBooking, b.timeBooking, b.timeBooking, b.paymentMethod, b.totalPayment, bs.seat
  //       FROM booking AS b INNER JOIN bookingseat AS bs ON b.id = bs.bookingId;`,
  //       (error, result) => {
  //         if (!error) {
  //           resolve(result);
  //         } else {
  //           reject(new Error(error.sqlMessage));
  //         }
  //       }
  //     );
  //   }),
  // updateSchedule: (id, data) =>
  //   new Promise((resolve, reject) => {
  //     connection.query(
  //       "UPDATE booking SET ? WHERE id = ?",
  //       [data, id],
  //       (error) => {
  //         if (!error) {
  //           const newResult = {
  //             id,
  //             ...data,
  //           };
  //           resolve(newResult);
  //         } else {
  //           reject(new Error(error.sqlMessage));
  //         }
  //       }
  //     );
  //   }),
};
