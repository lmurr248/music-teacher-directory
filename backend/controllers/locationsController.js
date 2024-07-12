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

// get location based on listing id
exports.getLocationByListingId = async (req, res) => {
  const { listingId } = req.params;
  try {
    const location = await pool.query(
      "SELECT l.name FROM locations l JOIN listing_locations ll ON l.id = ll.location_id WHERE ll.listing_id = $1",
      [listingId]
    );
    if (location.rows.length > 0) {
      res.json(location.rows);
    } else {
      res.status(404).json({ error: "No location found for this listing" });
    }
  } catch (err) {
    console.error(`Error fetching location for listing: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};
