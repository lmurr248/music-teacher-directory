const express = require("express");
const { passport, registerUser } = require("../models/authModel");

const authRouter = express.Router();

// Get a single user by id
authRouter.get("/user/:id", (req, res) => {
  console.log("req.user:", req.user);
  const { id, first_name, last_name, email, user_type } = req.user || {};
  res.json({ id, first_name, last_name, email, user_type });
});

authRouter.post("/login", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
});

authRouter.post("/logout", (req, res) => {
  req.logout();
  res.clearCookie("connect.sid");
  res.json({ message: "Logged out" });
});

authRouter.post("/register", (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;
  const userTypeNumber = Number(userType);
  registerUser(
    firstName,
    lastName,
    email,
    password,
    userTypeNumber,
    (err, user) => {
      if (err) {
        console.error("Error registering user:", err);
        return res
          .status(500)
          .json({ message: "Error registering user", error: err.message });
      }

      // Automatically log in the user after registration
      req.login(user, (err) => {
        if (err) {
          console.error("Error logging in user after registration:", err);
          return res.status(500).json({
            message: "Error logging in user after registration",
            error: err.message,
          });
        }
        return res.status(201).json(user);
      });
    }
  );
});

module.exports = authRouter;
