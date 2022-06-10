const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createService = (req, res, next) => {
  let { title, description, superCategory } = req.body || req.body.service;
  if (!title || !description || !superCategory) {
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
  let query = `Insert into registration_services ( title, description,superCategory, file ) values('${title}', '${description}', '${superCategory}','${filePath}')`;
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
    Promise.all([
      new Promise((resolve, reject) => {
        let query = `Delete from registration_services where id = ${id}`;
        conn.query(query, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        const query = `Delete from registration_service_type where registration_service_id = ${id}`;
        conn.query(query, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        const query = `Delete from registration_service_details where registration_service_id = ${id}`;
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
            "Service and its corresponding childs have been deleted ",
            200,
          ),
        );
      })
      .catch((e) => {
        return next(new BadRequestResponse(e, 400));
      });
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
