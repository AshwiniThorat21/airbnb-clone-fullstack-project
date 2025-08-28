const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Route to book a listing
router.post("/listings/:id/book", isLoggedIn, bookingController.bookListing);

// Route to show user's bookings
router.get("/bookings", isLoggedIn, bookingController.showBookings);

module.exports = router;
