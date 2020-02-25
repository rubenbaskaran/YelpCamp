var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var Comment = require("../models/comment");

// Show "add comment" view
router.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res)
{
    campground.findById(req.params.id, function (error, campground)
    {
        if (error)
        {
            console.log(error);
        } else
        {
            res.render("comments/new", { campground: campground });
        }
    });
});

// Save new comment to database
router.post("/campgrounds/:id/comments", isLoggedIn, function (req, res)
{
    campground.findById(req.params.id, function (err, campground)
    {
        if (err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        } else
        {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function (err, comment)
            {
                if (err)
                {
                    console.log(err);
                }
                else
                {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
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