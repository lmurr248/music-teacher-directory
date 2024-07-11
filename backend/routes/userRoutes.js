const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/userController");

router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(`Error getting user by id: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
