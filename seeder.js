// const mysql = require('mysql');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const connection = require("./db");

async function init() {
  await seeder();
}
init();
async function seeder() {
  Promise.all([
    new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash("Asdf123", salt, function (err, hash) {
          connection
            .then((conn) => {
              const admins = [
                {
                  id: 1,
                  username: "admin",
                  password: hash,
                  email: "admin@gmail.com",
                  user_role: "admin",
                },
                {
                  id: 2,
                  username: "admin2",
                  password: hash,
                  email: "admin2@gmail.com",
                  user_role: "admin",
                },
                {
                  id: 3,
                  username: "admin3",
                  password: hash,
                  email: "admin3@gmail.com",
                  user_role: "admin",
                },
              ];

              const _admins = [
                [1, "admin", "admin@gmail.com", hash, "admin"],
                [2, "admin2", "admin2@gmail.com", hash, "admin"],
                [3, "admin3", "admin@3gmail.com", hash, "admin"],
              ];

              conn.query(`INSERT INTO users SET ?`, _admins, (err, result) => {
                if (err) reject(err);
                resolve(result);
              });
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    }),
  ])
    .then((values) => {
      console.log("Data Seeded");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = seeder;
