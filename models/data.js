var mongoose = require("mongoose");

var dataSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  homephone: String,
  workphone: String,
  ssn: String,
  mm: String,
  dd: String,
  yyyy: String,
  residenceyears: String,
  employeryears: String,
  income: String,
  timetocontact: String,
  employername: String,
  jobtitle: String,
  residencecost: String,
  bankruptcy: String,
  loantype: String,
});

module.exports = mongoose.model("Data", dataSchema);
