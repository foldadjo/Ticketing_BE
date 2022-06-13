const connection = require("../../config/mysql");

module.exports = {
  register: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO user SET ?", data, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...data,
          };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),
  getUserByEmail: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE email = ?",
        email,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getUserByPassword: (password) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE password = ?",
        password,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  verification: (password) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET status='active' WHERE password="${password}"`,
        (error) => {
          if (!error) {
            const newResult = {
              code: password,
            };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  setOTP: (email, otp) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET otp= '${otp}' WHERE email="${email}"`,
        (error) => {
          if (!error) {
            const newResult = "email active";
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  getOTP: (keyChangePassword) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM user WHERE otp=?",
        keyChangePassword,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updatePassword: (id, hash, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET password='${hash}',otp=null WHERE id='${id}'`,
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
