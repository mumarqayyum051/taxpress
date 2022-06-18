// @ts-ignore
const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const changeAboutUs = (req, res, next) => {
  const { youtubeVideoId } = req.body;

  const ifExists = `SELECT COUNT(*) as count FROM about_us`;
  db.then((conn) => {
    conn.query(ifExists, (err, result) => {
      if (err) {
        // @ts-ignore
        return next(new BadRequestResponse(err.message));
      }
      if (result.length && result[0].count > 0) {
        return next(
          // @ts-ignore
          new BadRequestResponse(
            "About us already exists. Please delete the previous one to create a new one",
          ),
        );
      }
      const filePath = req?.file?.path?.split("\\")?.join("/");
      const query = `Insert into about_us (youtubeVideoId, file) values ('${youtubeVideoId}', '${filePath}')`;

      db.then((conn) => {
        // @ts-ignore
        conn.query(query, (err, result) => {
          if (err) {
            // @ts-ignore
            return next(new BadRequestResponse(err.message, 400));
          }
          // @ts-ignore
          return next(new OkResponse("About Us has been changed", 200));
        });
      }).catch((err) => {
        // @ts-ignore
        return next(new BadRequestResponse(err.message, 400));
      });
    });
  }).catch((err) => {
    // @ts-ignore
    return next(new BadRequestResponse(err.message, 400));
  });
};

const deleteAboutUs = (req, res, next) => {
  const { id } = req.params;
  const query = `DELETE FROM about_us WHERE id = ${id}`;
  db.then((conn) => {
    // @ts-ignore
    conn.query(query, (err, result) => {
      if (err) {
        // @ts-ignore
        return next(new BadRequestResponse(err.message, 400));
      }
      // @ts-ignore
      return next(new OkResponse("About Us has been deleted", 200));
    });
  }).catch((err) => {
    // @ts-ignore
    return next(new BadRequestResponse(err.message, 400));
  });
};

// @ts-ignore
const getAboutUs = (req, res, next) => {
  const query = `SELECT * FROM about_us`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        // @ts-ignore
        return next(new BadRequestResponse(err.message, 400));
      }
      // @ts-ignore
      return next(new OkResponse(result, 200));
    });
  }).catch((err) => {
    // @ts-ignore
    return next(new BadRequestResponse(err.message, 400));
  });
};
module.exports = {
  changeAboutUs,
  deleteAboutUs,
  getAboutUs,
};
