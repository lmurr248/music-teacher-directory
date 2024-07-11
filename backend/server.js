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
const authController = require("./controllers/authController");
const flash = require("connect-flash");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Load environment variables from .env file
dotenv.config({
  path: require("path").resolve(__dirname, "../.env"),
});

// Use the user routes
app.use("/api", userRoutes);

// Use the auth routes
app.use("/api", authRoutes);
app.post("/register", authController.register);
app.post("/login", authController.login);
app.get("/logout", authController.logout);

// Mount the listing routes
app.use("/api/listings", listingRoutes);

// Start the server on the specified port or default to 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
