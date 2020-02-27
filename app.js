var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./models/user");
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authenticationRoutes = require("./routes/authentication");

//================
// PASSPORT CONFIG
//================

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

//================
// PASSPORT CONFIG
//================

// Middleware for passing user details in all routes
app.use(function (req, res, next)
{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Default main page
app.get("/", function (req, res)
{
    res.render("landing");
});

// Add routes from seperate files
app.use(authenticationRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

// Start server
app.listen(3000, function ()
{
    console.log("YelpCamp listening on port 3000");
});