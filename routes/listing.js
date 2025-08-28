const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isowner, validateListing } = require("../middleware.js");



//require controller
const listingController = require("../controllers/listing.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

router.get("/search", wrapAsync(listingController.searchListings));


//Combine Index + Create Route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


//combine show + update(put) + Delete Route
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isowner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isowner, wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isowner, wrapAsync(listingController.renderEditForm));



module.exports = router;

