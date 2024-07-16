const { Pool } = require("pg");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the .env file in the project root
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

const connectionString = process.env.DB_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("DB_CONNECTION_STRING environment variable is not set.");
}

// Create a new pool instance
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Handle pool errors
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
