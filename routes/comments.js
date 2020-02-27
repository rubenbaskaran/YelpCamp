var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/middleware")

// Show "add comment" view
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function (req, res)
{
    campground.findById(req.params.id, function (error, campground)
    {
        if (error)
        {
            req.flash("error", "Couldn't open comment submission view");   
        } else
        {
            res.render("comments/new", { campground: campground });
        }
    });
});

// Save new comment to database
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (req, res)
{
    campground.findById(req.params.id, function (err, campground)
    {
        if (err)
        {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else
        {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function (err, comment)
            {
                if (err)
                {
                    req.flash("error", "Couldn't submit comment");
                }
                else
                {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();    
                    req.flash("success", "Comment submitted successfully");                
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});

// Show "edit comment" view
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function (req, res)
{
    Comment.findById(req.params.comment_id, function (err, foundComment)
    {
        if (err)
        {
            req.flash("error", "Couldn't open comment edit view");         
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
        }
    })
});

// Save comment changes to database
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res)
{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (error, updatedComment)
    {
        if (error)
        {
            req.flash("error", "Couldn't submit comment changes");
            res.redirect("back");
        }
        else
        {
            req.flash("success", "Comment changes submitted successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Delete comment
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res)
{
    Comment.findByIdAndRemove(req.params.comment_id, function (error)
    {
        if (error)
        {
            req.flash("error", "Error deleting comment");            
            res.redirect("back");
        }
        else
        {            
            req.flash("success", "Succesfully deleted comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;