const Listing = require("../models/listing");
const Booking = require("../models/Booking");

// Book a listing
module.exports.bookListing = async (req, res) => {
    const listingId = req.params.id;
    const userId = req.user._id;

    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        const booking = new Booking({
            listing: listingId,
            user: userId
        });

        await booking.save();

        req.flash("success", "Booking successful!");
        res.redirect("/bookings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to book listing.");
        res.redirect("/listings");
    }
};

// Show user's bookings
module.exports.showBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate("listing");
        console.log(bookings);
        res.render("listings/booking.ejs", { bookings });
    } catch (err) {
        console.error(err);
        req.flash("error", "Unable to fetch bookings.");
        res.redirect("/listings");
    }
};
