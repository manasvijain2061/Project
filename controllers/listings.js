const Listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  //.then((res) => { console.log(res);});
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  // console.log(req.user);
  // if (!req.isAuthenticated()) {
  //   req.flash("error", "you must be logged in to create listing!");
  //   return res.redirect("/login");
  // }
  res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  //first extract id
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 2,
    })
    .send();

  console.log("coordinates", response.body.features[0].geometry);
  // res.send("done!");

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..", filename);
  // let result = listingSchema.validate(req.body);
  // console.log(result);
  // if (result.error) {
  //   throw new ExpressError(400, result.error);
  // }
  // if (!req.body.listing) {
  //   throw new ExpressError(404, "Sent valid data for listing");
  // }
  //need to extract data from new.ejs
  //let { title, description, image, price, country, location } = req.body;
  //2nd way will make as key in ejs file
  //let listing = req.body.listing;
  const newListing = new Listing(req.body.listing);
  // if (!newListing.title) {
  //   throw new ExpressError(400, "Title is missing");
  // }
  // if (!newListing.description) {
  //   throw new ExpressError(400, "Description is missing");
  // }
  // if (!newListing.location) {
  //   throw new ExpressError(400, "Location is missing");
  // }
  //new instance
  console.log(newListing);
  console.log(req.user);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  // if (!req.body.listing) {
  //   throw new ExpressError(404, "Sent valid data for listing");
  // }
  let { id } = req.params;
  // let listing = await Listing.findById(id);
  // if (!listing.owner.equals(res.locals.currUser._id)) {
  //   req.flash("error", "You don't have permission to edit");
  //   return res.redirect(`/listings/${id}`);
  // }

  //added listing variable with phase 3
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  //listing is an object
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
