const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const add = (req, res, next) => {
  const { word, meaning, sld } = req.body || req.body.dictionary;

  const filePath = req.files[0].path;

  var domain = req.headers.host;
  var pathname = new URL(filePath).pathname;
  var file = pathname.split("\\").splice(-2).join("/");
  if (!word || !meaning || !sld || !file) {
    return res.send(new BadRequestResponse("Please fill all the fields"));
  }
  const query = `INSERT INTO dictionary (word, meaning, sld, file) VALUES ('${word}', '${meaning}', '${sld}', '${file}')`;

  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err.message, 400));
    }
    return res.send(new OkResponse("Word has been added to dictionary", 200));
  });
};

const search = (req, res, next) => {
  const { word, meaning, sld } = req.body || req.body.dictionary;
  let search = `SELECT * FROM dictionary WHERE `;
  if (word) {
    search += `word Like '%${word}%' AND `;
  }
  if (meaning) {
    search += `meaning Like '%${meaning}%' AND `;
  }
  if (sld) {
    search += `sld Like '%${sld}%'`;
  }

  search = search.split("AND").slice(0, -1).join("AND");
  db.query(search, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err.message, 400));
    }
    return res.send(new OkResponse(result, 200));
  });
};

module.exports = { add, search };
