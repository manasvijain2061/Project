const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

//schema defined
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
    // type: String,
    // default:
    //   "https://unsplash.com/photos/litter-of-dogs-fall-in-line-beside-wall-U6nlG0Y5sfs",
    // set: (v) =>
    //   v === ""
    //     ? "https://unsplash.com/photos/litter-of-dogs-fall-in-line-beside-wall-U6nlG0Y5sfs"
    //     : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  geometry: {
    type: {
      type: String, //Don't do '{ location: { type: String } }'
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

//will export it in app.js
//listing is collection/table
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
