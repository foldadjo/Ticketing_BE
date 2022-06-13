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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.log(query.sql);
    }),
  getBookingById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM booking INNER JOIN bookingseat ON booking.id = bookingseat.bookingId 
        INNER JOIN schedule ON booking.scheduleId = schedule.id INNER JOIN movie ON schedule.movieId = movie.id WHERE booking.id = ${id};`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getBookingByUserId: (userId) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM booking WHERE userId = '${userId}';`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getSeatBooking: (scheduleId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT bookingseat.seat FROM booking INNER JOIN bookingseat ON booking.id = bookingseat.bookingId 
        WHERE booking.scheduleId = ${scheduleId} AND booking.dateBooking LIKE '%${dateBooking}%' AND
        booking.timeBooking LIKE '%${timeBooking}%'`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getDashboard: (scheduleId, movieId, location) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT MONTH(booking.dateBooking) AS month, SUM(booking.totalPayment) AS total FROM booking 
        INNER JOIN schedule ON booking.scheduleId = schedule.id WHERE booking.scheduleId LIKE '%${scheduleId}%' 
        AND schedule.movieId LIKE '%${movieId}%' AND schedule.location LIKE '%${location}%' GROUP BY month;`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updateStatusBooking: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET ? WHERE id = ?",
        [data, id],
        (error) => {
          if (!error) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
};
