const express = require("express");
const router = express.Router();
const locationsController = require("../controllers/locationsController");

router.get("/", locationsController.getLocations);

// Get location by listing ID
router.get("/listing/:listingId", locationsController.getLocationByListingId);

module.exports = router;
