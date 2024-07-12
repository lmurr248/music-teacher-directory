const express = require("express");
const app = express();
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
app.use(flash());

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
