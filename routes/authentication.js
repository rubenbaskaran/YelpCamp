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
            console.log(err);
            return res.render("authentication/register");
        }
        passport.authenticate("local")(req, res, function ()
        {
            res.redirect("/campgrounds");
        });
    });
});

// Show login view
router.get("/login", function (req, res)
{
    res.render("authentication/login", {message: req.flash("error")});
});

// Call database to validate credentials
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res) { });

// Logout and redirect to main view
router.get("/logout", function (req, res)
{
    req.logout();
    res.redirect("/campgrounds");
});

module.exports = router;