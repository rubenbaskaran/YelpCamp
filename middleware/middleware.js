var campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

// Middleware for checking authentication
middlewareObj.isLoggedIn = function (req, res, next)
{
    if (req.isAuthenticated())
    {
        return next();
    }
    req.flash("error", "Please login");
    res.redirect("/login");
};

// Middleware for checking campground ownership
middlewareObj.checkCampgroundOwnership = function (req, res, next)
{
    if (req.isAuthenticated())
    {
        campground.findById(req.params.id, function (error, foundCampground)
        {
            if (error)
            {
                req.flash("error", "Campground not found");
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
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else
    {
        req.flash("error", "Please login");
        res.redirect("back");
    }
};

// Middleware for checking campground ownership
middlewareObj.checkCommentOwnership = function (req, res, next)
{
    if (req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function (error, foundComment)
        {
            if (error)
            {
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else
            {
                if (foundComment.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else
    {
        req.flash("error", "Please login");
        res.redirect("back");
    }
};

module.exports = middlewareObj;