if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../MAJORPROJECT/models/listing.js"); //require model from listing.js file
const path = require("path"); //for ejs views folder
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //ejsMate
const wrapAsync = require("./utils/wrapAsync.js"); //wrapAsync function require from js file
const ExpressError = require("./utils/ExpressError.js"); //require expressError class from JS file
const { listingSchema, reviewSchema } = require("./schema.js"); //require schema.js JOI file for server side schema validation
const Review = require("./models/review.js"); //require model from review.js file
const session = require("express-session"); // require express-session package
const MongoStore = require("connect-mongo"); //require connect mongo package
const flash = require("connect-flash"); // require connect-flash package installed
const passport = require("passport"); //require passport package
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
//require routes file for listings and routes

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

//for ejs setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//sara data jo aha raha ha vo parse ho pai
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); //ejsMate
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

console.log(__dirname);
// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

//function for using reviewSchema
// const validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

// //main route listings
// app.get(
//   "/listings",
//   wrapAsync(async (req, res) => {
//     const allListings = await Listing.find({});
//     //.then((res) => { console.log(res);});
//     res.render("./listings/index.ejs", { allListings });
//   })
// );

// //New route
// app.get("/listings/new", (req, res) => {
//   res.render("./listings/new.ejs");
// });

//form data should be update in database and will show in main route which is main route listing

// //Create Route
// app.post(
//   "/listings",
//   validateListing,
//   wrapAsync(async (req, res, next) => {
//     // let result = listingSchema.validate(req.body);
//     // console.log(result);
//     // if (result.error) {
//     //   throw new ExpressError(400, result.error);
//     // }
//     // if (!req.body.listing) {
//     //   throw new ExpressError(404, "Sent valid data for listing");
//     // }
//     //need to extract data from new.ejs
//     //let { title, description, image, price, country, location } = req.body;
//     //2nd way will make as key in ejs file
//     //let listing = req.body.listing;
//     const newListing = new Listing(req.body.listing);
//     // if (!newListing.title) {
//     //   throw new ExpressError(400, "Title is missing");
//     // }
//     // if (!newListing.description) {
//     //   throw new ExpressError(400, "Description is missing");
//     // }
//     // if (!newListing.location) {
//     //   throw new ExpressError(400, "Location is missing");
//     // }
//     //new instance
//     console.log(newListing);
//     await newListing.save();
//     res.redirect("/listings");
//   })
// );

//show route
// app.get(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     //first extract id
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     res.render("./listings/show.ejs", { listing });
//   })
// );

//New Route new ko as id samaj raha ha to vo database me nahi milega will write this code above show route
//app.get("/listings/new", (req, res) => {
//  res.render("./listings/new.ejs");
//});

// //Edit Route
// app.get(
//   "/listings/:id/edit",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("./listings/edit.ejs", { listing });
//   })
// );

// //update route
// app.put(
//   "/listings/:id",
//   validateListing,
//   wrapAsync(async (req, res) => {
//     // if (!req.body.listing) {
//     //   throw new ExpressError(404, "Sent valid data for listing");
//     // }
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     //listing is an object
//     res.redirect(`/listings/${id}`);
//   })
// );

// //Delete Route
// app.delete(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deleteListing = await Listing.findByIdAndDelete(id);
//     console.log(deleteListing);
//     res.redirect("/listings");
//   })
// );

//using middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log(res.locals.currUser);
  console.log(res.locals.success);
  next();
});

// app.get("/demouser", async (req, res) => {
//   //create fake user
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await User.register(fakeUser, "password");
//   res.send(registeredUser);
// });

app.use("/listings", listingRouter); //for accessing listings route from Routes -> listing.js

app.use("/listings/:id/reviews", reviewRouter); //for accessing REVIEWS route from Routes -> review.js

app.use("/", userRouter); //for accessing user signup route from Routes -> user.js

// //Reviews Route
// //POST route
// app.post(
//   "/listings/:id/reviews",
//   validateReview,
//   wrapAsync(async (req, res) => {
//     //access listing id
//     let listing = await Listing.findById(req.params.id);
//     //Create new Review (review[rating] & review[comment] will pass here)
//     let newReview = new Review(req.body.review);
//     //push in review array which is in listing schems defined in listing.js file
//     listing.reviews.push(newReview);

//     //save in DB
//     await newReview.save();
//     await listing.save();

//     console.log("new review saved");
//     // res.send("new review saved");
//     res.redirect(`/listings/${listing._id}`);
//   })
// );

// //Delete Review Route
// app.delete(
//   "/listings/:id/reviews/:reviewId",
//   wrapAsync(async (req, res) => {
//     //access both listing and review id
//     let { id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId); //in db delete from review collection/table
//     res.redirect(`/listings/${id}`);
//   })
// );

//await async use because of delay in database save and retrive
app.get(
  "/testListing",
  wrapAsync(async (req, res) => {
    //using model to enter the data
    let sampleListing = new Listing({
      title: "My New Villa",
      description: "By the beach",
      price: 1200,
      location: "jaipur",
      country: "India",
    });

    //saving it in database
    await sampleListing.save();

    console.log("Sample was saved");
    res.send("successful testing");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  //res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
