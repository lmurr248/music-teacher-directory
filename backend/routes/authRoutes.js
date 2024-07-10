const express = require("express");
const passport = require("passport");
const { registerUser } = require("../models/authModel");

const authRouter = express.Router();

authRouter.post("/login", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
});

authRouter.post("/logout", (req, res) => {
  req.logout();
  res.json({ message: "Logged out" });
});

authRouter.post("/register", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  registerUser(firstName, lastName, email, password, (err, user) => {
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
        return res
          .status(500)
          .json({
            message: "Error logging in user after registration",
            error: err.message,
          });
      }
      return res.status(201).json(user);
    });
  });
});

module.exports = authRouter;
