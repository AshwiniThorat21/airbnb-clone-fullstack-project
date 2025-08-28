const User = require("../models/user.js");
const Listing = require("../models/listing.js");

module.exports.addToWishlist = async (req, res) => {
  const listingId = req.params.id;
  const userId = req.user._id;

  const user = await User.findById(userId);

  // Check if listing already in wishlist
  if (!user.wishlist.includes(listingId)) {
    user.wishlist.push(listingId);
    await user.save();
    req.flash("success", "Added to your wishlist!");
  } else {
    req.flash("error", "Already in your wishlist.");
  }

  res.redirect(`/listings/${listingId}`);
};

module.exports.removeFromWishlist = async (req, res) => {
  const listingId = req.params.id;
  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, {
    $pull: { wishlist: listingId },
  });

  req.flash("success", "Removed from wishlist.");
  res.redirect("/wishlist");
};

module.exports.showWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.render("listings/wishlist.ejs", { listings: user.wishlist });
};
