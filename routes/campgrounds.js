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

// Show "edit campground" view
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function (req, res)
{
    campground.findById(req.params.id, function (error, foundCampground)
    {
        if (error)
        {
            res.redirect("back");
        }
        else
        {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });
});

// Save campground changes to database
router.put("/campgrounds/:id", checkCampgroundOwnership, function (req, res)
{
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function (error, updatedCampground)
    {
        if (error)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete campground
router.delete("/campgrounds/:id", checkCampgroundOwnership, function (req, res)
{
    campground.findByIdAndRemove(req.params.id, function (error)
    {
        if (error)
        {
            console.log("Error deleting campground");
            res.redirect("/campgrounds");
        }
        else
        {
            console.log("Succesfully deleted campground");
            res.redirect("/campgrounds");
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

// Middleware for checking campground ownership
function checkCampgroundOwnership(req, res, next)
{
    if (req.isAuthenticated())
    {
        campground.findById(req.params.id, function (error, foundCampground)
        {
            if (error)
            {
                res.redirect("back");
            }
            else
            {
                if (foundCampground.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    res.redirect("back");
                }
            }
        });
    } else
    {
        res.redirect("back");
    }
}

module.exports = router;