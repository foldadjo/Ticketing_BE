/* eslint-disable no-self-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-const */
const redis = require("../../config/redis");
const helperWrapper = require("../../helpers/wrapper");
const cloudinary = require("../../config/cloudinary");
// --
const userModel = require("./userModel");
// --
module.exports = {
  getUserById: async (request, response) => {
    try {
      const { id } = request.params;
      const data = await userModel.getUserById(id);
      const result = `${data[0].firstName} ${data[0].lastName}`;

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `Data User by id ${id} not found`,
          null
        );
      }

      await redis.setEx(`getUserById: ${id}`, 3600, JSON.stringify(result));

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
  updateProfile: async (request, response) => {
    try {
      const { fisrtName, lastName, noTelp } = request.body;
      const setData = {
        fisrtName,
        lastName,
        noTelp,
        updateAt: new Date(Date.now()),
      };

      const user = request.decodeToken;
      const { id } = user;

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await userModel.updateProfile(id, setData);
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
  updateImage: async (request, response) => {
    try {
      const user = request.decodeToken;
      const { id } = user;
      let image;

      if (request.file) {
        const imageDelete = await userModel.getUserById(id);
        if (imageDelete[0].image.length > 0) {
          await cloudinary.uploader.destroy(
            `${imageDelete[0].image}`,
            (delresult) => {
              console.log(delresult);
            }
          );
        }
        image = `${request.file.filename}`;
      } else {
        ("");
      }

      const setData = {
        image,
        updateAt: new Date(Date.now()),
      };

      const result = await userModel.updateProfile(id, setData);
      return helperWrapper.response(
        response,
        200,
        "Success upload image",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  updatePassword: async (request, response) => {
    try {
      const { newPassword, confirmPassword } = request.body;
      if (newPassword == confirmPassword) {
        const password = newPassword;
        const setData = {
          password,
          updateAt: new Date(Date.now()),
        };
        const user = request.decodeToken;
        const { id } = user;
        // eslint-disable-next-line no-restricted-syntax
        for (const data in setData) {
          if (!setData[data]) {
            delete setData[data];
          }
        }
        const result = await userModel.updateProfile(id, setData);
        return helperWrapper.response(
          response,
          200,
          "update password is success",
          `data id ${result.id} is success update password at ${result.updateAt}`
        );
      }
      return helperWrapper.response(
        response,
        200,
        "password update failed",
        null
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
