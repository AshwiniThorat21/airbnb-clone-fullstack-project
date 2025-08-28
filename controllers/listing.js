const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing You Requested For does Not Exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
});



module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const { title, description, price, location, country } = req.body.listing;

  // ✅ Get coordinates using OpenStreetMap Nominatim API
  const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
    params: {
      q: `${location}, ${country}`,
      format: 'json'
    }
  });

  const latitude = geoResponse.data[0]?.lat || 0;
  const longitude = geoResponse.data[0]?.lon || 0;

  const newListing = new Listing({
    title,
    description,
    price,
    location,
    country,
    latitude,
    longitude,
    owner: req.user._id,
    image: { url, filename }
  });

  await newListing.save();
  req.flash("success", "Listings added successfully!");
  res.redirect(`/listings/${newListing._id}`);
};


module.exports.renderEditForm = (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {  // ← Check if it DOES NOT exist
        req.flash("error", "Listing You Requested For does Not Exist");
        return res.redirect("/listings");  // ← Use return to stop further execution
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300,h_300,c_fill,e_blur:200");

    req.flash("success", "Listing Edit Successfully!!");
    res.render("listings/edit.ejs", { listing,  originalImageUrl });
});

module.exports.updateListing = (async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });


    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();

    }

    req.flash("success", "Listing Update Successfully!!");
    res.redirect(`/listings/${id}`);

});

// ... your previous functions like index, showListing, createListing

module.exports.searchListings = async (req, res) => {
    const { q, minPrice, maxPrice, sort } = req.query;

    let filter = {};

    // Search by title or location
    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let listings = await Listing.find(filter);

    // Sorting
    if (sort === "priceAsc") listings = listings.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") listings = listings.sort((a, b) => b.price - a.price);

    res.render("listings/search.ejs", { listings, query: req.query });
};


module.exports.destroyListing = (async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    //console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!!");
    res.redirect("/listings");
});

