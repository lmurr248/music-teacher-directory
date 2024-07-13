const express = require("express");
const app = express();
const morgan = require("morgan");
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

// Middleware setup
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(flash());
app.use(morgan("dev")); // Morgan for HTTP request logging

// CORS setup
const whitelist = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://music-teacher-directory-frontend.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log(`Origin: ${origin}`); // Log the origin for debugging
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // This allows cookies to be sent
};

app.use(cors(corsOptions));

// Error handling for CORS
app.use(function (err, req, res, next) {
  if (err.message === "Not allowed by CORS") {
    console.error(`CORS blocked request from ${req.headers.origin}`);
    res.status(403).json({ error: "CORS request not allowed" });
  } else {
    next(err);
  }
});

// Error handling for CORS
app.use(function (err, req, res, next) {
  if (err.message === "Not allowed by CORS") {
    console.error(`CORS blocked request from ${req.headers.origin}`);
    res.status(403).json({ error: "CORS request not allowed" });
  } else {
    next(err);
  }
});

// Session middleware setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes setup
app.use("/api/user", userRoutes); // User routes
app.use("/api", authRoutes); // Authentication routes
app.use("/api/listings", listingRoutes); // Listing routes
app.use("/api/categories", categoriesRoutes); // Categories routes
app.use("/api/instruments", instrumentsRoutes); // Instruments routes
app.use("/api/locations", locationsRoutes); // Locations routes

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
