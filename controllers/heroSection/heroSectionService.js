// @ts-ignore
const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

// @ts-ignore
const createHeroSection = async (req, res, next) => {
  const { btnText, btnLink } = req.body;
  if (!btnText || !btnLink) {
    // @ts-ignore
    return next(new BadRequestResponse("Missing required fields"));
  }

  const ifExists = `SELECT COUNT(*) as count  FROM hero_section`;

  db.then((conn) => {
    conn.query(ifExists, (err, result) => {
      if (err) {
        // @ts-ignore
        return next(new BadRequestResponse(err.message));
      }
      console.log(result);
      if (result.length && result[0].count > 0) {
        // @ts-ignore
        return next(
          // @ts-ignore

          new BadRequestResponse(
            "Hero section already exists. Please delete the previous one to create a new one",
          ),
        );
      }
      const query = `INSERT INTO hero_section (btnText, btnLink) VALUES ('${btnText}', '${btnLink}')`;
      // @ts-ignore
      conn.query(query, (err, result) => {
        if (err) {
          // @ts-ignore
          return next(new BadRequestResponse(err.message));
        }
        // @ts-ignore
        return next(new OkResponse("Hero section created successfully"));
      });
    });
  }).catch((err) => {
    console.log(err);
    // @ts-ignore
    return next(new BadRequestResponse(err));
  });
};

// @ts-ignore
const deleteheroSection = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    // @ts-ignore
    return next(new BadRequestResponse("Missing required fields"));
  }

  const query = `DELETE FROM hero_section WHERE id = ${id}`;

  db.then((conn) => {
    // @ts-ignore
    conn.query(query, (err, result) => {
      if (err) {
        // @ts-ignore
        return next(new BadRequestResponse(err.message));
      }
      // @ts-ignore
      return next(new OkResponse("Hero section deleted successfully"));
    });
  }).catch((err) => {
    console.log(err);
    // @ts-ignore
    return next(new BadRequestResponse(err));
  });
};

const getHeroSection = (req, res, next) => {
  const query = `SELECT * FROM hero_section`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        // @ts-ignore
        return next(new BadRequestResponse(err.message));
      }
      // @ts-ignore
      return next(new OkResponse(result));
    });
  }).catch((err) => {
    console.log(err);
    // @ts-ignore
    return next(new BadRequestResponse(err));
  });
};
module.exports = {
  createHeroSection,
  deleteheroSection,
  getHeroSection,
};
