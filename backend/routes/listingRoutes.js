const express = require("express");
const router = express.Router();
const listingsController = require("../controllers/listingsController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all listings
router.get("/", listingsController.getListings);

// GET listing by ID
router.get("/:id", listingsController.getListingById);

// GET listings by user ID
router.get("/user/:id", listingsController.getListingsByUserId);

// POST create a new listing
router.post(
  "/",
  authenticateToken,
  upload.fields([
    { name: "banner_image", maxCount: 1 },
    { name: "main_image", maxCount: 1 },
  ]),
  listingsController.createListing
);

// PUT update a listing by ID
router.put(
  "/:id",
  authenticateToken,
  upload.none(),
  listingsController.updateListing
);

// GET categories by listing ID
router.get(
  "/categories/:listingId",
  listingsController.getCategoriesByListingId
);

// GET instruments by listing ID
router.get(
  "/instruments/:listingId",
  listingsController.getInstrumentsByListingId
);

module.exports = router;
