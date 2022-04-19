const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../db");

module.exports = function (passport) {
  console.log(passport);
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },

      (email, password, done) => {
        console.log(email, password);
        const query = `SELECT * FROM users WHERE email = '${email}'`;
        db.query(query, async (err, result) => {
          if (err) {
            return done(err);
          }
          if (!result) {
            return done(null, false, {
              message: "No User found against this email address",
            });
          } else if (!result[0].isEmailVerified) {
            return done(null, false, {
              message: "User needs to verify the OTP",
            });
          }
          const hashedPassword = result[0].password;
          console.log(hashedPassword, password);
          let isMatch = await bcrypt.compare(
            password.toString(),
            hashedPassword,
          );
          if (isMatch) {
            return done(null, result[0]);
          } else {
            return done(null, false, { message: "Incorrect Password" });
          }
        });
      },
    ),
  );
};
