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
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});

// Show "edit comment" view
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function (req, res)
{
    Comment.findById(req.params.comment_id, function (err, foundComment)
    {
        if (err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    })
});

// Save comment changes to database
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function (req, res)
{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (error, updatedComment)
    {
        if (error)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete comment
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function (req, res)
{
    Comment.findByIdAndRemove(req.params.comment_id, function (error)
    {
        if (error)
        {
            console.log("Error deleting comment");
            res.redirect("back");
        }
        else
        {
            console.log("Succesfully deleted campground");
            res.redirect("/campgrounds/" + req.params.id);
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
function checkCommentOwnership(req, res, next)
{
    if (req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function (error, foundComment)
        {
            if (error)
            {
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