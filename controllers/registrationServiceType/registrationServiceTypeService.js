const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createRegistrationServiceType = (req, res, next) => {
  let { title, superCategory } = req.body || req.body.registrationServiceType;
  if (!title || !superCategory) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }

  const allowedSuperCategories = ["Overseas", "Normal"];
  if (!allowedSuperCategories.includes(superCategory)) {
    return next(
      new BadRequestResponse(
        "Can't create service type other than Overseas and Normal",
        400,
      ),
    );
  }
  try {
    if (title) {
      title = title.replace(/'/g, "\\'");
    }
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }

  const ifExist = `Select * from registration_service_type where title = '${title}' and superCategory = '${superCategory}'`;
  db.then((conn) => {
    conn.query(ifExist, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      if (result.length > 0) {
        return next(
          new BadRequestResponse(
            "Service type with this name already exists",
            400,
          ),
        );
      }

      const query = `Insert into registration_service_type ( title, superCategory ) values('${title}', '${superCategory}')`;

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
    const query = `Delete from registration_service_type where id = ${id}`;
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

const getAllRegistrationServiceTypes = (req, res, next) => {
  const query = `Select * from registration_service_type`;
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

const getTypesByServiceId = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new BadRequestResponse("Please provide an id", 400));
  }
  db.then((conn) => {
    const query = `Select * from registration_service_type where registration_service_id = ${id}`;
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

const getTypesByServiceType = (req, res, next) => {
  const type = req.params.type;
  const allowedTypes = ["Overseas", "Normal"];
  if (!type || !allowedTypes.includes(type)) {
    return next(new BadRequestResponse("Please provide a valid type", 400));
  }
  db.then((conn) => {
    const query = `Select * from registration_service_type where superCategory = '${type}'`;
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
  getTypesByServiceId,
  getTypesByServiceType,
};
