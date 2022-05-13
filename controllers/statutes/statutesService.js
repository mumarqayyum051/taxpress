const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const addStatutes = (req, res, next) => {
  const { law_or_statute, chapter, section, textSearch1, textSearch2 } =
    req.body || req.body.statutes;
  const filePath = req.files[0].path;

  var domain = req.headers.host;
  var pathname = new URL(filePath).pathname;
  var file = pathname.split("\\").splice(-2).join("/");
  if (
    !law_or_statute ||
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

  const query = `INSERT INTO statutes (law_or_statute, chapter, section, textSearch1, textSearch2, file) VALUES ('${law_or_statute}', '${chapter}', '${section}', '${textSearch1}', '${textSearch2}', '${file}')`;

  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err.message, 400));
    }
    return res.send(new OkResponse("Statutes has been created", 200));
  });
};

const searchStatutes = (req, res, next) => {
  const { law_or_statute, chapter, section, textSearch1, textSearch2 } =
    req.body || req.body.statutes;

  console.log(req.body);

  let search = `SELECT * FROM statutes WHERE `;
  if (law_or_statute) {
    search += `law_or_statute LIKE '%${law_or_statute}%' OR `;
  }
  if (chapter) {
    search += `chapter LIKE '%${chapter}%' OR `;
  }
  if (section) {
    search += `section LIKE '%${section}%' OR `;
  }
  if (textSearch1) {
    search += `textSearch1 LIKE '%${textSearch1}%' OR `;
  }
  if (textSearch2) {
    search += `textSearch2 LIKE '%${textSearch2}'`;
  }

  console.log(search);
  search = search.trim();
  if (search.includes("OR") && search.endsWith("OR")) {
    search = search.split("OR").slice(0, -1).join(" OR ");
  }
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

const getAllStatutes = (req, res, next) => {
  const query = `SELECT * FROM statutes`;
  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err.message, 400));
    }
    return res.send(new OkResponse(result, 200));
  });
};

const getStatutesOnly = (req, res) => {
  const query = `SELECT id,law_or_statute FROM statutes`;
  db.query(query, (err, result) => {
    if (err) {
      return res.send(new BadRequestResponse(err.message, 400));
    }
    return res.send(new OkResponse(result, 200));
  });
};
module.exports = {
  addStatutes,
  searchStatutes,
  getAllStatutes,
  getStatutesOnly,
};
