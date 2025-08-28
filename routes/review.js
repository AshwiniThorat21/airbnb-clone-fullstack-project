const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); 
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");

const ReviewController = require("../controllers/review.js");


// Add Review
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.createReview));

// Delete Review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.detroyReview));

module.exports = router;
