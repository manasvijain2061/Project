const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); //require model from review.js files

module.exports.createReview = async (req, res) => {
  console.log(req.params.id);
  //access listing id
  let listing = await Listing.findById(req.params.id);
  //Create new Review (review[rating] & review[comment] will pass here)
  let newReview = new Review(req.body.review);
  //adding author code extracting logged in user
  newReview.author = req.user._id;
  console.log(newReview);
  //push in review array which is in listing schems defined in listing.js file
  listing.reviews.push(newReview);

  //save inDB
  await newReview.save();
  await listing.save();

  console.log("new review saved");
  // res.send("new review saved");
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  //access both listing and review id
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId); //in db delete from review collection/table
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};
