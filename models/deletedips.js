var mongoose = require("mongoose");

var ipdelSchema = new mongoose.Schema({
   ipaddress: String,
   date: String,
   time: String,
   username: String,
   deleteday: String
});

module.exports = mongoose.model("delIp", ipdelSchema);