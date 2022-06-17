// @ts-nocheck
const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");
const path = require("path");
var base64ToFile = require("base64-to-file");

const uploadBgs = (req, res, next) => {
  const { path } = req.body;
  if (!path) {
    return next(new BadRequestResponse("Path is required"));
  }
  const isExist = `SELECT * FROM backgrounds WHERE path = '${path}'`;
  db.then((conn) => {
    conn.query(isExist, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      if (result.length > 0) {
        return next(
          new BadRequestResponse("Background already exist for this path", 400),
        );
      }
      try {
        let backgrounds = [];
        if (req.files.length) {
          for (const file of req.files) {
            const filePath = file?.path?.split("\\")?.join("/");
            const fileName = file?.filename;
            const originalname = file?.originalname;
            backgrounds.push({ filePath, fileName, originalname });
          }
          console.log(backgrounds);

          db.then((conn) => {
            const query = `INSERT INTO backgrounds (path, backgrounds) VALUES ('${path}','${JSON.stringify(
              backgrounds,
            )}')`;
            conn.query(query, (err, result) => {
              if (err) {
                return next(new BadRequestResponse(err.message, 400));
              }
              return next(new OkResponse("Background has been uploaded", 200));
            });
          }).catch((err) => {
            return next(new BadRequestResponse(err.message, 400));
          });
        }
      } catch (e) {
        console.log(e);
        return next(new BadRequestResponse(e, 400));
      }
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const getBgs = (req, res, next) => {
  const { path } = req.params;
  if (!path) {
    return next(new BadRequestResponse("Path is required"));
  }
  const query = `SELECT * FROM backgrounds WHERE path = '${path}'`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      if (result.length === 0) {
        return next(new BadRequestResponse("Background not found", 400));
      }
      return next(new OkResponse(result, 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};
module.exports = {
  uploadBgs,
  getBgs,
};
