var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var campground = require("./models/campground");
var User = require("./models/user");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
passport = require("passport");
LocalStrategy = require("passport-local");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static(__dirname + "/public"));
seedDB();

// Passport config
app.use(require("express-session")({
    secret: "this is a secret message",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Passport config

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

app.post("/campgrounds/:id/comments", function (req, res)
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

//================
// COMMENTS ROUTES
//================

//================
// AUTH ROUTES
//================

app.get("/register", function (req, res)
{
    res.render("authentication/register");
});

app.post("/register", function (req, res)
{
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user)
    {
        if (err)
        {
            console.log(err);
            return res.render("authentication/register");
        }
        passport.authenticate("local")(req, res, function ()
        {
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", function (req, res)
{
    res.render("authentication/login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function (req, res){});

//================
// AUTH ROUTES
//================

app.listen(3000, function ()
{
    console.log("YelpCamp listening on port 3000");
});