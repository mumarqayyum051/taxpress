const db = require("../../db");

const { BadRequestResponse, OkResponse } = require("express-http-response");

const getCounts = (req, res, next) => {
  Promise.all([
    new Promise((resolve, reject) => {
      const query = `SELECT 
  (SELECT COUNT(*) from cases) as caseLaws, 
  (SELECT COUNT(*)  from statutes) as statutes,
   (SELECT COUNT(*) from notifications) as notifications`;

      db.query(query, (err, result) => {
        if (err) {
          reject(new BadRequestResponse(err));
        }
        resolve(result);
      });
    }),

    new Promise((resolve, reject) => {
      db.query(
        `Select * from cases  as caseLaws  ORDER BY id DESC LIMIT 10`,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        },
      );
    }),
    new Promise((resolve, reject) => {
      db.query(
        `Select * from statutes as statutes ORDER BY id DESC LIMIT 10 `,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        },
      );
    }),
    new Promise((resolve, reject) => {
      db.query(
        `Select * from notifications as notifications ORDER BY id DESC LIMIT 10 `,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        },
      );
    }),
    new Promise((resolve, reject) => {
      db.query(
        `Select * from dictionary as dictionaries ORDER BY id DESC LIMIT 10`,
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        },
      );
    }),
  ]).then((values) => {
    next(
      new OkResponse({
        counts: values[0][0],
        caseLaws: values[1],
        statutes: values[2],
        notifications: values[3],
        dictionaries: values[4],
      }),
    );
  });
};

module.exports = { getCounts };
