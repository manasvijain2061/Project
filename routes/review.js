const express = require("express");
router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js"); //wrapAsync function require from js file
const ExpressError = require("../utils/ExpressError.js"); //require expressError class from JS file
const { listingSchema, reviewSchema } = require("../schema.js"); //require schema.js JOI file for server side schema validation
const Review = require("../models/review.js"); //require model from review.js file
const Listing = require("../models/listing.js"); //require model from listing.js file
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js"); //require middleware from middleware.js file

const reviewController = require("../controllers/reviews.js");

//shifted to middleware.js file
// const validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

//Router.route for same path
// no need here

//all review routes from app.js

// reviews route
// POST route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
  //   async (req, res) => {
  //   console.log(req.params.id);
  //   //access listing id
  //   let listing = await Listing.findById(req.params.id);
  //   //Create new Review (review[rating] & review[comment] will pass here)
  //   let newReview = new Review(req.body.review);
  //   //adding author code extracting logged in user
  //   newReview.author = req.user._id;
  //   console.log(newReview);
  //   //push in review array which is in listing schems defined in listing.js file
  //   listing.reviews.push(newReview);

  //   //save inDB
  //   await newReview.save();
  //   await listing.save();

  //   console.log("new review saved");
  //   // res.send("new review saved");
  //   req.flash("success", "New Review Created!");
  //   res.redirect(`/listings/${listing._id}`);
  // }
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
  //   async (req, res) => {
  //   //access both listing and review id
  //   let { id, reviewId } = req.params;
  //   await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  //   await Review.findByIdAndDelete(reviewId); //in db delete from review collection/table
  //   req.flash("success", "Review Deleted!");
  //   res.redirect(`/listings/${id}`);
  // }
);

module.exports = router;
