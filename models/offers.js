var mongoose = require("mongoose");

var offerSchema = new mongoose.Schema({
   offername: String,
   offerurl: String,
   offername2: String,
   offerurl2: String,
   toggle: Boolean,
   priority: Number,
   page: Number
});

module.exports = mongoose.model("Offer", offerSchema);