const Joi = require("joi");

// Listing Schema
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null), // Optional field
    country: Joi.string().required()     // ✅ Add this line
  }).required(),
});


// Review Schema
const reviewSchema = Joi.object({
 review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(), // Fixed: added parentheses
});

// Export both schemas
module.exports = {
  listingSchema,
  reviewSchema,
};