var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// Show register view
router.get("/register", function (req, res)
{
    res.render("authentication/register");
});

// Save new user to database
router.post("/register", function (req, res)
{
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user)
    {
        if (err)
        {
            //req.flash("error", "Failed registrering new user"); // Replaced with below code because of bug
            return res.render("authentication/register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function ()
        {
            req.flash("success", "New user registrered successfully");
            res.redirect("/campgrounds");
        });
    });
});

// Show login view
router.get("/login", function (req, res)
{
    res.render("authentication/login");
});

// Call database to validate credentials
router.post("/login", function (req, res, next)
{
    passport.authenticate("local",
        {
            successRedirect: "/campgrounds",
            failureRedirect: "/login",
            failureFlash: true,
            successFlash: "Welcome to YelpCamp, " + req.body.username + "!"
        })(req, res);
});

// Logout and redirect to main view
router.get("/logout", function (req, res)
{
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/campgrounds");
});

module.exports = router;