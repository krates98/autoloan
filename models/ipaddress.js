var mongoose = require("mongoose");

var ipSchema = new mongoose.Schema({
   ipaddress: { type: String, unique: true },
   date: String,
   time: String,
   username: String
});

module.exports = mongoose.model("ipAddress", ipSchema);
