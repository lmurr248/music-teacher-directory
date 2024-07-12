const express = require("express");
const app = express();
const pool = require("./db");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("./passport");
const path = require("path");
const listingRoutes = require("./routes/listingRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const categoriesRoutes = require("./routes/categoriesRoutes");
const instrumentsRoutes = require("./routes/instrumentsRoutes");
const locationsRoutes = require("./routes/locationsRoutes");
const flash = require("connect-flash");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(flash());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production!
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Use the user routes
app.use("/api/user", userRoutes);
app.use("/api/user", userRoutes);

// Use the auth routes
app.use("/api", authRoutes);

// Mount the listing routes
app.use("/api/listings", listingRoutes);

// Use categories routes
app.use("/api/categories", categoriesRoutes);

// Use instruments routes
app.use("/api/instruments", instrumentsRoutes);

// Use locations routes
app.use("/api/locations", locationsRoutes);

// Start the server on the specified port or default to 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
