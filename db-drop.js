// First create a Postgres database, enter the credentials in the .env file and install the pg module
// Then add the below to your package.json file:
// "scripts": {
//   "create-db": "node create-database.js"
// }
// Then run this file using "npm run create-db" to populate the database with sample data

const { Client } = require("pg");
require("dotenv").config();

const createDatabaseAndTables = async () => {
  const connectionString = process.env.DB_CONNECTION_STRING;

  // Create a new client instance
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log("Connected to the database");

    // Drop the 'salt' column from the 'users' table
    const dropColumnQuery = `
      ALTER TABLE users DROP COLUMN IF EXISTS salt;
    `;

    await client.query(dropColumnQuery);
    console.log("Dropped 'salt' column from 'users' table successfully");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
};

createDatabaseAndTables();
