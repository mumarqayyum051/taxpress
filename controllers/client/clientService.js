// @ts-ignore
// @ts-ignore
const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

// @ts-ignore
// @ts-ignore
const addClient = (req, res, next) => {
  let { clientName, clientDesignation, comment, review, reviewTitle } =
    req.body;
  try {
    clientName = clientName.replace(/'/g, "\\'");
    clientDesignation = clientDesignation.replace(/'/g, "\\'");
  } catch (e) {
    // @ts-ignore
    return next(new BadRequestResponse(e, 400));
  }

  const filePath = req?.file?.path?.split("\\")?.join("/");

  const query = `INSERT INTO clients  (clientName, clientDesignation, comment, review, reviewTitle, file) VALUES ('${clientName}','${clientDesignation}', '${comment}', '${review}', '${reviewTitle}', '${filePath}')`;
  db.then((conn) => {
    // @ts-ignore
    // @ts-ignore
    conn.query(query, (err, result) => {
      if (err) {
        // @ts-ignore
        return next(new BadRequestResponse(err.message, 400));
      }
      // @ts-ignore
      return next(new OkResponse("Client has been created", 200));
    });
  }).catch((err) => {
    // @ts-ignore
    return next(new BadRequestResponse(err.message, 400));
  });
};
// @ts-ignore
// @ts-ignore
const getClients = (req, res, next) => {
  const query = `SELECT * FROM clients`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        // @ts-ignore
        return next(new BadRequestResponse(err.message, 400));
      }
      // @ts-ignore
      return next(new OkResponse(result, 200));
    });
  }).catch((err) => {
    // @ts-ignore
    return next(new BadRequestResponse(err.message, 400));
  });
};
// @ts-ignore
// @ts-ignore
const deleteClient = (req, res, next) => {
  const { id } = req.params;
  const query = `DELETE FROM clients WHERE id = ${id}`;
  db.then((conn) => {
    // @ts-ignore
    // @ts-ignore
    conn.query(query, (err, result) => {
      if (err) {
        // @ts-ignore
        return next(new BadRequestResponse(err.message, 400));
      }
      // @ts-ignore
      return next(new OkResponse("Client has been deleted", 200));
    });
  }).catch((err) => {
    // @ts-ignore
    return next(new BadRequestResponse(err.message, 400));
  });
};

// @ts-ignore
// @ts-ignore
const editClient = (req, res, next) => {
  let { clientName, clientDesignation, comment, review, file, reviewTitle } =
    req.body;
  try {
    clientName = clientName.replace(/'/g, "\\'");
    clientDesignation = clientDesignation.replace(/'/g, "\\'");
  } catch (e) {
    // @ts-ignore
    return next(new BadRequestResponse(e, 400));
  }

  const filePath = req?.file?.path?.split("\\")?.join("/");
  if (!file?.includes("upload")) {
    // const filePath = req?.file?.path?.split("\\")?.join("/");
    const query = `UPDATE clients SET clientName = '${clientName}', clientDesignation = '${clientDesignation}', comment = '${comment}', review = '${review}', reviewTitle = '${reviewTitle}', file = '${filePath}' WHERE id = ${req.params.id}`;
    db.then((conn) => {
      // @ts-ignore
      conn.query(query, (err, result) => {
        if (err) {
          // @ts-ignore
          return next(new BadRequestResponse(err, 400));
        } else {
          return next(
            // @ts-ignore
            new OkResponse("Blog has been updated successfully", 200),
          );
        }
      });
    });
  } else {
    const query = `UPDATE clients SET clientName = '${clientName}', clientDesignation = '${clientDesignation}', comment = '${comment}', review = '${review}', reviewTitle = '${reviewTitle}', file = '${file}' WHERE id = ${req.params.id}`;

    db.then((conn) => {
      // @ts-ignore
      conn.query(query, (err, result) => {
        if (err) {
          // @ts-ignore
          return next(new BadRequestResponse(err, 400));
        } else {
          return next(
            // @ts-ignore
            new OkResponse("Blog has been updated successfully", 200),
          );
        }
      });
    });
  }
};
module.exports = {
  addClient,
  editClient,
  getClients,
  deleteClient,
};
