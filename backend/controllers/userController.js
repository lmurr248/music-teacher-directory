const pool = require("../db");

const getUserById = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error fetching user by ID: ${error.message}`);
  }
};

module.exports = {
  getUserById,
};
