// const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const connection = require('./db');

async function init() {
  await seeder();
}
init();
async function seeder() {
  Promise.all([
    new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash('Asdf123', salt, function (err, hash) {
          connection.then((conn) => {
            conn.query(
              `INSERT INTO users (id,username, password, email, user_role) VALUES (1,'admin', '${hash}', 'admin@gmail.com', 'admin')`,
              (err, result) => {
                if (err) reject(err);
                resolve(result);
              }
            );
          });
        });
      });
    }),
  ])
    .then((values) => {
      console.log('Data Seeded');
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = seeder;
