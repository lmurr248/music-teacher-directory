const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../db");
const crypto = require("crypto");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, results) => {
    if (err) {
      return done(err);
    }
    done(null, results.rows[0]);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email],
        (err, results) => {
          if (err) {
            return done(err);
          }
          const user = results.rows[0];
          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }
          crypto.pbkdf2(
            password,
            user.salt,
            100000,
            64,
            "sha512",
            (err, derivedKey) => {
              if (err) {
                return done(err);
              }
              if (derivedKey.toString("hex") !== user.password) {
                return done(null, false, { message: "Incorrect password." });
              }
              return done(null, user);
            }
          );
        }
      );
    }
  )
);

module.exports = passport;
