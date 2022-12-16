var mongoose = require("mongoose");

var storehitSchema = new mongoose.Schema({
   username: String,
   offer1: String,
   offer2: String,
   offer3: String,
   offer4: String,
   offer5: String,
   date: String
});

module.exports = mongoose.model("Storehit", storehitSchema);