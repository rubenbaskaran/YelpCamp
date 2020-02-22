var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});
var campground = mongoose.model("Campground", campgroundSchema);
// SCHEMA SETUP

app.get("/", function (req, res)
{
    res.render("landing");
});

app.get("/campgrounds", function (req, res)
{
    campground.find({}, function (error, campgrounds)
    {
        if (error)
        {
            console.log(error);
        } else
        {
            res.render("campgrounds", { campgrounds: campgrounds });
        }
    });
});

app.post("/campgrounds", function (req, res)
{
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name: name, image: image };

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

app.get("/campgrounds/new", function (req, res)
{
    // Shows form that calls POST /campgrounds when submitted
    res.render("new");
});

app.listen(3000, function ()
{
    console.log("YelpCamp listening on port 3000");
});