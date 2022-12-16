var mongoose = require("mongoose");

var counterSchema = new mongoose.Schema({
   count: Number
});

module.exports = mongoose.model("Counter", counterSchema);