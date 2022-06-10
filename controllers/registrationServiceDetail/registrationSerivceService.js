const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createServiceDetail = (req, res, next) => {
  let {
    title,
    fee,
    completionTime,
    highlights,
    registration_service_id,
    registration_type_id,
  } = req.body || req.body.registrationServiceDetail;
  if (
    !title ||
    !fee ||
    !completionTime ||
    !highlights ||
    !registration_service_id ||
    !registration_type_id
  ) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }
  try {
    if (title) {
      title = title.replace(/'/g, "\\'");
    }
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }
  // highlights = JSON.stringify(highlights);
  const query = `Insert into registration_service_details ( title, fee, completionTime, highlights, registration_service_id, registration_type_id ) values('${title}', '${fee}', '${completionTime}', '${highlights}', '${registration_service_id}', '${registration_type_id}')`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Service detail has been created", 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const deleteSerivce = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new BadRequestResponse("Please provide an id", 400));
  }
  const query = `Delete from registration_service_details where id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Service detail has been deleted", 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const getAllServices = (req, res, next) => {
  const query = `Select * from registration_service_details`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      // if (result.length) {
      //   for (let service of result) {
      //     service.highlights = JSON.parse(service.highlights);
      //   }
      //   return next(new OkResponse(result, 200));
      // }
      return next(new OkResponse(result, 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};
module.exports = {
  createServiceDetail,
  deleteSerivce,
  getAllServices,
};
