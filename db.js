// const mysql = require('mysql');
const mysqlssh = require('mysql-ssh2');
const fs = require('fs');
require('dotenv').config();
const connection = mysqlssh.connect(
  {
    host: 'premium96.web-hosting.com',
    port: 21098,
    user: 'kingcobblertest',
    privateKey: fs.readFileSync('./kingcobbler'),
    passphrase: 'Joker@170',
  },
  {
    host: '127.0.0.1',
    port: 3306,
    user: 'kingcobblertest_taxpress',
    password: 'taxpress@170',
    database: 'kingcobblertest_taxpress',
  }
);

module.exports = connection;
