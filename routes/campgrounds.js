var express = require("express");
var router = express.Router();
var campground = require("../models/campground");

// Show "all campgrounds" view
router.get("/campgrounds", function (req, res)
{
    campground.find({}, function (error, campgrounds)
    {
        if (error)
        {
            console.log(error);
        } else
        {
            // Passing current user details
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

// Show "add campground" view
router.get("/campgrounds/new", isLoggedIn, function (req, res)
{    
    res.render("campgrounds/new");
});

// Save new campground to database
router.post("/campgrounds", isLoggedIn, function (req, res)
{
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: description, author: author };

    campground.create(newCampground, function (error, newlyCreated)
    {
        if (error)
        {
            console.log(error);
        }
        else
        {
            console.log("======" + newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

// Show "specific campground" view
router.get("/campgrounds/:id", function (req, res)
{
    campground.findById(req.params.id).populate("comments").exec(function (error, foundCampground)
    {
        if (error)
        {
            console.log(error);
        }
        else
        {
            console.log("Found campground");
            console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// Middleware for checking authorization
function isLoggedIn(req, res, next)
{
    if (req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;