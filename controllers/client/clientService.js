const { BadRequestResponse, OkResponse } = require("express-http-response");
const db = require("../../db");

const addClient = (req, res, next) => {

  let {clientName, clientDesignation, comment, review, reviewTitle} = req.body;
  try{
    clientName = clientName.replace(/'/g, "\\'");
    clientDesignation = clientDesignation.replace(/'/g, "\\'");
  }
  catch(e){
    return next(new BadRequestResponse(e, 400));
  }

  const filePath = req?.file?.path?.split("\\")?.join("/");

  const query = `INSERT INTO clients  (clientName, clientDesignation, comment, review, reviewTitle) VALUES ('${clientName}','${clientDesignation}', '${comment}', '${review}', '${reviewTitle}', '${filePath}')`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Client has been created", 200));
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err.message, 400));
  })
};
const getClients = (req, res, next) => {

  const query = `SELECT * FROM clients`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse(result, 200));
    });
  }).catch((err )=>{
    return next(new BadRequestResponse(err.message, 400));
  })
};
const deleteClient = (req, res, next) => {
  const { id } = req.params;
  const query = `DELETE FROM clients WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse("Client has been deleted", 200));
    });
  }
};

module.exports = {
  addClient,
  getClients,
  deleteClient,
};
