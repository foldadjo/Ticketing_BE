const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const helperWrapper = require("../../helpers/wrapper");
const authModel = require("./authModel");
const helperMailer = require("../../helpers/mail");
const redis = require("../../config/redis");

module.exports = {
  register: async (request, response) => {
    try {
      const { firstName, lastName, noTelp, email, password } = request.body;

      const UserCek = await authModel.getUserByEmail(email);
      const salt = bcrypt.genSaltSync(10);
      const encryptedPassword = bcrypt.hashSync(password, salt);

      if (UserCek.length > 0) {
        return helperWrapper.response(
          response,
          409,
          "Email has been registered !",
          null
        );
      }

      const setData = {
        id: uuidv4(),
        firstName,
        lastName,
        noTelp,
        email,
        password: encryptedPassword,
      };

      const result = await authModel.register(setData);

      const setSendEmail = {
        to: email,
        subject: "Confirm your account on tiketjauhar",
        name: firstName,
        code: result.password,
        template: "verificationEmail.html",
        buttonUrl: `google.com`,
        linkENV: process.env.LINK_BACKEND,
      };
      console.log(setSendEmail);

      await helperMailer.sendMail(setSendEmail);
      delete result.password;
      // delete result.otp;

      return helperWrapper.response(
        response,
        200,
        "Succes Register User, check your email and activate account to Log In",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  verification: async (request, response) => {
    try {
      const { password } = request.params;
      const searchdata = await authModel.getUserByPassword(password);
      if (searchdata.length < 1) {
        return helperWrapper.response(
          response,
          200,
          "email not registered",
          null
        );
      }
      if (password === searchdata[0].password) {
        result = await authModel.verification(password);
        return helperWrapper.response(
          response,
          200,
          "Success Activation data !",
          result
        );
      } else {
        return helperWrapper.response(
          response,
          200,
          "code verification is wrong",
          null
        );
      }
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
  forgotPassword: async (request, response) => {
    try {
      // pasword hash
      const { email, linkDirect } = request.body;
      const dataEmail = await authModel.getUserByEmail(email);
      if (dataEmail.length < 1) {
        return helperWrapper.response(
          response,
          200,
          "email not registed",
          null
        );
      }
      const otp = Math.floor(Math.random() * 899999 + 100000);

      const setSendEmail = {
        to: email,
        subject: "Forgot Password Verification!",
        template: "forgotPassword.html",
        otpKey: otp,
        linkENV: process.env.LINK_FRONTEND,
        buttonUrl: otp,
      };
      await helperMailer.sendMail(setSendEmail);
      // activation code
      const result = await authModel.setOTP(email, otp);
      return helperWrapper.response(
        response,
        200,
        `email valid check your email box for reset password `,
        email
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },
  resetPassword: async (request, response) => {
    try {
      const { keyChangePassword, newPassword, confirmPassword } = request.body;
      const checkResult = await authModel.getOTP(keyChangePassword);
      if (checkResult.length <= 0) {
        return helperWrapper.response(
          response,
          404,
          `your key is not valid`,
          null
        );
      }
      const id = checkResult[0].id;
      // eslint-disable-next-line no-restricted-syntax
      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          response,
          400,
          "password Not Match",
          null
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(confirmPassword, salt);
      const setData = {
        confirmPassword: hash,
        updatedAt: new Date(Date.now()),
      };
      // eslint-disable-next-line no-restricted-syntax
      for (const data in setData) {
        if (!setData[data]) {
          delete setData[data];
        }
      }
      const result = await authModel.updatePassword(id, hash, setData);

      return helperWrapper.response(
        response,
        200,
        "succes reset Password",
        result
      );
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
