const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingschema = new Schema({
  title: {
    type: String,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/a-bride-and-groom-walking-on-a-hill-IfjHaIoAoqE",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/a-bride-and-groom-walking-on-a-hill-IfjHaIoAoqE"
        : v,
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
    ref: "User",
  },
});

listingschema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;
