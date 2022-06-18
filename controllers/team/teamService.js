const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");
const path = require("path");
var base64ToFile = require("base64-to-file");

const addMember = (req, res, next) => {
  let { name, about, linkedIn, facebook, instagram, designation, file } =
    req.body || req.body.team;

  console.log(req.body);
  if (!name || !about || !designation) {
    return res
      .status(400)
      .send(new BadRequestResponse("Please fill all the required fields"));
  }

  try {
    about = about.replace(/'/g, "\\'");
  } catch (e) {
    console.log(e);
  }
  let filePath = req?.file?.path?.split("\\")?.join("/");
  const query = `INSERT INTO team (name, about, linkedIn, facebook, instagram, designation, file) VALUES ('${name}', '${about}', '${linkedIn}', '${facebook}', '${instagram}', '${designation}', '${filePath}')`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Member has been added to the team", 200));
    });
  });
};

const editMember = (req, res, next) => {
  const id = req.params.id;
  const { name, about, linkedIn, facebook, instagram, designation, file } =
    req.body || req.body.team;

  try {
    if (!name || !about || !designation) {
      return res.status(400).send("Please fill all the required fields");
    }
    if (!file?.includes("uploads")) {
      let filePath = req?.file?.path?.split("\\")?.join("/");

      const query = `UPDATE team SET name = '${name}', about = '${about}', linkedIn = '${linkedIn}', facebook = '${facebook}', instagram = '${instagram}', designation = '${designation}', file = '${filePath}' WHERE id = ${id}`;
      db.then((conn) => {
        conn.query(query, (err, result) => {
          if (err) {
            return next(new BadRequestResponse(err.message, 400));
          }
          return next(
            new OkResponse(
              "Member details have been updated successfully",
              200,
            ),
          );
        });
      });
    } else {
      const query = `UPDATE team SET name = '${name}', about = '${about}', linkedIn = '${linkedIn}', facebook = '${facebook}', instagram = '${instagram}', designation = '${designation}', file = '${file}' WHERE id = ${id}`;

      db.then((conn) => {
        conn.query(query, (err, result) => {
          if (err) {
            return next(new BadRequestResponse(err, 400));
          } else {
            return next(
              new OkResponse(
                "Member details have been updated successfully",
                200,
              ),
            );
          }
        });
      });
    }
  } catch (e) {
    return next(new BadRequestResponse(e));
  }
};

const deleteMember = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .send(new BadRequestResponse("Please fill all the required fields"));
  }
  const query = `DELETE FROM team WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Member has been deleted from the team", 200));
    });
  });
};

const getAllMembers = (req, res, next) => {
  const query = `SELECT * FROM team`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse(result, 200));
    });
  });
};

const getMember = (req, res, next) => {
  const id = req.params.id;
  const query = `SELECT * FROM team WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      if (result.length) {
        return next(new OkResponse(result[0], 200));
      }
      return next(new OkResponse(result, 200));
    });
  });
};

module.exports = {
  addMember,
  editMember,
  deleteMember,
  getMember,
  getAllMembers,
};
