const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createService = (req, res, next) => {
  let { title, description, superCategory, serviceCategory } =
    req.body || req.body.service;
  if (!title || !description || !superCategory || !serviceCategory) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }
  const allowedServices = ["registration_service", "incomeTax_service"];
  if (!allowedServices.includes(serviceCategory)) {
    return next(
      new BadRequestResponse(
        "Cannot create service other than Registration and Income Tax",
        400,
      ),
    );
  }
  if (serviceCategory === "registration_service") {
    serviceCategory = "Registration Service";
  }
  if (serviceCategory === "incomeTax_service") {
    serviceCategory = "Income Tax Service";
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
  let query = `Insert into registration_services ( title, description,superCategory,serviceCategory, file ) values('${title}', '${description}', '${superCategory}', '${serviceCategory}','${filePath}')`;
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
  db.then((conn) => {
    const query = `Delete from registration_services where id = ${id}`;
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Service has been deleted", 200));
    });
  }).catch((e) => {
    return next(new BadRequestResponse(e, 400));
  });
};

const getServices = (req, res, next) => {
  const superCategory = req.params.superCategory;
  if (!superCategory) {
    return next(new BadRequestResponse("Please provide a superCategory", 400));
  }
  db.then((conn) => {
    let query = `Select * from registration_services where superCategory = '${superCategory}'`;
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse(result, 200));
    });
  }).catch((e) => {
    return next(new BadRequestResponse(e, 400));
  });
};
const getAllServices = (req, res, next) => {
  db.then((conn) => {
    let query = `Select * from registration_services`;
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse(result, 200));
    });
  }).catch((e) => {
    return next(new BadRequestResponse(e, 400));
  });
};
module.exports = {
  createService,
  deleteSerivce,
  getServices,
  getAllServices,
};
