const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// Add listing to wishlist
router.post("/wishlist/:id", isLoggedIn, wishlistController.addToWishlist);

// Remove from wishlist
router.delete("/wishlist/:id", isLoggedIn, wishlistController.removeFromWishlist);

// Show wishlist
router.get("/wishlist", isLoggedIn, wishlistController.showWishlist);

module.exports = router;
