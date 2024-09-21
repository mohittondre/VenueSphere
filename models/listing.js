const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingschema = new Schema ({
    title: {
        type: String,
    },
    description: String,
    image :{
        type: String,
        default:
            "https://unsplash.com/photos/a-bride-and-groom-walking-on-a-hill-IfjHaIoAoqE",
        set: (v) => v === ""? "https://unsplash.com/photos/a-bride-and-groom-walking-on-a-hill-IfjHaIoAoqE" :v,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
    {
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
],
});

const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;