var mongoose = require("mongoose");

var tranSchema = new mongoose.Schema({
    event: String,
    amount: Number,
    transtype: String,
    account: String,
    date: String,
    notes: String
});

module.exports = mongoose.model("Trans", tranSchema);