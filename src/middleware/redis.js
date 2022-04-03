const redis = require("../config/redis");
const helperWrapper = require("../helpers/wrapper");

module.exports = {
  getMovieByIdRedis: async (request, response, next) => {
    try {
      const { id } = request.params;
      let result = await redis.get(`getMovie:${id}`);
      if (result !== null) {
        // console.log("data ada di dalam redis");
        result = JSON.parse(result);
        return helperWrapper.response(
          response,
          200,
          "Success get data !",
          result
        );
      }
      //   console.log("data tidak ada di dalam redis");
      return next();
    } catch (error) {
      return helperWrapper.response(response, 400, error.message, null);
    }
  },
  clearMovieRedis: async (request, response, next) => {
    try {
      const keys = await redis.keys("getMovie:*");
      if (keys.length > 0) {
        keys.forEach(async (element) => {
          await redis.del(element);
        });
      }
      return next();
    } catch (error) {
      return helperWrapper.response(response, 400, error.message, null);
    }
  },
};
