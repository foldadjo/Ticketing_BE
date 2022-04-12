const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const { sendMail } = require("../../helpers/mail");
const redis = require("../../config/redis");

module.exports = {
  register: async (request, response) => {
    try {
      const { firstName, lastName, noTelp, email, password } = request.body;

      const UserCek = await authModel.getUserByEmail(email);
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = bcrypt.hashSync(password, salt);

      let id;
      let setData;
      if (UserCek.length === 0) {
        id = uuidv4();
        setData = {
          id,
          firstName,
          lastName,
          noTelp,
          email,
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

      const setSendEmail = {
        to: email,
        subject: "Confirm your account on tiketjauhar",
        name: firstName,
        code: result.password,
        template: "verificationEmail.html",
        buttonUrl: `https://tiketjauhar.herokuapp.com/verification`,
      };
      await sendMail(setSendEmail);

      delete result.password;

      return helperWrapper.response(
        response,
        200,
        "Succes Register User",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  verification: async (request, response) => {
    try {
      const { code, email } = request.body;
      const searchdata = await authModel.getUserByEmail(email);
      let Data;
      if (searchdata < 1) {
        return helperWrapper.response(
          response,
          200,
          "email not registered",
          null
        );
      }
      let result;
      if (code === searchdata[0].password) {
        Data = {
          status: "Active",
          updateAt: new Date(Date.now()),
        };
        result = await authModel.verification(Data, email);
      } else {
        return helperWrapper.response(
          response,
          200,
          "code verification is wrong",
          null
        );
      }

      return helperWrapper.response(
        response,
        200,
        "Success Activation data !",
        result
      );
    } catch (error) {
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
            expiresIn: "1h",
          });
          const refreshToken = jwt.sign({ ...payload }, "RAHASIABARU", {
            expiresIn: "24h",
          });
          return helperWrapper.response(response, 200, "Success Login", {
            id: payload.id,
            token,
            refreshToken,
          });
        }
        return helperWrapper.response(response, 401, "Password Incorrect");
      }
      return helperWrapper.response(response, 400, "Email not register", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  refresh: async (request, response) => {
    try {
      const { refreshToken } = request.body;
      const checkToken = await redis.get(`refreshToken:${refreshToken}`);
      if (checkToken) {
        return helperWrapper.response(
          response,
          403,
          "Your refresh token cannot be use",
          null
        );
      }
      jwt.verify(refreshToken, "RAHASIABARU", async (error, result) => {
        delete result.iat;
        delete result.exp;
        const token = jwt.sign(result, "RAHASIA", { expiresIn: "1h" });
        const newRefreshToken = jwt.sign(result, "RAHASIABARU", {
          expiresIn: "24h",
        });
        await redis.setEx(
          `refreshToken:${refreshToken}`,
          3600 * 48,
          refreshToken
        );
        return helperWrapper.response(response, 200, "Success refresh token", {
          id: result.id,
          token,
          refreshToken: newRefreshToken,
        });
      });
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  logout: async (request, response) => {
    try {
      let token = request.headers.authorization;
      const { refreshToken } = request.body;
      token = token.split(" ")[1];
      redis.setEx(`accessToken:${token}`, 3600 * 24, token);
      redis.setEx(`refreshToken:${refreshToken}`, 3600 * 24, token);
      return helperWrapper.response(response, 200, "Success logout", null);
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
};
