const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createRegistrationServiceType = (req, res, next) => {
  let { title, registration_service_id } =
    req.body || req.body.registrationServiceType;
  if (!title || !registration_service_id) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }
  try {
    if (title) {
      title = title.replace(/'/g, "\\'");
    }
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }

  const query = `Insert into registration_service_type ( title, registration_service_id ) values('${title}', '${registration_service_id}')`;

  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Service type has been created", 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const deleteRegistrationServiceType = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new BadRequestResponse("Please provide an id", 400));
  }
  const query = `Delete from registration_service_type where id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Service type has been deleted", 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};
module.exports = {
  createRegistrationServiceType,
  deleteRegistrationServiceType,
};
