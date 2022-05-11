const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const addStatutes = (req, res, next) => {
  const { law_or_statute_id, chapter, section, textSearch1, textSearch2 } =
    req.body || req.body.statutes;
  const filePath = req.files[0].path;

  var domain = req.headers.host;
  var pathname = new URL(filePath).pathname;
  var file = pathname.split("\\").splice(-2).join("/");
  if (
    !law_or_statute_id ||
    !chapter ||
    !section ||
    !textSearch1 ||
    !textSearch2 ||
    !file
  ) {
    return res.send(
      new BadRequestResponse("Please fill all the required fields"),
    );
  }

  const query = `INSERT INTO statutes (law_or_statute_id, chapter, section, textSearch1, textSearch2, file) VALUES ('${law_or_statute_id}', '${chapter}', '${section}', '${textSearch1}', '${textSearch2}', '${file}')`;

  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err.message, 400));
    }
    return res.send(new OkResponse("Statutes has been created", 200));
  });
};

const searchStatutes = (req, res, next) => {
  const { law_or_statute_id, chapter, section, textSearch1, textSearch2 } =
    req.body || req.body.statutes;

  console.log(req.body);

  let search = `SELECT * FROM statutes WHERE `;
  if (law_or_statute_id) {
    search += `law_or_statute_id = '${law_or_statute_id}' AND `;
  }
  if (chapter) {
    search += `chapter = '${chapter}' AND `;
  }
  if (section) {
    search += `section = '${section}' AND `;
  }
  if (textSearch1) {
    search += `textSearch1 = '${textSearch1}' AND `;
  }
  if (textSearch2) {
    search += `textSearch2 = '${textSearch2}'`;
  }

  search = search.split("AND").slice(0, -1).join("AND");
  console.log(search);
  db.query(search, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err.message, 400));
    }
    return res.send(new OkResponse(result, 200));
  });
};

module.exports = { addStatutes, searchStatutes };
