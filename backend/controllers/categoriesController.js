const pool = require("../db");

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await pool.query("SELECT * FROM categories");
    res.json(categories.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err.message);
  }
};
