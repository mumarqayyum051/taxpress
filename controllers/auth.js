const { expressjwt } = require('express-jwt');
const db = require('.././db');
let secret = process.env.JWT_SECRET;
const { BadRequestResponse } = require('express-http-response');

let UnauthorizedResponse =
  require('express-http-response').UnauthorizedResponse;
function getTokenFromHeader(req) {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}
const user = (req, res, next) => {
  let query = `SELECT * FROM users WHERE id = ${req.auth.id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return res.status(400).send(new BadRequestResponse(err));
      } else {
        if (result.length) {
          delete result[0].password;
          delete result[0].type;
          result[0].token = req.headers.authorization.split(' ')[1];
          req.user = result[0];
          return next();
        } else {
          return res.status(401).send(new UnauthorizedResponse());
        }
      }
    });
  });
};
const admin = (req, res, next) => {
  let query = `SELECT * FROM users WHERE id = ${req.auth.id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return res.status(400).send(new BadRequestResponse(err));
      } else {
        if (result.length) {
          delete result[0].password;
          delete result[0].type;
          result[0].token = req.headers.authorization.split(' ')[1];
          req.admin = result[0];
          return next();
        } else {
          return res.status(401).send(new UnauthorizedResponse());
        }
      }
    });
  });
};
let auth = {
  required: expressjwt({
    secret: secret,
    getToken: getTokenFromHeader,
    algorithms: ['HS256'],
  }),
  optional: expressjwt({
    secret: secret,
    credentialsRequired: false,
    getToken: getTokenFromHeader,
    algorithms: ['HS256'],
  }),
  user,
  admin,
};

module.exports = auth;
