const pool = require("../db");

// Get all locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await pool.query("SELECT * FROM locations");
    res.json(locations.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err.message);
  }
};
