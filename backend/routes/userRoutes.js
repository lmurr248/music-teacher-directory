const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:id", async (req, res) => {
  try {
    const user = await userController.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(`Error fetching user by ID: ${err.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
