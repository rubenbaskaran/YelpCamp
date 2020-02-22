var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

var campgrounds = [
    { name: "Salmon Creek", image: "https://www.photosforclass.com/download/pixabay-2756467?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e7d0454e54ab14f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=silviarita" },
    { name: "Granite Hill", image: "https://www.photosforclass.com/download/pixabay-2023404?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e0d7404e52a814f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=Daria-Yakovleva" },
    { name: "Mountain Goats", image: "https://www.photosforclass.com/download/pixabay-2834549?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e8d6474f56a514f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=Sponchia" },
    { name: "Salmon Creek", image: "https://www.photosforclass.com/download/pixabay-2756467?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e7d0454e54ab14f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=silviarita" },
    { name: "Granite Hill", image: "https://www.photosforclass.com/download/pixabay-2023404?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e0d7404e52a814f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=Daria-Yakovleva" },
    { name: "Mountain Goats", image: "https://www.photosforclass.com/download/pixabay-2834549?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e8d6474f56a514f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=Sponchia" },
    { name: "Salmon Creek", image: "https://www.photosforclass.com/download/pixabay-2756467?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e7d0454e54ab14f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=silviarita" },
    { name: "Granite Hill", image: "https://www.photosforclass.com/download/pixabay-2023404?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e0d7404e52a814f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=Daria-Yakovleva" },
    { name: "Mountain Goats", image: "https://www.photosforclass.com/download/pixabay-2834549?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e8d6474f56a514f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=Sponchia" },
    { name: "Salmon Creek", image: "https://www.photosforclass.com/download/pixabay-2756467?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e7d0454e54ab14f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=silviarita" },
    { name: "Granite Hill", image: "https://www.photosforclass.com/download/pixabay-2023404?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e0d7404e52a814f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=Daria-Yakovleva" },
    { name: "Mountain Goats", image: "https://www.photosforclass.com/download/pixabay-2834549?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F54e8d6474f56a514f6da8c7dda793f7f1636dfe2564c704c7d2d78d59048cc5c_960.jpg&user=Sponchia" }
];

app.get("/", function (req, res)
{
    res.render("landing");
});

app.get("/campgrounds", function (req, res)
{
    res.render("campgrounds", { campgrounds: campgrounds });
});

app.post("/campgrounds", function (req, res)
{
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name: name, image: image };
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
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