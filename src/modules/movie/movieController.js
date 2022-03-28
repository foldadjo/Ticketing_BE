/* eslint-disable no-self-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-const */
const helperWrapper = require("../../helpers/wrapper");
// --
const movieModel = require("./movieModel");
// --
module.exports = {
  getHello: async (request, response) => {
    try {
      //   response.status(200);
      //   response.send("Hello World");
      return helperWrapper.response(
        response,
        200,
        "Success get data !",
        "Hello World"
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  getAllMovie: async (request, response) => {
    try {
      let { page, limit, searchName, sort } = request.query;
      // default value
      page = isNaN(page) || page == 0 ? (page = 1) : (page = Number(page));
      limit =
        isNaN(limit) || limit == 0 ? (limit = 5) : (limit = Number(limit));

      typeof searchName === "string"
        ? (searchName = searchName)
        : (searchName = "");
      typeof sort === "string" ? (sort = sort) : (sort = "id ASC");

      const offset = page * limit - limit;
      const totalData = await movieModel.getCountMovie(searchName);
      const totalPage = Math.ceil(totalData / limit);

      const pageInfo = {
        page,
        totalPage,
        limit,
        totalData,
      };

      const result = await movieModel.getAllMovie(
        searchName,
        sort,
        limit,
        offset
      );

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Search movie by '${searchName}' is not found`,
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
  getMovieById: async (request, response) => {
    try {
      // request = {
      //   params: {
      //     id: 1
      //   }
      // }
      const { id } = request.params;
      const result = await movieModel.getMovieById(id);

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
  createMovie: async (request, response) => {
    try {
      const { name, category, synopsis, cast, director, duration } =
        request.body;
      const setData = {
        name,
        category,
        synopsis,
        cast,
        director,
        duration,
      };
      const result = await movieModel.createMovie(setData);
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
  updateMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const { name, category, synopsis, cast, director, duration } =
        request.body;
      const setData = {
        name,
        category,
        synopsis,
        cast,
        director,
        duration,
        updateAt: new Date(Date.now()),
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }

      const result = await movieModel.updateMovie(id, setData);

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
  deleteMovie: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await movieModel.deleteMovie(id);
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
