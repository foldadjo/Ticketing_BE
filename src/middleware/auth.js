const jwt = require("jsonwebtoken");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  authentication: (request, response, next) => {
    let token = request.headers.authorization;

    if (!token) {
      return helperWrapper.response(response, 403, "Please Login first", null);
    }

    token = token.split(" ")[1];

    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message, null);
      }
      request.decodeToken = result;
      next();
    });
  },
  isAdmin: (request, response, next) => {
    let token = request.headers.authorization;

    if (!token) {
      return helperWrapper.response(response, 403, "Please Login first", null);
    }

    token = token.split(" ")[1];

    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message, null);
      }
      request.decodeToken = result;
      if (result.role === "admin") {
        next();
      } else {
        return helperWrapper.response(response, 403, error.message, null);
      }
    });
  },
};
