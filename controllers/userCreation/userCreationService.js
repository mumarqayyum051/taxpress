let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
const db = require("../../db");
const bcrypt = require("bcrypt");

const createUser = async (req, res, next) => {
  const { username, role, email, password } = req.body;
  const allowedRoles = [
    "admin",
    "front_desk_admin",
    "library_admin",
    "website_admin",
    "appointment_admin",
    "call_appointment_admin",
    "physical_appointment_admin",
  ];
  if (!allowedRoles.includes(role)) {
    return next(new BadRequestResponse("Invalid role"));
  }
  if (!email || !password || !role || !username) {
    return next(new BadRequestResponse("Please fill all the fields"));
  }
  const hashedPassword = await hashPassword(password);
  db.then((conn) => {
    conn.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      async (err, result) => {
        if (err) {
          return next(new BadRequestResponse("Something went wrong"));
        }

        if (result.length) {
          return next(new BadRequestResponse("User already exists"));
        }

        const query = `INSERT INTO users (username,user_role,email, password) VALUES (  '${username}','${role}', '${email}', '${hashedPassword}')`;

        conn.query(query, (err, result) => {
          if (err) {
            return res.status(400).send(new BadRequestResponse(err));
          } else {
            return next(new OkResponse("Admin created successfully", 200));
          }
        });
      },
    );
  }).catch((err) => {
    return next(new BadRequestResponse(err));
  });
};

const getUsers = (req, res, next) => {
  const query = `SELECT * FROM users where user_role = 'admin' OR user_role = 'front_desk_admin' OR user_role = 'library_admin' OR user_role = 'website_admin' OR user_role = 'appointment_admin' OR user_role = 'call_appointment_admin' OR user_role = 'physical_appointment_admin'`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      } else {
        return next(new OkResponse(result, 200));
      }
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err));
  });
};

const deleteAdmin = (req, res, next) => {
  const id = req.params.id;
  const query = `DELETE FROM users WHERE id = ${id}`;
  db.then((conn) => {
    conn.query(query, (err, result) => {
      if (err) {
        return next(new BadRequestResponse(err));
      } else {
        return next(new OkResponse("Admin deleted successfully", 200));
      }
    });
  }).catch((err) => {
    return next(new BadRequestResponse(err));
  });
};
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.toString(), salt);

    return hashedPassword;
  } catch (err) {
    return err;
  }
};

module.exports = {
  createUser,
  getUsers,
  deleteAdmin,
};
