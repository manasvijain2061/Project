const express = require("express");
router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

//router.route for merging same path routes
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

/*
router.get(
  "/signup",
  userController.renderSignupForm
  //   (req, res) => {
  //   res.render("users/signup.ejs");
  // }
);

router.post(
  "/signup",
  wrapAsync(userController.signUp)
  //   async (req, res) => {
  //   try {
  //     let { username, email, password } = req.body;
  //     const newUser = new User({ email, username });
  //     const registeredUser = await User.register(newUser, password);
  //     console.log(registeredUser);
  //     req.login(registeredUser, (err) => {
  //       if (err) {
  //         return next(err);
  //       }
  //       req.flash("success", "Welcome to wanderlust!");
  //       res.redirect("/listings");
  //     });
  //   } catch (e) {
  //     req.flash("error", e.message);
  //     res.redirect("/signup");
  //   }
  // }
);
*/

/*
router.get(
  "/login",
  userController.renderLoginForm
  //   (req, res) => {
  //   res.render("users/login.ejs");
  // }
);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
  // async (req, res) => {
  //   req.flash("success", "Welcome back to Wanderlust!");
  //   //res.redirect("/listings");
  //   //res.redirect(req.session.redirectUrl);
  //   let redirectUrl = res.locals.redirectUrl || "/listings";
  //   res.redirect(redirectUrl);
  // }
);
*/

router.get(
  "/logout",
  userController.logout
  //   (req, res) => {
  //   req.logout((err) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     req.flash("success", "you are logged out!");
  //     res.redirect("/listings");
  //   });
  // }
);

module.exports = router;
