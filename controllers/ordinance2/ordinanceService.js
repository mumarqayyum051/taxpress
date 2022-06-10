const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const addOrdinance = (req, res, next) => {
  let { type_name, detail } = req.body || req.body.ordinance;
  if (!type_name || !detail) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }
  try {
    if (type_name) {
      type_name = type_name.replace(/'/g, "\\'");
    }
    if (detail) {
      detail = detail.replace(/'/g, "\\'");
    }
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }
  let query = `Insert into ordinance ( type_name, detail ) values('${type_name}', '${detail}')`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Ordinance has been added", 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const deleteOrdinance = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new BadRequestResponse("Please provide an id", 400));
  }

  db.then((conn) => {
    Promise.all([
      new Promise((resolve, reject) => {
        const query = `Delete from ordinance where id = ${id}`;
        conn.query(query, (err, result) => {
          if (err) {
            reject(new BadRequestResponse(err.message, 400));
          }
          resolve(result);
        });
      }),
      new Promise((resolve, reject) => {
        const query = `Delete from ordinance_details where ordinance_id = ${id}`;
        conn.query(query, (err, result) => {
          if (err) {
            reject(new BadRequestResponse(err.message, 400));
          }
          resolve(result);
        });
      }),
    ])
      .then((values) => {
        return next(
          new OkResponse(
            "Ordinance and its corresponding childs have been deleted",
            200,
          ),
        );
      })
      .catch((err) => {});
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  });
};

const getAllOrdinanceByType = (req, res, next) => {
  const type = req.params.type;
  const query = `select * from ordinance where type_name = '${type}'`;
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

const getAllOrdinance = (req, res, next) => {
  const query = `select * from ordinance`;
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
  addOrdinance,
  deleteOrdinance,
  getAllOrdinanceByType,
  getAllOrdinance,
};
