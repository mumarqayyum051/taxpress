const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const addInsight = (req, res, next) => {
  let { shortParagraph, title, date } = req.body || req.body.insight;

  if (!shortParagraph || !title || !date) {
    return next(new BadRequestResponse("Please fill all the fields"));
  }
  try {
    shortParagraph = shortParagraph.replace(/'/g, "\\'");
    title = title.replace(/'/g, "\\'");
  } catch (e) {
    return next(new BadRequestResponse(e));
  }

  const filePath = req?.file?.path?.split("\\")?.join("/");
  const query = `INSERT INTO research_and_insight (shortParagraph, title, date,file) VALUES ('${shortParagraph}', '${title}', '${date}', '${filePath}')`;

  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return next(new OkResponse("Insight has been added successfully"));
    });
  });
};

const getAllInsights = (req, res, next) => {
  const query = `SELECT * FROM research_and_insight`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return next(new OkResponse(result));
    });
  });
};

const getTopInsights = (req, res, next) => {
  const query = `SELECT * FROM research_and_insight ORDER BY id DESC limit 10`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      }
      return next(new OkResponse(result));
    });
  });
};
module.exports = {
  addInsight,
  getAllInsights,
  getTopInsights,
};
