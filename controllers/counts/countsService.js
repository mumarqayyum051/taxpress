const db = require("../../db");

const { BadRequestResponse, OkResponse } = require("express-http-response");

const getCounts = (req, res, next) => {
  const query = `SELECT 
  (SELECT COUNT(*) from cases) as caseLaws, 
  (SELECT COUNT(*)  from statutes) as statutes,
   (SELECT COUNT(*) from notifications) as notifications`;

  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err));
    }
    return res.send(new OkResponse(result[0]));
  });
};

module.exports = { getCounts };
