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
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      user_id,
      title,
      description,
      banner_image,
      main_image,
      categories,
      instruments,
      location,
      new_location,
    } = req.body;

    let selectedLocationId = location;

    // If a new location is provided, create it and get its id
    if (new_location) {
      const newLocationResult = await client.query(
        "INSERT INTO locations (name) VALUES ($1) RETURNING id",
        [new_location.name]
      );
      selectedLocationId = newLocationResult.rows[0].id;
    }

    // Insert the new listing
    const newListingResult = await client.query(
      "INSERT INTO listings (user_id, title, description, banner_image, main_image) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [user_id, title, description, banner_image, main_image]
    );

    const newListingId = newListingResult.rows[0].id;

    // Insert categories
    if (categories && categories.length > 0) {
      const categoryValues = categories
        .map((category_id) => `(${newListingId}, ${category_id})`)
        .join(", ");
      await client.query(`
        INSERT INTO listing_categories (listing_id, category_id)
        VALUES ${categoryValues}
      `);
    }

    // Insert instruments
    if (instruments && instruments.length > 0) {
      const instrumentValues = instruments
        .map((instrument_id) => `(${newListingId}, ${instrument_id})`)
        .join(", ");
      await client.query(`
        INSERT INTO listing_instruments (listing_id, instrument_id)
        VALUES ${instrumentValues}
      `);
    }

    // Insert location
    await client.query(
      "INSERT INTO listing_locations (listing_id, location_id) VALUES ($1, $2)",
      [newListingId, selectedLocationId]
    );

    await client.query("COMMIT");

    // Fetch the complete listing data
    const completeListingResult = await client.query(
      `SELECT l.*, 
        array_agg(DISTINCT c.id) as category_ids,
        array_agg(DISTINCT i.id) as instrument_ids,
        array_agg(DISTINCT loc.id) as location_ids
      FROM listings l
      LEFT JOIN listing_categories lc ON l.id = lc.listing_id
      LEFT JOIN categories c ON lc.category_id = c.id
      LEFT JOIN listing_instruments li ON l.id = li.listing_id
      LEFT JOIN instruments i ON li.instrument_id = i.id
      LEFT JOIN listing_locations ll ON l.id = ll.listing_id
      LEFT JOIN locations loc ON ll.location_id = loc.id
      WHERE l.id = $1
      GROUP BY l.id`,
      [newListingId]
    );

    res.status(201).json(completeListingResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Error creating listing: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

// Update a listing by ID
exports.updateListing = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { id } = req.params;

    // Fetch existing listing to check ownership
    const existingListingResult = await client.query(
      "SELECT * FROM listings WHERE id = $1",
      [id]
    );
    const existingListing = existingListingResult.rows[0];

    if (!existingListing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Check if the authenticated user owns the listing
    if (existingListing.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this listing" });
    }

    // Update listing details
    const {
      title,
      description,
      banner_image,
      main_image,
      categories,
      instruments,
      location,
      new_location,
    } = req.body;

    await client.query(
      "UPDATE listings SET title = $1, description = $2, banner_image = $3, main_image = $4 WHERE id = $5",
      [title, description, banner_image, main_image, id]
    );

    // Update categories associated with the listing
    if (categories && categories.length > 0) {
      // Delete existing associations
      await client.query(
        "DELETE FROM listing_categories WHERE listing_id = $1",
        [id]
      );

      // Insert new associations
      const categoryValues = categories
        .map((category_id) => `(${id}, ${category_id})`)
        .join(", ");
      await client.query(`
        INSERT INTO listing_categories (listing_id, category_id)
        VALUES ${categoryValues}
      `);
    }

    // Update instruments associated with the listing
    if (instruments && instruments.length > 0) {
      // Delete existing associations
      await client.query(
        "DELETE FROM listing_instruments WHERE listing_id = $1",
        [newListingId]
      );

      // Insert new associations
      const instrumentValues = instruments
        .map((instrument_id) => `(${newListingId}, ${instrument_id})`)
        .join(", ");
      await client.query(`
    INSERT INTO listing_instruments (listing_id, instrument_id)
    VALUES ${instrumentValues}
  `);
    }

    // Update location associated with the listing
    await client.query("DELETE FROM listing_locations WHERE listing_id = $1", [
      newListingId,
    ]);
    await client.query(
      "INSERT INTO listing_locations (listing_id, location_id) VALUES ($1, $2)",
      [newListingId, selectedLocationId]
    );

    await client.query("COMMIT");

    res.status(200).json({ id, ...req.body });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Error updating listing: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

// Get categories associated with a listing from listing_categories and categories tables
exports.getCategoriesByListingId = async (req, res) => {
  const { listingId } = req.params;
  try {
    const categories = await pool.query(
      "SELECT c.name FROM categories c JOIN listing_categories lc ON c.id = lc.category_id WHERE lc.listing_id = $1",
      [listingId]
    );
    if (categories.rows.length > 0) {
      res.json(categories.rows);
    } else {
      res.status(404).json({ error: "No categories found for this listing" });
    }
  } catch (err) {
    console.error(`Error fetching categories for listing: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

// Get instruments associated with a listing from listing_instruments and instruments tables
exports.getInstrumentsByListingId = async (req, res) => {
  const { listingId } = req.params;
  try {
    const instruments = await pool.query(
      "SELECT i.name FROM instruments i JOIN listing_instruments li ON i.id = li.instrument_id WHERE li.listing_id = $1",
      [listingId]
    );
    if (instruments.rows.length > 0) {
      res.json(instruments.rows);
    } else {
      res.status(404).json({ error: "No instruments found for this listing" });
    }
  } catch (err) {
    console.error(`Error fetching instruments for listing: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};
