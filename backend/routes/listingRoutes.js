// listingRoutes.js

const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all listings
router.get("/", async (req, res) => {
  try {
    const listings = await pool.query("SELECT * FROM listings");
    res.json(listings.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err.message);
  }
});

// Get a single listing by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM listings WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Listing not found" });
    }
  } catch (err) {
    console.error(`Error fetching listing by ID: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
});

// Get listings associated with a user
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const listings = await pool.query(
      "SELECT * FROM listings WHERE user_id = $1",
      [id]
    );
    if (listings.rows.length > 0) {
      res.json(listings.rows);
    } else {
      res
        .status(404)
        .json({ error: `No listings found for user with id ${id}` });
    }
  } catch (err) {
    console.error(`Error fetching listings by user ID: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
