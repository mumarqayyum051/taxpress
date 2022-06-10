const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const addOrdinanceDetail = (req, res, next) => {
  let { title, ordinance_id } = req.body || req.body.ordinance_detail;

  if (!title || !ordinance_id) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }
  try {
    if (title) {
      title = title.replace(/'/g, "\\'");
    }
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }
  const filePath = req?.file?.path?.split("\\")?.join("/");
  let query = `Insert into ordinance_details ( title, ordinance_id, file ) values('${title}', '${ordinance_id}', '${filePath}')`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Ordinance detail has been added", 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const getOrdinanceDetail = (req, res, next) => {
  let query = `Select * from ordinance_details where ordinance_id`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse(result, 200));
    });
  });
};
const deleteOrdinanceDetail = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new BadRequestResponse("Please provide an id", 400));
  }
  let query = `Delete from ordinance_details where id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Ordinance has been deleted", 200));
    });
  });
};
module.exports = {
  addOrdinanceDetail,
  getOrdinanceDetail,
  deleteOrdinanceDetail,
};
