const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");

module.exports = {
  register: async (request, response) => {
    try {
      const { firstName, lastName, noTelp, email, password } = request.body;

      if (!(email && password)) {
        return response
          .status(400)
          .send({ error: "Data not formatted properly" });
      }

      const setData = {
        firstName,
        lastName,
        noTelp,
        email,
        password,
      };
      const userCek = await authModel.getUserByEmail(email);
      if (userCek.length < 1) {
        const result = await authModel.register(setData);
        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        result.password = await bcrypt.hash(result.password, salt);
        // console.log(result.password);
        delete result.password;
        return helperWrapper.response(
          response,
          200,
          "Success register user",
          result
        );
      }
      return helperWrapper.response(response, 200, "e-mail registered", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  // eslint-disable-next-line consistent-return
  login: async (request, response) => {
    try {
      const { email, password } = request.body;

      const userCek = await authModel.getUserByEmail(email);

      if (userCek.length < 1) {
        return helperWrapper.response(
          response,
          200,
          "Email not register",
          null
        );
      }

      bcrypt.compare(password, userCek.password, () => {
        if (password !== userCek[0].password) {
          return helperWrapper.response(response, 200, "Wrong Password", null);
        }

        const payload = userCek[0];
        delete payload.password;

        // Send JWT
        const token = jwt.sign({ ...payload }, "RAHASIA", { expiresIn: "24h" });
        return helperWrapper.response(response, 200, "Success Login", {
          id: payload.id,
          token,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
