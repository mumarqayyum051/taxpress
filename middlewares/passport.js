const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const db = require('../db');

module.exports = function (passport) {
  console.log(passport);
  passport.use(
    new LocalStrategy(
      { emailField: 'email', passwordField: 'password' },
      (email, password, done) => {
        console.log(email, password);
        const query = `SELECT * FROM users WHERE email = '${email}'`;
        db.then((con) => {
          con.query(query, async (err, result) => {
            console.log(err, result);
            if (err) {
              return done(err);
            }
            if (!result.length) {
              return done(null, false, {
                message: 'No User found against this email',
              });
            } else if (!result[0].isEmailVerified) {
              return done(null, false, {
                message: 'User needs to verify the OTP',
              });
            }
            const hashedPassword = result[0].password;
            console.log(hashedPassword, password);
            let isMatch = await bcrypt.compare(
              password.toString(),
              hashedPassword
            );
            if (isMatch) {
              return done(null, result[0]);
            } else {
              return done(null, false, { message: 'Incorrect Password' });
            }
          });
        });
      }
    )
  );
};
