const express = require("express");
const app = express();
const pool = require("./db"); // Corrected import
const cors = require("cors");
const dotenv = require("dotenv");

// Import auth routes
const authRoutes = require("./routes/authRoutes");

// Load environment variables from .env file
dotenv.config({
  path: require("path").resolve(__dirname, "../.env"),
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Get listings
app.get("/api/listings", async (req, res) => {
  try {
    const listings = await pool.query("SELECT * FROM listings");
    res.json(listings.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err.message);
  }
});

// Get a single listing by ID
app.get("/api/listings/:id", async (req, res) => {
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

// Start the server on the specified port or default to 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});

// Use the auth routes
app.use("/api", authRoutes);
