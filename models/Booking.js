const mongoose = require("mongoose");


const bookingSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true }); // <-- this adds createdAt and updatedAt

module.exports = mongoose.model("Booking", bookingSchema);
