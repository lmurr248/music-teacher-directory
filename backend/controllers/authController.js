const bcrypt = require("bcrypt");
const passport = require("passport");
const pool = require("../db");

// Register controller
exports.register = async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [firstName, lastName, email, hashedPassword, userType]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

// Login controller
const jwt = require("jsonwebtoken");

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    req.login(user, async (err) => {
      if (err) return next(err);

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.json({ token });
    });
  })(req, res, next);
};

// Logout controller
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out user:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
};
