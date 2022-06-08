const { BadRequestResponse, OkResponse } = require('express-http-response');
const db = require('../../db');
const path = require('path');
var base64ToFile = require('base64-to-file');

const addMember = (req, res, next) => {
  let { name, about, linkedIn, facebook, instagram, designation, file } =
    req.body || req.body.team;
  if (!name || !about || !designation || !file) {
    return res
      .status(400)
      .send(new BadRequestResponse('Please fill all the required fields'));
  }

  try {
    about = about.replace(/'/g, "\\'");
  } catch (e) {
    console.log(e);
  }

  const _path = path.join(process.cwd(), 'public', 'uploads/');
  base64ToFile.convert(
    file,
    _path,
    ['jpg', 'jpeg', 'png', 'pdf'],
    (_filePath) => {
      var pathname = new URL(_filePath).pathname;
      var filePath = pathname.split('\\').splice(-2).join('/');

      const query = `INSERT INTO team (name, about, linkedIn, facebook, instagram, designation, file) VALUES ('${name}', '${about}', '${linkedIn}', '${facebook}', '${instagram}', '${designation}', '${filePath}')`;
      db.then((conn) => {
        conn.query(query, (err, result) => {
          if (err) {
            return next(new BadRequestResponse(err.message, 400));
          }
          return res.send(
            new OkResponse('Member has been added to the team', 200)
          );
        });
      });
    }
  );
};

const editMember = (req, res, next) => {
  const id = req.params.id;
  const { name, about, linkedIn, facebook, instagram, designation, file } =
    req.body || req.body.team;

  if (!name || !about || !designation || !file) {
    return res.status(400).send('Please fill all the required fields');
  }
  const _path = path.join(process.cwd(), 'public', 'uploads/');
  if (!file.includes('uploads')) {
    const _path = path.join(process.cwd(), 'public', 'uploads/');
    base64ToFile.convert(
      file,
      _path,
      ['jpg', 'jpeg', 'png', 'pdf'],
      (_filePath) => {
        var pathname = new URL(_filePath).pathname;
        var filePath = pathname.split('\\').splice(-2).join('/');

        const query = `UPDATE team SET name = '${name}', about = '${about}', linkedIn = '${linkedIn}', facebook = '${facebook}', instagram = '${instagram}', designation = '${designation}', file = '${filePath}' WHERE id = ${id}`;
        db.then((conn) => {
          conn.query(query, (err, result) => {
            if (err) {
              return next(new BadRequestResponse(err.message, 400));
            }
            return res.send(
              new OkResponse(
                'Member details have been updated successfully',
                200
              )
            );
          });
        });
      }
    );
  } else {
    const query = `UPDATE team SET name = '${name}', about = '${about}', linkedIn = '${linkedIn}', facebook = '${facebook}', instagram = '${instagram}', designation = '${designation}', file = '${file}' WHERE id = ${id}`;

    db.then((conn) => {
      conn.query(query, (err, result) => {
        if (err) {
          return next(new BadRequestResponse(err, 400));
        } else {
          return res.send(
            new OkResponse('Member details have been updated successfully', 200)
          );
        }
      });
    });
  }
};

const deleteMember = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(400)
      .send(new BadRequestResponse('Please fill all the required fields'));
  }
  const query = `DELETE FROM team WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return res.send(
        new OkResponse('Member has been deleted from the team', 200)
      );
    });
  });
};

const getAllMembers = (req, res, next) => {
  const query = `SELECT * FROM team`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      return res.send(new OkResponse(result, 200));
    });
  });
};

const getMember = (req, res, next) => {
  const id = req.params.id;
  const query = `SELECT * FROM team WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err.message, 400));
      }
      if (result.length) {
        return res.send(new OkResponse(result[0], 200));
      }
      return res.send(new OkResponse(result, 200));
    });
  });
};

module.exports = {
  addMember,
  editMember,
  deleteMember,
  getMember,
  getAllMembers,
};
