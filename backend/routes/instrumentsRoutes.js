const express = require("express");
const router = express.Router();
const instrumentsController = require("../controllers/instrumentsController");

router.get("/", instrumentsController.getInstruments);
router.post("/", instrumentsController.createInstrument);

module.exports = router;
