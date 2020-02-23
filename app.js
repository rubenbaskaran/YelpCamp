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
    image: String,
    description: String
});
var campground = mongoose.model("Campground", campgroundSchema);

// campground.create(
//     {
//         name: "Hollywood camp",
//         image: "https://www.photosforclass.com/download/pixabay-2023404?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e0d7404e52a814f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=Daria-Yakovleva",
//         description: "This is the hollywood camp in Los Angeles, CA"
//     }, function (error, newlyCreated)
//     {
//         if (error)
//         {
//             console.log(error);
//         }
//         else
//         {
//             console.log("New campground created!");
//             console.log(newlyCreated);
//         }
//     });
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

app.get("/campgrounds/new", function (req, res)
{
    // Shows form that calls POST /campgrounds when submitted
    res.render("new");
});

app.get("/campgrounds/:id", function (req, res)
{
    campground.findById(req.params.id, function (error, foundCampground)
    {
        if (error)
        {
            console.log(error);
        }
        else
        {
            console.log("Found campground");
            console.log(foundCampground);
            res.render("show", { campground: foundCampground });
        }
    });    
});

app.listen(3000, function ()
{
    console.log("YelpCamp listening on port 3000");
});