const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createService = (req, res, next) => {
  const {
    serviceName,
    serviceType,
    serviceFee,
    serviceCompletionTime,
    serviceHighlights,
  } = req.body.service || req.body;

  console.log(
    !serviceName ||
      !serviceType ||
      !serviceFee ||
      !serviceCompletionTime ||
      !serviceHighlights,
  );
  if (
    !serviceName ||
    !serviceType ||
    !serviceFee ||
    !serviceCompletionTime ||
    !serviceHighlights
  ) {
    return next(new BadRequestResponse("Missing required fields"));
  }
  const query = `INSERT INTO services (serviceName,
    serviceType,
    serviceFee,
    serviceCompletionTime,
    serviceHighlights) VALUES ('${serviceName}', '${serviceType}', '${serviceFee}', '${serviceCompletionTime}', '${serviceHighlights}')`;
  db.query(query, (err, result) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    return res.status(200).send(new OkResponse("Service Created", 200));
  });
};

const getServiceById = (req, res, next) => {
  const { serviceID } = req.params;
  const query = `SELECT * FROM services WHERE id = ${serviceID}`;
  db.query(query, (err, result) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    if (result.length) {
      //convert blob to string
      let string = Buffer.from(
        result[0].serviceHighlights,
        "binary",
      ).toString();
      result[0].serviceHighlights = string.split(",");
    }
    return res.status(200).send(new OkResponse(result[0], 200));
  });
};
const editServiceById = (req, res, next) => {
  const {
    serviceName,
    serviceType,
    serviceFee,
    serviceCompletionTime,
    serviceHighlights,
  } = req.body.service || req.body;
  const { serviceID } = req.params;
  db.query(`select * from services where id = ${serviceID}`, (err, result) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    if (result.lengt === 0) {
      return next(new BadRequestResponse("Service not found"));
    }
    if (result.length > 0) {
      const query = `UPDATE services SET serviceName = '${serviceName}',
    serviceType = '${serviceType}',
    serviceFee = '${serviceFee}',
    serviceCompletionTime = '${serviceCompletionTime}',
    serviceHighlights = '${serviceHighlights}'
    WHERE id = ${serviceID}`;
      db.query(query, (err, result) => {
        if (err) {
          return next(new BadRequestResponse(err));
        }
        return res.status(200).send(new OkResponse("Service Updated", 200));
      });
    }
  });
};
const deleteServiceById = (req, res, next) => {
  const { serviceID } = req.params;
  const query = `DELETE FROM services WHERE id = ${serviceID}`;
  db.query(query, (err, result) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    return res.status(200).send(new OkResponse("Service Deleted", 200));
  });
};
const getAllServices = (req, res, next) => {
  const query = `SELECT * FROM services`;
  db.query(query, (err, result) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    if (result.length > 0) {
      for (const service of result) {
        let string = Buffer.from(
          service.serviceHighlights,
          "binary",
        ).toString();
        service.serviceHighlights = string.split(",");
      }
    }
    return res.status(200).send(new OkResponse(result, 200));
  });
};
const createServiceCategory = (req, res, next) => {
  const { serviceCategoryName } = req.body.serviceType || req.body;
  if (!serviceCategoryName) {
    return next(new BadRequestResponse("Missing required fields"));
  }
  const query = `Insert into servicetypes (serviceCategoryName) values ('${serviceCategoryName}')`;
  db.query(query, (err, result) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    return res
      .status(200)
      .send(new OkResponse("Service Category Created", 200));
  });
};
const getServicesByServiceType = (req, res, next) => {
  const { serviceTypeID } = req.params;
  const query = `SELECT * FROM services WHERE serviceType = '${serviceTypeID}'`;
  db.query(query, (err, result) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    if (result.length > 0) {
      for (const service of result) {
        let string = Buffer.from(
          service.serviceHighlights,
          "binary",
        ).toString();
        service.serviceHighlights = string.split(",");
      }
    }
    return res.status(200).send(new OkResponse(result, 200));
  });
};
module.exports = {
  createService,
  editServiceById,
  deleteServiceById,
  getServiceById,
  getAllServices,
  createServiceCategory,
  getServicesByServiceType,
};
