const db = require("../../db");
const bcrypt = require("bcrypt");
const passport = require("passport");
const JWT = require("jsonwebtoken");
require("../../middlewares/passport")(passport);

require("dotenv").config();

let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

const register = async (req, res, next) => {
  const { name, email, password } = req.body.user;
  const { otp, otpExpiry } = setOTP();
  const hashedPassword = await hashPassword(password);
  console.log(hashedPassword);
  const query = `INSERT INTO users (name, email, password, otp, otp_expiry) VALUES ('${name}', '${email}', '${hashedPassword}', '${otp}', '${otpExpiry}')`;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.send(new BadRequestResponse(err));
    } else {
      return res.send(
        new OkResponse(
          "An OTP has been sent to you via email that has an expiry of 1 min",
          200,
        ),
      );
    }
  });
};

const verifyOTP = (req, res) => {
  const { email, otp } = req.body.user;
  console.log(email, otp);
  const query = `SELECT * FROM users WHERE email = '${email}' AND otp = '${otp}' AND otp_expiry > ${Date.now()}`;
  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.send(new BadRequestResponse(err));
    }
    if (result.length === 0) {
      return res.send(new UnauthorizedResponse("Invalid OTP or Expired"));
    }
    if (result.length > 0) {
      const query = `UPDATE users SET otp = '', otp_expiry = '', isEmailVerified = TRUE, isOTPVerified = TRUE WHERE email = '${email}'`;
      db.query(query, (err, result) => {
        if (err) {
          console.log(err);
          return res.send(new BadRequestResponse(err));
        }
        return res.send(new OkResponse("OTP Verified"));
      });
    }
  });
};

const login = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      console.log("::Err::", err, "::User::", user, "::Info::", info);

      if (err) {
        console.log(err);
        res.send(new BadRequestResponse(err));
      }
      if (!user) {
        res.send(new UnauthorizedResponse(info.message, 401));
      } else {
        const token = generateToken(user.email, user.user_id);
        delete user.password;
        res.send(new OkResponse({ ...user, token: token }, 200));
      }
    },
  )(req, res, next);
};

const adminLogin = (req, res) => {
  const { email, password } = req.body.user || req.body;
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  db.query(query, (err, result) => {
    console.log(result);
    console.log(result[0].id);
    if (err) {
      console.log(err);
      return res.send(new BadRequestResponse(err));
    }
    if (result.length === 0) {
      return res.send(new UnauthorizedResponse("User doesn't exist"));
    }
    if (result.length > 0) {
      console.log(password, result[0].password);
      bcrypt.compare(
        password.toString(),
        result[0].password.toString(),
        function (err, _result) {
          console.log(result);
          if (err) {
            console.log(err);
            return res.send(new BadRequestResponse(err));
          }
          if (_result) {
            const token = generateToken(email, result[0].id);
            delete result[0].password;
            res.send(new OkResponse({ ...result[0], token: token }, 200));
          } else {
            res
              .status(401)
              .send(new UnauthorizedResponse("Invalid Password", 401));
          }
        },
      );
    }
  });
};
const setOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const date = new Date();
  const otpExpiry = date.setMinutes(
    date.getMinutes() + +process.env.OTP_EXPIRY_TIME,
  );
  return { otp, otpExpiry };
};

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);
    console.log(hashedPassword);
    return hashedPassword;
  } catch (err) {
    return err;
  }
};

const generateToken = (email, id) => {
  return JWT.sign({ email, id }, process.env.JWT_SECRET);
};
module.exports = {
  register,
  verifyOTP,
  login,
  adminLogin,
};
