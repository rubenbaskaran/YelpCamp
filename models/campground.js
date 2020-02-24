var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Comment" 
        } 
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);

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