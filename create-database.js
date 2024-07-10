// First create a Postges datacase, enter the credentials in the .env file and install the pg module
// Then add the below to your package.json file:
// "scripts": {
//   "create-db": "node create-db.js"
// }
// Then run this file using "npm run create-db" to populate the database with sample data

// create-db.js
const { Client } = require("pg");
require("dotenv").config();

const createDatabaseAndTables = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    await client.connect();

    // Connect to the new database
    const dbClient = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: "gt_directory",
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    await dbClient.connect();

    // Create tables and insert data
    const createTablesQuery = `
        -- Create table user_types
        CREATE TABLE user_types (
            id SERIAL PRIMARY KEY,
            type VARCHAR(50) NOT NULL
        );

        -- Insert sample data into user_types
        INSERT INTO user_types (type) VALUES
        ('admin'),
        ('teacher'),
        ('student');

        -- Create table packages
        CREATE TABLE packages (
            id SERIAL PRIMARY KEY,
            package_name VARCHAR(100) NOT NULL,
            price NUMERIC(10, 2) NOT NULL
        );

        -- Insert sample data into packages
        INSERT INTO packages (package_name, price) VALUES
        ('Basic Package', 29.99),
        ('Standard Package', 49.99),
        ('Premium Package', 79.99);

        -- Create table users
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            user_type INTEGER REFERENCES user_types(id)
        );

        -- Insert sample data into users
        INSERT INTO users (first_name, last_name, email, password, user_type) VALUES
        ('John', 'Doe', 'john.doe@example.com', 'password123', 1),
        ('Jane', 'Smith', 'jane.smith@example.com', 'password456', 2),
        ('Alice', 'Johnson', 'alice.johnson@example.com', 'password789', 3);

        -- Create table listings
        CREATE TABLE listings (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            title VARCHAR(200) NOT NULL,
            description TEXT NOT NULL,
            main_image VARCHAR(255) DEFAULT 'https://example.com/placeholder.jpg',
            banner_image VARCHAR(255) DEFAULT 'https://example.com/placeholder.jpg',
            package_id INTEGER REFERENCES packages(id),
            categories VARCHAR(255),
            instruments VARCHAR(255),
            ages VARCHAR(255)
        );

        -- Insert sample data into listings
        INSERT INTO listings (user_id, title, description, main_image, banner_image, package_id, categories, instruments, ages) VALUES
        (1, 'Piano Lessons', 'Learn piano from the best!', 'https://example.com/placeholder.jpg', 'https://example.com/placeholder.jpg', 1, 'Music, Lessons', 'Piano', 'All Ages'),
        (2, 'Guitar Lessons', 'Master the guitar with our expert teacher.', 'https://example.com/placeholder.jpg', 'https://example.com/placeholder.jpg', 2, 'Music, Lessons', 'Guitar', 'Teens, Adults'),
        (3, 'Art Classes', 'Explore your creativity with our art classes.', 'https://example.com/placeholder.jpg', 'https://example.com/placeholder.jpg', 3, 'Art, Creativity', 'None', 'Kids, Teens');
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
