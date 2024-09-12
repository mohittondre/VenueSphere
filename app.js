const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema} = require("./schema.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/VenueSphere";

// Connect to the MongoDB database
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

// Root route
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

const validateListing =(req, res, next) => {
    let (error)= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        next();  
    }
};

//index route
app.get("/listings", wrapAsync (async (req, res) =>{
    const allListings = await Listing.find ({});
    res.render("listings/index.ejs",{ allListings });
}));


//new route
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});
  


//show route
app.get("/listings/:id", wrapAsync (async (req, res) => {
   let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render("listings/show.ejs", { listing });
}));



//create route
app.post("/listings",
     wrapAsync (async(req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.save();
    res.redirect("/listings");
}));



//Edit route 
app.get("/listings/:id/edit", wrapAsync (async (req, res) =>{
    let {id} = req.params;
    const listing =  await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));



//update route
app.put("/listings/:id",validateListing,wrapAsync (async (req, res ) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));



//delete route
app.delete("/listings/:id", wrapAsync (async (req, res) =>{
    let {id} =req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));



// app.get("/testListing", async (req, res) =>{
//     let sampleListing = new Listing({
//         title: "The HillSide ",
//         description: " by the forest vally",
//         price: 2000,
//         location: "california",
//         counrty : india
//         });
//      await sampleListing.save();
//      console.log("sample was saved");
//      res.send("successful testing");

// });

// Start the server


app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "something went wrong"} = err ;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
}); 