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

const registerUser = (
  firstName,
  lastName,
  email,
  password,
  userType,
  callback
) => {
  // Generate a salt
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return callback(err);
    }
    const salt = buffer.toString("hex");

    // Hash the password
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) {
        return callback(err);
      }
      const hashedPassword = derivedKey.toString("hex");

      const userTypeNumber = Number(userType);

      // Insert the new user into the database
      pool.query(
        "INSERT INTO users (first_name, last_name, email, password, user_type, salt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [firstName, lastName, email, hashedPassword, userTypeNumber, salt],
        (err, result) => {
          if (err) {
            return callback(err);
          }
          callback(null, result.rows[0]);
        }
      );
    });
  });
};

module.exports = { passport, registerUser };
