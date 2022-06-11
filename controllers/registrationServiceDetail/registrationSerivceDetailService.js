const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const createServiceDetail = (req, res, next) => {
  let { title, fee, completionTime, highlights, type, superCategory } =
    req.body || req.body.registrationServiceDetail;
  if (
    !title ||
    !fee ||
    !completionTime ||
    !highlights ||
    !type ||
    !superCategory
  ) {
    return next(new BadRequestResponse("Please fill all the fields", 400));
  }

  const allowedSuperCategories = ["Oversease", "Normal"];
  if (!allowedSuperCategories.includes(superCategory)) {
    return next(
      new BadRequestResponse(
        "Can't create service type other than Oversease and Normal",
        400,
      ),
    );
  }
  const isAlreadyExist = `select * from registration_service_details where title = '${title}' and type = '${type}' and superCategory = '${superCategory}'`;
  db.then((conn) => {
    conn.query(isAlreadyExist, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      if (result.length) {
        return next(
          new BadRequestResponse(
            "Service already exist with same title and type",
            400,
          ),
        );
      }
      const isExist = `Select * from registration_service_type where title = '${type}' and superCategory = '${superCategory}'`;

      db.then((conn) => {
        conn.query(isExist, (err, result) => {
          if (err) {
            return next(new BadRequestResponse(err.message, 400));
          }
          if (result.length === 0) {
            return next(
              new BadRequestResponse("Service type doesn't exist", 400),
            );
          }
          try {
            if (title) {
              title = title.replace(/'/g, "\\'");
            }
          } catch (e) {
            return next(new BadRequestResponse(e, 400));
          }
          // highlights = JSON.stringify(highlights);
          const query = `Insert into registration_service_details ( title, fee, completionTime, highlights, type,superCategory, typeId ) values('${title}', '${fee}', '${completionTime}', '${highlights}', '${type}', '${superCategory}', '${result[0].id}')`;
          db.then((conn) => {
            conn.query(query, (err, result) => {
              if (err) {
                return next(new BadRequestResponse(err.message, 400));
              }
              return next(
                new OkResponse("Service detail has been created", 200),
              );
            });
          }).catch((err) => {
            return next(new BadRequestResponse(err.message, 400));
          });
        });
      }).catch((err) => {
        return next(new BadRequestResponse(err.message, 400));
      });
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
  const query = `Select registration_service_details.* from registration_service_details`;
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

// const getDetailedServicesById = (req, res, next) => {
//   const id = req.params.id;
//   if (!id) {
//     return next(new BadRequestResponse("Please provide Id"));
//   }
//   db.then((conn) => {
//     const query = `select * from registration_service_details where registration_type_id = ${id}`;
//     conn.query(query, (err, result) => {
//       if (err) {
//         return next(new BadRequestResponse(err.message, 400));
//       }
//       return next(new OkResponse(result, 200));
//     });
//   }).catch((err) => {
//     return next(new BadRequestResponse(err.message, 400));
//   });
// };

const getDetailByType = (req, res, next) => {
  const typeId = req.params.typeId;
  const superCategory = req.params.superCategory;
  const id = req.params.id;
  if (!typeId || !superCategory || !id) {
    return next(
      new BadRequestResponse("Please provide valid parameteres", 400),
    );
  }
  db.then((conn) => {
    const query = `select * from registration_service_details where superCategory = '${superCategory}' and typeId = ${typeId}`;
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
  createServiceDetail,
  deleteSerivce,
  getAllServices,
  getDetailByType,
};
