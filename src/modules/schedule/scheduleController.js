/* eslint-disable no-self-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-const */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-globals */
const helperWrapper = require("../../helpers/wrapper");

// --
const scheduleModel = require("./scheduleModel");
// --
module.exports = {
  getAllSchedule: async (request, response) => {
    try {
      let { page, limit, searchMovieId, searchLocation, sort } = request.query;
      // default value
      page = isNaN(page) || page == 0 ? (page = 1) : (page = Number(page));
      limit =
        isNaN(limit) || limit == 0 ? (limit = 10) : (limit = Number(limit));

      typeof searchMovieId === "string"
        ? (searchMovieId = searchMovieId)
        : (searchMovieId = "");
      typeof searchLocation === "string"
        ? (searchLocation = searchLocation)
        : (searchLocation = "");
      typeof sort === "string" ? (sort = sort) : (sort = "schedule.id");

      const offset = page * limit - limit;
      const totalData = await scheduleModel.getCountSchedule(
        searchMovieId,
        searchLocation
      );
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await scheduleModel.getAllSchedule(
        searchMovieId,
        searchLocation,
        sort,
        limit,
        offset
      );

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Search schedule is not found`,
          null
        );
      }

      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        result,
        pageInfo
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getScheduleById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.getScheduleById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data by id ${id} not found`,
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
  createSchedule: async (request, response) => {
    try {
      let { movieId, premiere, price, location, dateStart, dateEnd, time } =
        request.body;

      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
      };
      const result = await scheduleModel.createSchedule(setData);
      return helperWrapper.response(
        response,
        200,
        "Success create data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updateSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const { movieId, premiere, price, location, dateStart, dateEnd, time } =
        request.body;
      const setData = {
        movieId,
        premiere,
        price,
        location,
        dateStart,
        dateEnd,
        time,
        updateAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await scheduleModel.updateSchedule(id, setData);

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
  deleteSchedule: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await scheduleModel.deleteSchedule(id);
      return helperWrapper.response(
        response,
        200,
        "Success delete data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
