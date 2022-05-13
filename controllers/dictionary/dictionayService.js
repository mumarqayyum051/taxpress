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
    search += `word LIKE '%${word}%' OR `;
  }
  if (meaning) {
    search += `meaning LIKE '%${meaning}%' OR `;
  }
  if (sld) {
    search += `sld LIKE '%${sld}%'`;
  }
  console.log(search);
  search = search.trim();
  if (search.includes("OR") && search.endsWith("OR")) {
    search = search.split("OR").slice(0, -1).join(" OR ");
  }
  console.log(search.includes("LIKE"));
  if (!search.includes("LIKE")) {
    return res
      .status(422)
      .send(
        new BadRequestResponse("Please pass at least one search parameter"),
      );
  }
  console.log("-result---", search);
  db.query(search, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err.message, 400));
    }
    return res.send(new OkResponse(result, 200));
  });
};

module.exports = { add, search };
