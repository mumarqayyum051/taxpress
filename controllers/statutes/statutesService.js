const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");
const path = require("path");
var base64ToFile = require("base64-to-file");

const addStatutes = (req, res, next) => {
  let { law_or_statute, chapter, section, textSearch1, textSearch2, file } =
    req.body || req.body.statutes;

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
  try {
    law_or_statute = law_or_statute.replace(/'/g, "\\'");
    chapter = chapter.replace(/'/g, "\\'");
    section = section.replace(/'/g, "\\'");
    textSearch1 = textSearch1.replace(/'/g, "\\'");
    textSearch2 = textSearch2.replace(/'/g, "\\'");
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }

  let filePath = req.file.path.split("\\").join("/");
  const query = `INSERT INTO statutes (law_or_statute, chapter, section, textSearch1, textSearch2, file) VALUES ('${law_or_statute}', '${chapter}', '${section}', '${textSearch1}', '${textSearch2}', '${filePath}')`;

  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return res.send(new OkResponse("Statutes has been created", 200));
    });
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
  db.then((conn) => {
    conn.query(search, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return res.send(new OkResponse(result, 200));
    });
  });
};

const getAllStatutes = (req, res, next) => {
  const query = `SELECT * FROM statutes`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return res.send(new OkResponse(result, 200));
    });
  });
};

const getStatutesOnly = (req, res, next) => {
  const query = `SELECT id,law_or_statute FROM statutes`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return res.send(new OkResponse(result, 200));
    });
  });
};

const getStatuteById = (req, res, next) => {
  const { id } = req.params;
  const query = `SELECT * FROM statutes WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return res.send(new OkResponse(result, 200));
    });
  });
};
const deleteStatute = (req, res, next) => {
  const { id } = req.params;
  const query = `DELETE FROM statutes WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return res.send(new OkResponse("Statute deleted successfully", 200));
    });
  });
};

const editStatutesById = (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  let { law_or_statute, chapter, section, textSearch1, textSearch2, file } =
    req.body || req.body.statutes;

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

  try {
    law_or_statute = law_or_statute.replace(/'/g, "\\'");
    chapter = chapter.replace(/'/g, "\\'");
    section = section.replace(/'/g, "\\'");
    textSearch1 = textSearch1.replace(/'/g, "\\'");
    textSearch2 = textSearch2.replace(/'/g, "\\'");
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }

  if (!file.includes("uploads")) {
    const _path = path.join(process.cwd(), "public", "uploads/");
    base64ToFile.convert(
      file,
      _path,
      ["jpg", "jpeg", "png", "pdf"],
      (_filePath) => {
        var pathname = new URL(_filePath).pathname;
        var filePath = pathname.split("\\").splice(-2).join("/");

        let update = `UPDATE statutes SET law_or_statute = '${law_or_statute}', chapter = '${chapter}', section = '${section}', textSearch1 = '${textSearch1}', textSearch2 = '${textSearch2}', file = '${filePath}' WHERE id = ${id}`;
        db.query(update, (err, result) => {
          if (err) {
            return next(new BadRequestResponse(err.message, 400));
          }
          return res.send(
            new OkResponse("Statute has been updated successfully", 200),
          );
        });
      },
    );
  } else {
    let update = `UPDATE statutes SET law_or_statute = '${law_or_statute}', chapter = '${chapter}', section = '${section}', textSearch1 = '${textSearch1}', textSearch2 = '${textSearch2}', file = '${file}' WHERE id = ${id}`;

    db.query(update, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err, 400));
      } else {
        return res.send(
          new OkResponse("Statute has been updated successfully", 200),
        );
      }
    });
  }
};
module.exports = {
  addStatutes,
  searchStatutes,
  getAllStatutes,
  getStatutesOnly,
  editStatutesById,
  getStatuteById,
  deleteStatute,
};
