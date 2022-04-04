const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");

module.exports = {
  register: async (request, response) => {
    try {
      const { firstName, lastName, noTelp, email, password } = request.body;

      const UserCek = await authModel.getUserByEmail(email);
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = bcrypt.hashSync(password, salt);
      let code = Number(Math.random() * 899999 + 100000);
      // eslint-disable-next-line radix
      code = parseInt(code);
      let setData;
      if (UserCek.length === 0) {
        setData = {
          firstName,
          lastName,
          noTelp,
          email,
          code,
          password: encryptedPassword,
        };
      } else {
        return helperWrapper.response(
          response,
          409,
          "Email has been registered !",
          null
        );
      }

      const result = await authModel.register(setData);
      delete result.password;

      return helperWrapper.response(response, 200, "Succes Register", result);
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  verification: async (request, response) => {
    try {
      // eslint-disable-next-line prefer-const
      let { id, OTP } = request.body;
      OTP = Number(OTP);

      const code = await authModel.getUserById(id);
      let status;
      if (OTP === code[0].code) {
        status = "Active";
      } else {
        return helperWrapper.response(response, 400, "OTP is wrong ", null);
      }
      const setData = {
        status,
      };

      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await authModel.verification(id, setData);
      return helperWrapper.response(
        response,
        200,
        "verification is success",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      const UserCek = await authModel.getUserByEmail(email);

      if (UserCek.length > 0) {
        const PassCek = bcrypt.compareSync(password, UserCek[0].password);
        if (PassCek) {
          const payload = UserCek[0];
          delete payload.password;
          const token = jwt.sign({ ...payload }, "RAHASIA", {
            expiresIn: "24h",
          });
          return helperWrapper.response(response, 200, "Success Login", {
            id: payload.id,
            token,
          });
        }
        return helperWrapper.response(response, 401, "Password Incorrect");
      }
      return helperWrapper.response(response, 400, "Email not register", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
