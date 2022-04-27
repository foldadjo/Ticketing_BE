const jwt = require("jsonwebtoken");
const helperWrapper = require("../helpers/wrapper");
// const redis = require("../config/redis");

module.exports = {
  authentication: async (request, response, next) => {
    let token = request.headers.authorization;

    if (!token) {
      return helperWrapper.response(response, 403, "Please Login first", null);
    }

    token = token.split(" ")[1];

    // const checkRedis = await redis.get(`accessToken:${token}`);
    // if (checkRedis) {
    //   return helperWrapper.response(
    //     response,
    //     403,
    //     "Your token is destroyed please login again",
    //     null
    //   );
    // }

    jwt.verify(token, "RAHASIA", (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message, null);
      }
      request.decodeToken = result;
      // if (result.status === "Active") {
      next();
      // } else {
      //   return helperWrapper.response(
      //     response,
      //     403,
      //     "Account not verified",
      //     null
      //   );
      // }
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
        return helperWrapper.response(
          response,
          403,
          "this feature can only be used by admin",
          null
        );
      }
    });
  },
};
