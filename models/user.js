var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("User", userSchema);