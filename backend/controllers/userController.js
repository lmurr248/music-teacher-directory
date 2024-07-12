const pool = require("../db");

exports.getUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (err) {
    console.error(`Error fetching user by ID: ${err.message}`);
    throw err;
  }
};
