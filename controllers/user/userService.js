const db = require('../../db');
const bcrypt = require('bcrypt');
const passport = require('passport');
const JWT = require('jsonwebtoken');
require('../../middlewares/passport')(passport);

require('dotenv').config();

let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require('express-http-response');
const {
  sendEmailOTPVerificationCode,
} = require('../../utilities/emailService');

const register = async (req, res, next) => {
  const { username, email, address, password } = req.body.user || req.body;
  if (!username || !email || !address || !password) {
    return next(new BadRequestResponse('Please fill all the fields'));
  }
  db.then((conn) => {
    db.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      async (err, result) => {
        if (err) {
          return res
            .status(400)
            .send(new BadRequestResponse('Something went wrong'));
        }

        if (result.length) {
          return res
            .status(400)
            .send(new BadRequestResponse('User already exists'));
        }

        const { OTP, OTPExpiry } = setOTP();

        const hashedPassword = await hashPassword(password);

        const query = `INSERT INTO users (username,email,address, password, OTP, OTPExpiry) VALUES ('${username}', '${email}', '${address}', '${hashedPassword}', '${OTP}', '${OTPExpiry}')`;

        conn.query(query, (err, result) => {
          if (err) {
            return res.status(400).send(new BadRequestResponse(err));
          } else {
            return res.send(
              new OkResponse('User Registered Successfully', 200)
            );
          }
        });
      }
    );
  });
};
// const register = async (req, res, next) => {
//   const { username, address, password } = req.body.user || req.body;

//   if (!username || !address || !password) {
//     return next(new BadRequestResponse("Please fill all the fields"));
//   }

//   const { OTP, OTPExpiry } = setOTP();
//
//   const hashedPassword = await hashPassword(password);
//
//   const query = `INSERT INTO users (username,address, password, OTP, OTPExpiry) VALUES ('${username}', '${address}', '${hashedPassword}', '${OTP}', '${OTPExpiry}')`;

//    db.then((conn) => {
// conn.query(query, (err, result) => {
//     if (err) {
//
//       return next(new BadRequestResponse(err));
//     } else {
//       return res.send(new OkResponse("User Registered Successfully", 200));
//     }
//   });
// };
const verifyOTP = (req, res, next) => {
  const { email, otp } = req.body.user;

  const query = `SELECT * FROM users WHERE email = '${email}' AND otp = '${otp}' AND otp_expiry > ${Date.now()}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      if (result.length === 0) {
        return res.send(new UnauthorizedResponse('Invalid OTP or Expired'));
      }
      if (result.length > 0) {
        const query = `UPDATE users SET otp = '', otp_expiry = '', isEmailVerified = TRUE, isOTPVerified = TRUE WHERE email = '${email}'`;

        conn.query(query, (err, result) => {
          if (err) {
            return next(new BadRequestResponse(err));
          }
          return res.send(new OkResponse('OTP Verified'));
        });
      }
    });
  });
};

const login = (req, res, next) => {
  passport.authenticate(
    'local',
    { session: false },
    function (err, user, info) {
      if (err) {
        next(new BadRequestResponse(err));
      }
      if (!user) {
        res.send(new UnauthorizedResponse(info.message, 401));
      } else {
        const token = generateToken(user.email, user.user_id);
        delete user.password;
        delete user?.OTP;
        delete user?.OTPExpiry;
        delete user?.isEmailVerified;
        delete user?.isOTPVerified;
        res.send(new OkResponse({ ...user, token: token }, 200));
      }
    }
  )(req, res, next);
};

const adminLogin = (req, res, next) => {
  const { email, password } = req.body.user || req.body;
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      if (result.length === 0) {
        return res
          .status(401)
          .send(new UnauthorizedResponse("User doesn't exist", 401));
      }
      if (result.length > 0) {
        bcrypt.compare(
          password.toString(),
          result[0].password.toString(),
          function (err, _result) {
            if (err) {
              return next(new BadRequestResponse(err));
            }
            if (_result) {
              const token = generateToken(email, result[0].id);
              delete result[0].password;
              res.send(new OkResponse({ ...result[0], token: token }, 200));
            } else {
              res
                .status(401)
                .send(new UnauthorizedResponse('Invalid Password', 401));
            }
          }
        );
      }
    });
  });
};
const setOTP = () => {
  const OTP = Math.floor(1000 + Math.random() * 9000);
  const date = new Date();
  const OTPExpiry = date.setMinutes(
    date.getMinutes() + +process.env.OTP_EXPIRY_TIME
  );
  return { OTP, OTPExpiry };
};

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);

    return hashedPassword;
  } catch (err) {
    return err;
  }
};

const generateToken = (email, id) => {
  return JWT.sign({ email, id }, process.env.JWT_SECRET);
};

const userContext = (req, res, next) => {
  //
  res.send(req.user);
};

module.exports = {
  register,
  verifyOTP,
  login,
  adminLogin,
  userContext,
};
