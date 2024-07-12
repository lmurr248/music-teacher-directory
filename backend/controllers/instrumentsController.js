const pool = require("../db");

// Get all instruments
exports.getInstruments = async (req, res) => {
  try {
    const instruments = await pool.query("SELECT * FROM instruments");
    res.json(instruments.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err.message);
  }
};

// Create an instrument
exports.createInstrument = async (req, res) => {
  try {
    const { name } = req.body;
    const newInstrument = await pool.query(
      "INSERT INTO instruments (name) VALUES($1) RETURNING *",
      [name]
    );
    res.json(newInstrument.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err.message);
  }
};
