const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createService = (req, res, next) => {
  let { title, description } = req.body || req.body.service;
  if (!title || !description) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }
  try {
    if (title) {
      title = title.replace(/'/g, "\\'");
    }
    if (description) {
      description = description.replace(/'/g, "\\'");
    }
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }
  let filePath = req?.file?.path?.split("\\")?.join("/");
  let query = `Insert into registration_services ( title, description, file ) values('${title}', '${description}', '${filePath}')`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Service has been created", 200));
    });
  });
};

const deleteSerivce = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new BadRequestResponse("Please provide an id", 400));
  }
  let query = `Delete from registration_services where id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Service has been deleted", 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

module.exports = {
  createService,
  deleteSerivce,
};
