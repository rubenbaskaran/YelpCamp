var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware/middleware")

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
router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res)
{
    res.render("campgrounds/new");
});

// Save new campground to database
router.post("/campgrounds", middleware.isLoggedIn, function (req, res)
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
            req.flash("error", "Couldn't submit campground");
            console.log(error);
        }
        else
        {
            req.flash("success", "Campground submitted successfully");
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
            req.flash("error", "Couldn't open campground");   
        }
        else
        {            
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// Show "edit campground" view
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function (req, res)
{
    campground.findById(req.params.id, function (error, foundCampground)
    {
        if (error)
        {   
            req.flash("error", "Couldn't open campground edit view");         
            res.redirect("back");
        }
        else
        {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });
});

// Save campground changes to database
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res)
{
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function (error, updatedCampground)
    {
        if (error)
        {
            req.flash("error", "Couldn't submit campground changes");
            res.redirect("/campgrounds");
        }
        else
        {
            req.flash("success", "Campground changes submitted successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function (req, res)
{
    campground.findByIdAndRemove(req.params.id, function (error)
    {
        if (error)
        {
            req.flash("error", "Couldn't delete campground");            
            res.redirect("/campgrounds");
        }
        else
        {
            req.flash("success", "Succesfully deleted campground");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;