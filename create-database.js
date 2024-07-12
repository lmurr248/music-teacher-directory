// First create a Postgres database, enter the credentials in the .env file and install the pg module
// Then add the below to your package.json file:
// "scripts": {
//   "create-db": "node create-database.js"
// }
// Then run this file using "npm run create-db" to populate the database with sample data
const { Client } = require("pg");
require("dotenv").config();

const createDatabaseAndTables = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();

    // Check if the database exists
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='gt_directory'`
    );

    if (res.rowCount === 0) {
      // Create the database if it doesn't exist
      await client.query("CREATE DATABASE gt_directory");
      console.log("Database 'gt_directory' created successfully");
    } else {
      console.log(
        "Database 'gt_directory' already exists, please either delete the gt_directory database, or create a new one."
      );
    }

    // Connect to the new database
    const dbClient = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: "gt_directory",
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    });

    await dbClient.connect();

    // Create tables and insert data
    const createTablesQuery = `
        -- Create table user_types
        CREATE TABLE IF NOT EXISTS user_types (
            id SERIAL PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Insert sample data into user_types
        INSERT INTO user_types (type) VALUES
        ('admin'),
        ('teacher'),
        ('student')
        ON CONFLICT DO NOTHING;

        -- Create table users
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            salt VARCHAR(255) NOT NULL,
            user_type INTEGER REFERENCES user_types(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Insert sample data into users
        INSERT INTO users (first_name, last_name, email, password, salt, user_type) VALUES
        ('John', 'Doe', 'john.doe@example.com', 'password123', 'salt123', 1),
        ('Jane', 'Smith', 'jane.smith@example.com', 'password456', 'salt456', 2),
        ('Alice', 'Johnson', 'alice.johnson@example.com', 'password789', 'salt789', 3)
        ON CONFLICT DO NOTHING;

        -- Create table listings
        CREATE TABLE IF NOT EXISTS listings (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            title VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            main_image VARCHAR DEFAULT 'https://example.com/placeholder.jpg',
            banner_image VARCHAR DEFAULT 'https://example.com/placeholder.jpg',
            tagline VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create table categories
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Insert sample data into categories
        INSERT INTO categories (name) VALUES
        ('Rock'),
        ('Jazz'),
        ('Metal'),
        ('Pop'),
        ('Fingerstyle')
        ON CONFLICT DO NOTHING;

        -- Create table instruments
        CREATE TABLE IF NOT EXISTS instruments (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Insert sample data into instruments
        INSERT INTO instruments (name) VALUES
        ('Acoustic Guitar'),
        ('Electric Guitar'),
        ('Bass Guitar'),
        ('Ukulele'),
        ('Classical Guitar')
        ON CONFLICT DO NOTHING;

        -- Create table locations
        CREATE TABLE IF NOT EXISTS locations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Insert sample data into locations
        INSERT INTO locations (name) VALUES
        ('London'),
        ('Birmingham'),
        ('Manchester'),
        ('Glasgow'),
        ('Liverpool'),
        ('Newcastle'),
        ('Bristol'),
        ('Leeds'),
        ('Sheffield'),
        ('Edinburgh'),
        ('Leicester'),
        ('Coventry'),
        ('Nottingham'),
        ('Hull'),
        ('Cardiff'),
        ('Southampton'),
        ('Portsmouth'),
        ('Brighton'),
        ('Reading'),
        ('Plymouth')
        ON CONFLICT DO NOTHING;

        -- Create table listing_categories
        CREATE TABLE IF NOT EXISTS listing_categories (
            id SERIAL PRIMARY KEY,
            listing_id INTEGER REFERENCES listings(id),
            category_id INTEGER REFERENCES categories(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create table listing_instruments
        CREATE TABLE IF NOT EXISTS listing_instruments (
            id SERIAL PRIMARY KEY,
            listing_id INTEGER REFERENCES listings(id),
            instrument_id INTEGER REFERENCES instruments(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Create table listing_locations
        CREATE TABLE IF NOT EXISTS listing_locations (
            id SERIAL PRIMARY KEY,
            listing_id INTEGER REFERENCES listings(id),
            location_id INTEGER REFERENCES locations(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Insert sample data into listings
        INSERT INTO listings (user_id, title, description, main_image, banner_image, tagline) VALUES
        (1, 'Rock School', 'Learn guitar from the best!', 'https://res.cloudinary.com/dgilrej1z/image/upload/v1720593401/GTNM-Favicon_1SVG_dwickc.svg', 'https://res.cloudinary.com/dgilrej1z/image/upload/v1720593424/ahmed-rizkhaan-0KyGJK2GlJI-unsplash_mslwqc.jpg', 'Best Guitar Lessons in Town'),
        (2, 'Mark Clark', 'Master the guitar with our expert teacher.', 'https://res.cloudinary.com/dgilrej1z/image/upload/v1720593336/mahyar-mirghasemi-wmms5pSoWZQ-unsplash_zfgvkr.jpg', 'https://res.cloudinary.com/dgilrej1z/image/upload/v1720593348/gabriel-gurrola-2UuhMZEChdc-unsplash_chag56.jpg', 'Top Guitar Instructor'),
        (3, 'Jess Smith', 'Explore your creativity with our guitar classes.', 'https://res.cloudinary.com/dgilrej1z/image/upload/v1720593391/Girl-Pink-background-1_rcgbcv.jpg', 'https://res.cloudinary.com/dgilrej1z/image/upload/v1720593352/marcus-neto-gioH4gHo0-g-unsplash_ke63rh.jpg', 'Creative Guitar Lessons')
        ON CONFLICT DO NOTHING;
    `;

    await dbClient.query(createTablesQuery);

    console.log("Database and tables created successfully");
    await dbClient.end();
  } catch (err) {
    console.error("Error creating database and tables:", err);
  } finally {
    await client.end();
  }
};

createDatabaseAndTables();
