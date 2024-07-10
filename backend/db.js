const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the .env file in the project root
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Create a new pool instance
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432, // default port for PostgreSQL
});

// Handle pool errors
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
