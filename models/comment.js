var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Comment", commentSchema);