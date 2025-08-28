const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You Must Be Logged in to Create Listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (!req.session.RedirectUrl()) {
    res.locals.RedirectUrl = req.session.RedirectUrl;
  }
};

module.exports.isowner = async(req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`); // ✅ Added return
  }

  next();

};

module.exports.validateListing = async(req, res, next) => {
  let { error } = listingSchema.validate(req.body); // Destructure error from result

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body); // Destructure error from result

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const Review = require("./models/review"); // ✅ Require here to avoid circular dependency
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect("/listings");
  }

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

