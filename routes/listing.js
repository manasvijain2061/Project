const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js"); //wrapAsync function require from js file
const { listingSchema, reviewSchema } = require("../schema.js"); //require schema.js JOI file for server side schema validation
const ExpressError = require("../utils/ExpressError.js"); //require expressError class from JS file
const Listing = require("../models/listing.js"); //require model from listing.js file
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); //require middleware.js file

const listingController = require("../controllers/listings.js");

const multer = require("multer");

const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// shifted to middleware.js file
// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

//using Router.route to combine common routes
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );
// .post(upload.single("listing[image]"), (req, res) => {
//   res.send(req.file);
// });

//New route
router.get(
  "/new",
  isLoggedIn,
  listingController.renderNewForm
  //   (req, res) => {
  //   // console.log(req.user);
  //   // if (!req.isAuthenticated()) {
  //   //   req.flash("error", "you must be logged in to create listing!");
  //   //   return res.redirect("/login");
  //   // }
  //   res.render("./listings/new.ejs");
  // }
);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//all listings route
/*
//main route listings
router.get(
  "/",
  wrapAsync(listingController.index)
  //   async (req, res) => {
  //   const allListings = await Listing.find({});
  //   //.then((res) => { console.log(res);});
  //   res.render("./listings/index.ejs", { allListings });
  // }
);
*/

/*
//show route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
  //   async (req, res) => {
  //   //first extract id
  //   let { id } = req.params;
  //   const listing = await Listing.findById(id)
  //     .populate({ path: "reviews", populate: { path: "author" } })
  //     .populate("owner");
  //   if (!listing) {
  //     req.flash("error", "Listing you requested for does not exist!");
  //     res.redirect("/listings");
  //   }
  //   console.log(listing);
  //   res.render("./listings/show.ejs", { listing });
  // }
);
*/

//New Route new ko as id samaj raha ha to vo database me nahi milega will write this code above show route
//app.get("/listings/new", (req, res) => {
//  res.render("./listings/new.ejs");
//});

/*
//Create Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
  //   async (req, res, next) => {
  //   // let result = listingSchema.validate(req.body);
  //   // console.log(result);
  //   // if (result.error) {
  //   //   throw new ExpressError(400, result.error);
  //   // }
  //   // if (!req.body.listing) {
  //   //   throw new ExpressError(404, "Sent valid data for listing");
  //   // }
  //   //need to extract data from new.ejs
  //   //let { title, description, image, price, country, location } = req.body;
  //   //2nd way will make as key in ejs file
  //   //let listing = req.body.listing;
  //   const newListing = new Listing(req.body.listing);
  //   // if (!newListing.title) {
  //   //   throw new ExpressError(400, "Title is missing");
  //   // }
  //   // if (!newListing.description) {
  //   //   throw new ExpressError(400, "Description is missing");
  //   // }
  //   // if (!newListing.location) {
  //   //   throw new ExpressError(400, "Location is missing");
  //   // }
  //   //new instance
  //   console.log(newListing);
  //   console.log(req.user);
  //   newListing.owner = req.user._id;
  //   await newListing.save();
  //   req.flash("success", "New Listing Created!");
  //   res.redirect("/listings");
  // }
);
*/

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
  //   async (req, res) => {
  //   let { id } = req.params;
  //   const listing = await Listing.findById(id);
  //   if (!listing) {
  //     req.flash("error", "Listing you requested for does not exist!");
  //     res.redirect("/listings");
  //   }
  //   res.render("./listings/edit.ejs", { listing });
  // }
);

/*
//update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
  //   async (req, res) => {
  //   // if (!req.body.listing) {
  //   //   throw new ExpressError(404, "Sent valid data for listing");
  //   // }
  //   let { id } = req.params;
  //   // let listing = await Listing.findById(id);
  //   // if (!listing.owner.equals(res.locals.currUser._id)) {
  //   //   req.flash("error", "You don't have permission to edit");
  //   //   return res.redirect(`/listings/${id}`);
  //   // }

  //   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  //   //listing is an object
  //   req.flash("success", "Listing Updated!");
  //   res.redirect(`/listings/${id}`);
  // }
);
*/

/*
//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
  //   async (req, res) => {
  //   let { id } = req.params;
  //   let deleteListing = await Listing.findByIdAndDelete(id);
  //   console.log(deleteListing);
  //   req.flash("success", "Listing Deleted!");
  //   res.redirect("/listings");
  // }
);
*/

module.exports = router;
