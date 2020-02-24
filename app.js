var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var campground = require("./models/campground");
var user = require("./models/user");
var comment = require("./models/comment");
var seedDB = require("./seeds");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
seedDB();

app.get("/", function (req, res)
{
    res.render("landing");
});

// INDEX (RESTful route)
app.get("/campgrounds", function (req, res)
{
    campground.find({}, function (error, campgrounds)
    {
        if (error)
        {
            console.log(error);
        } else
        {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

// NEW (RESTful route)
app.get("/campgrounds/new", function (req, res)
{
    // Shows form that calls POST /campgrounds when submitted
    res.render("campgrounds/new");
});

// CREATE (RESTful route)
app.post("/campgrounds", function (req, res)
{
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = { name: name, image: image, description: description };

    campground.create(newCampground, function (error, newlyCreated)
    {
        if (error)
        {
            console.log(error);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
});

// SHOW (RESTful route)
app.get("/campgrounds/:id", function (req, res)
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

// EDIT (RESTful route)
// UPDATE (RESTful route)
// DESTROY (RESTful route)

//================
// COMMENTS ROUTES
//================

app.get("/campgrounds/:id/comments/new", function (req, res)
{
    res.render("comments/new");
});

app.post("/campgrounds/:id/comments", function (req, res)
{
    res.render("comments/new");
});

//================
// COMMENTS ROUTES
//================

app.listen(3000, function ()
{
    console.log("YelpCamp listening on port 3000");
});