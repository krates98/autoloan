var mongoose = require("mongoose");

var attSchema = new mongoose.Schema({
   username: String,
   reason: String,
   overtime: String,
   date: String
});

module.exports = mongoose.model("Att", attSchema);