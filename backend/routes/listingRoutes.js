const express = require("express");
const router = express.Router();
const listingsController = require("../controllers/listingsController");

router.get("/", listingsController.getListings);
router.get("/:id", listingsController.getListingById);
router.get("/user/:id", listingsController.getListingsByUserId);
router.post("/", listingsController.createListing);

module.exports = router;
