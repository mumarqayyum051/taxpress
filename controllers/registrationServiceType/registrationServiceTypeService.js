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
  db.then((conn) => {
    Promise.all([
      new Promise((resolve, reject) => {
        let query = `Delete from registration_service_type where id = ${id}`;
        conn.query(query, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        const query = `Delete from registration_service_details where registration_type_id = ${id}`;
        conn.query(query, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      }),
    ])
      .then((result) => {
        return next(
          new OkResponse(
            "Service type and its corresponding childs have been deleted",
            200,
          ),
        );
      })
      .catch((e) => {
        return next(new BadRequestResponse(e, 400));
      });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const getAllRegistrationServiceTypes = (req, res, next) => {
  const query = `Select registration_service_type.*,registration_services.title as service, registration_services.id as serviceId from  registration_service_type left join registration_services on  registration_service_type.registration_service_id = registration_services.id`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse(result, 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};
module.exports = {
  createRegistrationServiceType,
  deleteRegistrationServiceType,
  getAllRegistrationServiceTypes,
};
