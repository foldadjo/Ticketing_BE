const connection = require("../../config/mysql");

module.exports = {
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO booking SET ?",
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
  //   updateSchedule: (id, data) =>
  //     new Promise((resolve, reject) => {
  //       connection.query(
  //         "UPDATE booking SET ? WHERE id = ?",
  //         [data, id],
  //         (error) => {
  //           if (!error) {
  //             const newResult = {
  //               id,
  //               ...data,
  //             };
  //             resolve(newResult);
  //           } else {
  //             reject(new Error(error.sqlMessage));
  //           }
  //         }
  //       );
  //     }),
};
