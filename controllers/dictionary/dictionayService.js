const { BadRequestResponse, OkResponse } = require('express-http-response');
const db = require('../../db');
const path = require('path');
var base64ToFile = require('base64-to-file');

const add = (req, res, next) => {
  let { word, meaning, sld, file } = req.body || req.body.dictionary;

  if (!word || !meaning || !sld || !file) {
    return next(new BadRequestResponse('Please fill all the fields'));
  }
  try {
    if (word) {
      word = word.replace(/'/g, "\\'");
    }
    if (meaning) {
      meaning = meaning.replace(/'/g, "\\'");
    }
  } catch (e) {
    return next(new BadRequestResponse(e, 400));
  }

  const _path = path.join(process.cwd(), 'public', 'uploads/');
  base64ToFile.convert(
    file,
    _path,
    ['jpg', 'jpeg', 'png', 'pdf'],
    (_filePath) => {
      var pathname = new URL(_filePath).pathname;
      var filePath = pathname.split('\\').splice(-2).join('/');

      const query = `INSERT INTO dictionary (word, meaning, sld, file) VALUES ('${word}', '${meaning}', '${sld}', '${filePath}')`;

      db.then((conn) => {
        conn.query(query, (err, result) => {
          if (err) {
            return next(new BadRequestResponse(err.message, 400));
          }
          return res.send(
            new OkResponse('Word has been added to dictionary', 200)
          );
        });
      });
    }
  );
};

const search = (req, res, next) => {
  const { word, meaning, sld } = req.body || req.body.dictionary;
  let search = `SELECT * FROM dictionary WHERE `;
  if (word) {
    search += `word LIKE '%${word}%' OR `;
  }
  if (meaning) {
    search += `meaning LIKE '%${meaning}%' OR `;
  }
  if (sld) {
    search += `sld LIKE '%${sld}%'`;
  }
  console.log(search);
  search = search.trim();
  if (search.includes('OR') && search.endsWith('OR')) {
    search = search.split('OR').slice(0, -1).join(' OR ');
  }
  console.log(search.includes('LIKE'));
  if (!search.includes('LIKE')) {
    return res
      .status(422)
      .send(
        new BadRequestResponse('Please pass at least one search parameter')
      );
  }
  console.log('-result---', search);
  db.then((conn) => {
    db.query(search, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return res.send(new OkResponse(result, 200));
    });
  });
};

const getAllWords = (req, res, next) => {
  const query = `Select * from dictionary`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return res.send(new OkResponse(result, 200));
    });
  });
};
module.exports = { add, search, getAllWords };
