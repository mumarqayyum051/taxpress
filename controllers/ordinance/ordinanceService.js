const { BadRequestResponse, OkResponse } = require('express-http-response');
const db = require('../../db');
const path = require('path');
var base64ToFile = require('base64-to-file');

const addOrdinance = (req, res, next) => {
  let { highlights, type, file } = req.body || req.body.ordinance;
  //1: Act, 2: Ordinance, 3: Rule
  if (!highlights || !type || !file) {
    return next(new BadRequestResponse('Please fill all the fields', 400));
  }

  try {
    if (type) {
      type = type.replace(/'/g, "\\'");
    }
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }

  highlights = JSON.stringify(highlights);
  const _path = path.join(process.cwd(), 'public', 'uploads/');
  base64ToFile.convert(
    file,
    _path,
    ['jpg', 'jpeg', 'png', 'pdf'],
    (_filePath) => {
      var pathname = new URL(_filePath).pathname;
      var filePath = pathname.split('\\').splice(-2).join('/');

      let query = `Insert into ordinance ( highlights, type, file ) values('${highlights}', '${type}',  '${filePath}')`;

      let responses = [
        '',
        'Ordinance has been added',
        'Act has been added',
        'Rule has been added',
      ];
      db.then((conn) => {
        conn.query(query, (err, result) => {
          if (err) {
            return next(new BadRequestResponse(err.message, 400));
          }
          return res.send(new OkResponse(responses[type], 200));
        });
      });
    }
  );
};
const deleteOrdinance = (req, res, next) => {
  const id = req.params.id;
  const query = `DELETE FROM ordinance WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return next(new OkResponse('Ordinance has been deleted', 200));
    });
  });
};

const getOrdinances = (req, res, next) => {
  const query = `SELECT * FROM ordinance`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      if (result.length) {
        for (const ordinance of result) {
          let parsed = JSON.parse(ordinance.highlights);
          ordinance.highlights = parsed;
        }
      }
      return next(new OkResponse(result, 200));
    });
  });
};

module.exports = { getOrdinances, deleteOrdinance, addOrdinance };
