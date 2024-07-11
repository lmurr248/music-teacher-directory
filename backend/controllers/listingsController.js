const pool = require("../db");

// Get all listings
exports.getListings = async (req, res) => {
  try {
    const listings = await pool.query("SELECT * FROM listings");
    res.json(listings.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err.message);
  }
};

// Get a single listing by ID
exports.getListingById = async (req, res) => {
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
};

// Get listings associated with a user
exports.getListingsByUserId = async (req, res) => {
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
};

// Create a listing with fields for title, description, banner_image, main_image, categories, and instruments
exports.createListing = async (req, res) => {
  const {
    user_id,
    title,
    description,
    banner_image,
    main_image,
    categories,
    instruments,
  } = req.body;
  try {
    const newListing = await pool.query(
      "INSERT INTO listings (user_id, title, description, banner_image, main_image, categories, instruments) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        user_id,
        title,
        description,
        banner_image,
        main_image,
        categories,
        instruments,
      ]
    );
    res.status(201).json(newListing.rows[0]);
  } catch (err) {
    console.error(`Error creating listing: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};
